
import { baseApi } from '../baseApi';
import { UserResponse, UserRequest, CompletedLessonByDate } from '../../../type/user.type';
import { updateUser } from 'better-auth/api';
import { get } from 'http';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<UserResponse, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),

        updateUserProfile: builder.mutation<UserResponse, UserRequest>({
            query: (user) => ({
                url: '/users/profile',
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['User'],
        }),
        updateUserAvatar: builder.mutation<UserResponse, FormData>({
            query: (formData) => ({
                url: '/users/avatar',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),
        getUserAvatar: builder.query<UserResponse, void>({
            query: () => ({
                url: '/users/avatar',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        deleteUserAvatar: builder.mutation<UserResponse, void>({
            query: () => ({
                url: '/users/avatar',
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        // User Statistic
        getStreak: builder.query<number, void>({
            query: () => '/user-statistic/streak',
            providesTags: ['User'],
        }),

        getCompletedLessonsLast7Days: builder.query<CompletedLessonByDate[], void>({
            query: () => '/user-statistic/completed-lessons-last-7-days',
            providesTags: ['User'],
        }),
    })
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdateUserAvatarMutation,
    useGetUserAvatarQuery,
    useDeleteUserAvatarMutation,

    // User Statistic
    useGetStreakQuery,
    useGetCompletedLessonsLast7DaysQuery,
} = userApi;