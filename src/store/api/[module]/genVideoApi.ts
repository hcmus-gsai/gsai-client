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

        // Register voice of user
        registerVoice: builder.mutation<{ message: string }, { voice_name: string, audio_file: File, audio_transcript: string }>({
            query: ({ voice_name, audio_file, audio_transcript }) => {
                const formData = new FormData();
                formData.append('file', audio_file);
                formData.append('voice_name', voice_name);
                formData.append('audio_transcript', audio_transcript); //
                return {
                    url: '/voice-cloning/register',
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

        // Process PPTX: Convert PPTX to PDF + Extract speaker notes
        processPptx: builder.mutation<{ pdfBuffer: string; scripts: { slideNumber: number; content: string }[] }, { file: File }>({
            query: ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: '/video-generation/process-pptx',
                    method: 'POST',
                    body: formData,
                };
            },
        }),

    }),

});

export const {
    // Transcribe audio file to text
    useAudioTranscribeMutation,

    // Get, Create Register Voice of user
    useRegisterVoiceMutation,
    useGetRegisterVoiceQuery,

   // Create Generation job
    useCreateVideoGenJobMutation,

    // Upload Voice for Video Generation
    useUploadVoiceMutation,

    // Upload Slide for Video Generation
    useUploadSlideMutation,

    // Start Generation Job
    useStartGenerationMutation,

    // Process PPTX
    useProcessPptxMutation,

} = videoApi;