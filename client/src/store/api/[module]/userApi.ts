
import { baseApi } from '../baseApi';
import { UserResponse, UserRequest} from '../../../type/user.type';

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
    })     
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} = userApi;