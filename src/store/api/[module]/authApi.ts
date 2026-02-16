import { baseApi } from '../baseApi';
import { SignUpRequest, SignUpResponse, SignInRequest, SignInResponse, User } from '../../../type/auth.type';
import Cookies from "js-cookie";
import { refresh } from 'next/cache';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Check Email Availability
        checkEmail: builder.mutation<{ isExist: boolean }, { email: string }>({
            query: (body) => ({
                url: '/auth/check-email',
                method: 'POST',
                body,
            }),
        }),

        // Sign Up
        signUp: builder.mutation<SignUpResponse, SignUpRequest>({
            query: (credentials) => ({
                url: '/auth/sign-up',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Sign In
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (credentials) => ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        refreshToken: builder.mutation({
            query: () => ({
                url: '/auth/refresh-token',
                method: 'POST',
            }),
        }),

        // Sign Out
        signOut: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/sign-out',
                method: 'POST',
                credentials: 'include', 
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.warn("Logout error ignored", error);
                }
            },
        }),

        // Get Profile (Protected Route)
        getProfile: builder.query<User, void>({
            query: () => '/auth/profile',
            providesTags: ['Auth'],
        }),

        // Forget Password
        forgetPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/forget-password',
                method: 'POST',
                body,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useCheckEmailMutation,
    useSignUpMutation,
    useSignInMutation,
    useSignOutMutation,
    useGetProfileQuery,
    useForgetPasswordMutation,
} = authApi;