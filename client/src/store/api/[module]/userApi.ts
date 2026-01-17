
import { baseApi } from '../baseApi';
import { UserResponse, UserRequest } from '../../../type/user.type';
import { updateUser } from 'better-auth/api';

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
    })
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdateUserAvatarMutation,
    useGetUserAvatarQuery,
} = userApi;