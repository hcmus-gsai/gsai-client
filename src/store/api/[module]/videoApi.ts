import { baseApi } from '../baseApi';

export const videoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVideoUrl: builder.query<{ file_url: string }, string>({
            query: (lessonId) => `/lessons/${lessonId}/video`,
            providesTags: ['Video'],
        }),
    })
});

export const { useLazyGetVideoUrlQuery } = videoApi;
