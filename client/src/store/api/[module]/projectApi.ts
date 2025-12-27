import {
    ProjectDocumentResponse,
    ProjectTranscriptResponse,
    ProjectSubmissionResponse,
    SubmitProjectRequest,
    UpdateSubmissionRequest,
    SubmitJsonResponse,
    StartQASessionResponse,
    SendQAMessageRequest,
    SendQAMessageResponse,
    QAHistoryResponse
} from '@/type/project.type';
import { baseApi } from '../baseApi';

export const projectApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // ==================== Project Document Endpoints ====================

        /**
         * Create and upload project document (Teacher only)
         * POST /lessons/:id/projects
         */
        createProjectDocument: builder.mutation<{ lesson: any; message: string }, { lessonId: string; file: File; expired_date: number }>({
            query: ({ lessonId, file, expired_date }) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('expired_date', expired_date.toString());

                return {
                    url: `/lessons/${lessonId}/projects`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { lessonId }) => [
                { type: 'Document', id: lessonId }
            ],
        }),

        /**
         * Get project document
         * GET /lessons/:id/projects
         */
        getProjectDocument: builder.query<ProjectDocumentResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/projects`,
            providesTags: (result, error, lessonId) => [
                { type: 'Document', id: lessonId }
            ],
        }),

        /**
         * Get project transcript
         * GET /lessons/:id/project-transcript
         */
        getProjectTranscript: builder.query<ProjectTranscriptResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/project-transcript`,
        }),

        /**
         * Delete project document (Teacher only)
         * DELETE /lessons/:id/projects
         */
        deleteProjectDocument: builder.mutation<void, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/projects`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, lessonId) => [
                { type: 'Document', id: lessonId }
            ],
        }),

        // ==================== Project Q&A Endpoints ====================

        /**
         * Start Q&A session for a project assignment (Student only)
         * POST /lessons/:lessonId/qa/start
         */
        startQASession: builder.mutation<StartQASessionResponse, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/qa/start`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, lessonId) => [
                { type: 'ChatModule', id: `qa-${lessonId}` }
            ],
        }),

        /**
         * Send message in Q&A session (Student only)
         * POST /lessons/:lessonId/qa/message
         */
        sendQAMessage: builder.mutation<SendQAMessageResponse, { lessonId: string } & SendQAMessageRequest>({
            query: ({ lessonId, message }) => ({
                url: `/lessons/${lessonId}/qa/message`,
                method: 'POST',
                body: { message },
            }),
            // Don't invalidate tags to prevent auto-refetch that overwrites local state
            // The component handles state updates manually
        }),

        /**
         * Get Q&A conversation history (Student only)
         * GET /lessons/:lessonId/qa/history
         */
        getQAHistory: builder.query<QAHistoryResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/qa/history`,
            providesTags: (result, error, lessonId) => [
                { type: 'ChatModule', id: `qa-${lessonId}` }
            ],
        }),

        /**
         * Delete Q&A conversation history (Student only)
         * DELETE /lessons/:lessonId/qa/history
         */
        deleteQAHistory: builder.mutation<void, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/qa/history`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, lessonId) => [
                { type: 'ChatModule', id: `qa-${lessonId}` }
            ],
        }),

        // ==================== Project Submission Endpoints ====================

        /**
         * Submit project
         * POST /lessons/:id/projects-submission
         */
        submitProject: builder.mutation<any, { lessonId: string } & SubmitProjectRequest>({
            query: ({ lessonId, github_url }) => ({
                url: `/lessons/${lessonId}/projects-submission`,
                method: 'POST',
                body: { github_url },
            }),
            invalidatesTags: (result, error, { lessonId }) => [
                { type: 'Document', id: `submission-${lessonId}` }
            ],
        }),

        /**
         * Update project submission
         * PUT /lessons/:id/projects-submission
         */
        updateSubmission: builder.mutation<any, { lessonId: string } & UpdateSubmissionRequest>({
            query: ({ lessonId, github_url }) => ({
                url: `/lessons/${lessonId}/projects-submission`,
                method: 'PUT',
                body: { github_url },
            }),
            invalidatesTags: (result, error, { lessonId }) => [
                { type: 'Document', id: `submission-${lessonId}` }
            ],
        }),

        /**
         * Get project submission
         * GET /lessons/:id/projects-submission
         */
        getSubmission: builder.query<ProjectSubmissionResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/projects-submission`,
            providesTags: (result, error, lessonId) => [
                { type: 'Document', id: `submission-${lessonId}` }
            ],
        }),

        /**
         * Get submit_json from project submission (Student only)
         * GET /lessons/:id/submit_json
         */
        getSubmitJson: builder.query<SubmitJsonResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/submit_json`,
            providesTags: (result, error, lessonId) => [
                { type: 'Document', id: `submit-json-${lessonId}` }
            ],
        }),
    }),
});

export const {
    // Project Document hooks
    useCreateProjectDocumentMutation,
    useGetProjectDocumentQuery,
    useLazyGetProjectDocumentQuery,
    useGetProjectTranscriptQuery,
    useLazyGetProjectTranscriptQuery,
    useDeleteProjectDocumentMutation,

    // Project Q&A hooks
    useStartQASessionMutation,
    useSendQAMessageMutation,
    useGetQAHistoryQuery,
    useLazyGetQAHistoryQuery,
    useDeleteQAHistoryMutation,

    // Project Submission hooks
    useSubmitProjectMutation,
    useUpdateSubmissionMutation,
    useGetSubmissionQuery,
    useLazyGetSubmissionQuery,
    useGetSubmitJsonQuery,
    useLazyGetSubmitJsonQuery,
} = projectApi;