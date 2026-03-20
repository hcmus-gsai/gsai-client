import { IVideoStatusCard, JobStatus } from "@/type/videoGenJob";
import { baseApi } from "../baseApi";
    
interface RawVideoGenJob {
    id: string;
    video_name: string;
    job_status: JobStatus;
    video_gen_status: JobStatus;
    ocr_status: JobStatus;
    create_at: string | Date;
    completed_at: string | Date;
    error_message?: string;
}

interface RawVideoGenerationResponse {
    videoGenJob: RawVideoGenJob[] | RawVideoGenJob;
    message: string;
}

interface RawVideoDetail {
    id: string;
    video_name: string;
    job_status: JobStatus;
    video_gen_status: JobStatus;
    ocr_status: JobStatus;
    create_at: string | Date;
    completed_at: string | Date;
    error_message?: string;
    generated_video_url?: string;
    ocr_json?: unknown;
}

interface RawVideoDetailResponse {
    videoGenJob: RawVideoDetail;
    message: string;
}

export interface IVideoGenerationDetail {
    id: string;
    videoName: string;
    jobStatus: JobStatus;
    videoGenStatus: JobStatus;
    ocrStatus: JobStatus;
    createAt: string | Date;
    completedAt: string | Date;
    errorMessage?: string;
    generatedVideoUrl?: string;
    ocrJson?: unknown;
}


export const aiStudioApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVideoGenerationRequests: builder.query<IVideoStatusCard[], void>({
            query: () => `video-generation/requests`,
            transformResponse: (response: RawVideoGenerationResponse) => {
                const jobs = Array.isArray(response.videoGenJob)
                    ? response.videoGenJob
                    : [response.videoGenJob];

                return jobs.map((job) => ({
                    id: job.id,
                    videoName: job.video_name,
                    jobStatus: job.job_status,
                    videoGenStatus: job.video_gen_status,
                    ocrStatus: job.ocr_status,
                    createAt: job.create_at,
                    completedAt: job.completed_at,
                    errorMessage: job.error_message,
                }));
            },
        }),

        deleteVideoGenerationRequest: builder.mutation<void, string>({
            query: (jobId) => ({
                url: `video-generation/requests/${jobId}`,
                method: 'DELETE',
            }),
        }),

        getVideoGenerationRequestById: builder.query<IVideoGenerationDetail, string>({
            query: (jobId) => `video-generation/requests/${jobId}`,
            transformResponse: (response: RawVideoDetailResponse) => {
                const job = response.videoGenJob;

                return {
                    id: job.id,
                    videoName: job.video_name,
                    jobStatus: job.job_status,
                    videoGenStatus: job.video_gen_status,
                    ocrStatus: job.ocr_status,
                    createAt: job.create_at,
                    completedAt: job.completed_at,
                    errorMessage: job.error_message,
                    generatedVideoUrl: job.generated_video_url,
                    ocrJson: job.ocr_json,
                };
            },
        }),

        assignVideoGenerationToLesson: builder.mutation<{ message: string }, { jobId: string; lessonId: string }>({
            query: ({ jobId, lessonId }) => ({
                url: `video-generation/${jobId}/assign/${lessonId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetVideoGenerationRequestsQuery,
    useDeleteVideoGenerationRequestMutation,
    useLazyGetVideoGenerationRequestByIdQuery,
    useAssignVideoGenerationToLessonMutation,
} = aiStudioApi;

