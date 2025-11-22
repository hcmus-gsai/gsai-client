import { baseApi } from './baseApi';
import { SignUpRequest, SignUpResponse, SignInRequest, SignInResponse, User } from '../../type/auth.type';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Check Email Availability
        checkEmail: builder.mutation<{ available: boolean }, { email: string }>({
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
            // Store tokens after successful signup
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                } catch (error) {
                    console.error('Sign up failed:', error);
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // Sign In
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (credentials) => ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials,
            }),
            // Store tokens after successful login
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                } catch (error) {
                    console.error('Sign in failed:', error);
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // Sign Out
        signOut: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/sign-out',
                method: 'POST',
            }),
            // Clear tokens after logout
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            },
            invalidatesTags: ['Auth'],
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