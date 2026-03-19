import { baseApi } from '../baseApi';
import { IVideoGenJobResponse } from '@/type/videoGenJob';

export const videoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Transcribe audio file to text
        audioTranscribe: builder.mutation<{ transcript: string, message: string }, { audioFile: File }>({
            query: ({ audioFile }) => {
                const formData = new FormData();
                formData.append('file', audioFile);
                return {
                    url: '/voice/transcribe',
                    method: 'POST',
                    body: formData,
                };
            },
        }),

        // Get, Create Register Voice of user
        getRegisterVoice: builder.query<
            { voice_name: string; audio_url: string }[], 
            void
        >({
            query: () => ({
                url: '/voice-cloning/register',
                method: 'GET',
            }),
        }),

        // Create Generation job
        createVideoGenJob: builder.mutation<IVideoGenJobResponse, { videoName: string }>({
            query: ({ videoName }) => {
                return {
                    url: '/video-generation/requests',
                    method: 'POST',
                    body: { videoName },
                };
            },
        }),

        // Upload Voice for Video Generation
        uploadVoice: builder.mutation<IVideoGenJobResponse, { jobId: string, audios: File[] }>({
            query: ({ jobId, audios }) => {
                const formData = new FormData();
                audios.forEach((file) => {
                    formData.append('files', file);
                })
                return {
                    url: `/video-generation/${jobId}/voices`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),

        // Upload Slide for Video Generation
        uploadSlide: builder.mutation<IVideoGenJobResponse, { jobId: string, slide: File }>({
            query: ({ jobId, slide }) => {
                const formData = new FormData();
                formData.append('file', slide);
                return {
                    url: `/video-generation/${jobId}/slides`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),

        // Start Generation Job
        startGeneration: builder.mutation<{ message: string }, { jobId: string }>({
            query: ({ jobId }) => {
                return {
                    url: `/video-generation/${jobId}/generate`,
                    method: 'POST',
                };
            },
        }),

    }),

});

export const {
    // Transcribe audio file to text
    useAudioTranscribeMutation,

    // Get, Create Register Voice of user
    useGetRegisterVoiceQuery,

   // Create Generation job
    useCreateVideoGenJobMutation,

    // Upload Voice for Video Generation
    useUploadVoiceMutation,

    // Upload Slide for Video Generation
    useUploadSlideMutation,

    // Start Generation Job
    useStartGenerationMutation,

} = videoApi;