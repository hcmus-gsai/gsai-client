'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import { signOut } from '../slice/authSlice';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Base query with JWT token from httpOnly cookies
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include', // Automatically sends httpOnly cookies
  timeout: 180_000, // 3 minutes timeout (chatbot API may take 60-90s on cold start)
});


// Mutex to prevent multiple refresh calls
let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Only attempt refresh if we get 401
  if (result.error?.status === 401) {

    // If a refresh is already in progress, wait for it
    if (refreshPromise) {
      console.log('Refresh already in progress, waiting...');
      const refreshSuccess = await refreshPromise;
      if (refreshSuccess) {
        // Retry the original request
        return baseQuery(args, api, extraOptions);
      } else {
        // If refresh failed, we fail too (and let the logout happen from the first failure)
        // api.dispatch(signOut()); // Redundant, handled below
        return result;
      }
    }

    console.log('Access token expired, attempting refresh...');

    // Start a new refresh process
    refreshPromise = (async () => {
      try {
        const refreshResult = await baseQuery(
          '/auth/refresh-token',
          api,
          extraOptions
        );
        if (refreshResult.data) {
          console.log("Token refreshed successfully");
          return true;
        } else {
          console.log("Refresh token failed/expired");
          api.dispatch(signOut());
          return false;
        }
      } catch (e) {
        console.error("Refresh error:", e);
        api.dispatch(signOut());
        return false;
      }
    })();

    const success = await refreshPromise;
    refreshPromise = null; // Reset mutex

    if (success) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // This line is CRITICAL — always return result
  return result;
};


// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Course', 'Module', 'Lesson', 'Enrollment', 'Quiz', 'ChatModule', 'IVideoGenJob', 'Document', 'Project', 'LessonProgress', 'Video'],
  endpoints: () => ({}),
});