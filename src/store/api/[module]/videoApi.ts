import { baseApi } from '../baseApi';

export interface VideoMaterial {
    id: string;
    lesson_id: string;
    video_name: string;
    video_url: string;
    video_duration: number;
    video_size: number;
    video_status: 'processing' | 'ready' | 'failed';
}

export const videoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVideoUrl: builder.query<VideoMaterial, string>({
            query: (lessonId) => `/lessons/${lessonId}/video`,
            providesTags: ['Video'],
        }),
    })
});

export const { useLazyGetVideoUrlQuery } = videoApi;
