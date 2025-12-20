'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import { signOut, setCredentials } from '../slice/authSlice';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Base query with JWT token
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
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
      const user = (api.getState() as RootState).auth.user;

      // Update credentials in Redux store
      api.dispatch(
        setCredentials({
          user,
          accessToken: (refreshResult.data as any).accessToken,
          refreshToken: (refreshResult.data as any).refreshToken?.refreshToken, // if you rotate
        })
      );

      // Retry original request with new token
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
  tagTypes: ['Auth', 'User', 'Course', 'Module', 'Lesson', 'Enrollment', 'Quiz', 'ChatModule', 'IVideoGenJob', 'Document'],
  endpoints: () => ({}),
});