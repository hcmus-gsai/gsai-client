'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import { signOut } from '../slice/authSlice';
import { refreshAccessToken } from './authRefresh';



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

  // Only attempt refresh if we get 401. The refresh mutex is shared with the streaming chat
  // client (`chatStream.ts`), which bypasses RTK Query with a hand-rolled `fetch` — sharing one
  // promise means a token expiring mid-page never triggers two concurrent refresh calls.
  if (result.error?.status === 401) {
    const success = await refreshAccessToken(() => api.dispatch(signOut()));
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