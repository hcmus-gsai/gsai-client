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


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Only attempt refresh if we get 401
  if (result.error?.status === 401) {
    console.log('Access token expired, attempting refresh...');

    const refreshResult = await baseQuery(
      '/auth/refresh-token', // your refresh endpoint
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Cookies are automatically updated by the server
      // No need to dispatch to Redux - just retry the original request
      console.log('Token refreshed successfully');
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → logout
      console.log('Refresh token failed or expired. Logging out...');
      api.dispatch(signOut());
    }
  }

  // This line is CRITICAL — always return result
  return result;
};


// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Course', 'Module', 'Lesson', 'Enrollment', 'Quiz', 'ChatModule', 'IVideoGenJob', 'Document', 'Project', 'LessonProgress'],
  endpoints: () => ({}),
});