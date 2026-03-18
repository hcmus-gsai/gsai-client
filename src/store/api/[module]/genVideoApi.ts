import { baseApi } from '../baseApi';

export enum JobStatus {
    CREATED = 'CREATED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface VideoGenerationJob {
    id: string;
    teacher_id: string;
    lesson_id: string;

    video_name: string;

    job_status: JobStatus;
    lipsync_status: JobStatus;
    ocr_status: JobStatus;

    lipsync_image_url?: string;

    voice_sample_audio_url: string[];

    slide_file_url?: string;

    transcript_text?: string;
    error_message?: string;

    generated_video_url?: string;

    ocr_json?: string;

    create_at: string;
    completed_at: string;   
}

export interface VideoGenJobRes {
    videoGenJob: VideoGenerationJob;
    message: string;
}

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
        createVideoGenJob: builder.mutation<VideoGenJobRes, { videoName: string }>({
            query: ({ videoName }) => {
                const formData = new FormData();
                formData.append('videoName', videoName);
                return {
                    url: '/video-generation/requests',
                    method: 'POST',
                };
            },
        }),

        // Upload Voice for Video Generation
        uploadVoice: builder.mutation<VideoGenJobRes, { jobId: string, audios: File[] }>({
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
        uploadSlide: builder.mutation<VideoGenJobRes, { jobId: string, slide: File }>({
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