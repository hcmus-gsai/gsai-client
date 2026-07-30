
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
    QAHistoryResponse,
    SubmissionMuatationResponse,
    SubmissionHistoryItem,
    CreateSocraticSessionResponse,
    ListSocraticSessionsResponse,
    SocraticSessionMessagesResponse,
    SendSocraticMessageRequest,
    SendSocraticMessageResponse,
    QAV2CreateSessionResponse,
    QAV2CurrentSessionResponse,
    QAV2StartInterviewResponse,
    QAV2RespondResponse,
    QAV2GradingReport,
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
            query: ({ lessonId, message, answer_mode }) => ({
                url: `/lessons/${lessonId}/qa/message`,
                method: 'POST',
                body: { message, answer_mode },
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

        // ==================== Project Q&A v2 Endpoints ====================
        // Luồng vấn đáp 3 câu + báo cáo chấm điểm chi tiết (giống showcase, nhưng
        // chạy trên tài khoản thật — server tự lấy userId từ access token).

        /**
         * Create a Q&A v2 session (Agent 1 sinh câu hỏi)
         * POST /lessons/:lessonId/qa/v2/sessions
         */
        createProjectQAV2Session: builder.mutation<QAV2CreateSessionResponse, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/qa/v2/sessions`,
                method: 'POST',
            }),
        }),

        /**
         * Bắt đầu lại phiên vấn đáp từ đầu (retake) — sinh bộ câu hỏi mới,
         * kết quả lần trước được lưu vào previous_attempts.
         * POST /lessons/:lessonId/qa/v2/retake
         */
        retakeProjectQAV2Session: builder.mutation<QAV2CreateSessionResponse, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/qa/v2/retake`,
                method: 'POST',
            }),
        }),

        /**
         * Get current Q&A v2 session state
         * GET /lessons/:lessonId/qa/v2/sessions/current
         */
        getProjectQAV2Session: builder.query<QAV2CurrentSessionResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/qa/v2/sessions/current`,
        }),

        /**
         * Start interview / get next question
         * POST /lessons/:lessonId/qa/v2/start-interview
         */
        startProjectQAV2Interview: builder.mutation<QAV2StartInterviewResponse, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/qa/v2/start-interview`,
                method: 'POST',
            }),
        }),

        /**
         * Send student answer
         * POST /lessons/:lessonId/qa/v2/respond
         */
        respondProjectQAV2: builder.mutation<QAV2RespondResponse, { lessonId: string; student_message: string }>({
            query: ({ lessonId, student_message }) => ({
                url: `/lessons/${lessonId}/qa/v2/respond`,
                method: 'POST',
                body: { student_message },
            }),
        }),

        /**
         * Get grading report (feedback từng câu)
         * GET /lessons/:lessonId/qa/v2/report
         */
        getProjectQAV2Report: builder.query<QAV2GradingReport, string>({
            query: (lessonId) => `/lessons/${lessonId}/qa/v2/report`,
        }),

        /**
         * Persist grading report
         * PATCH /lessons/:lessonId/qa/v2/result
         */
        saveProjectQAV2Result: builder.mutation<
            { success: boolean; session_id: string | null; stage: string },
            { lessonId: string; grading_report: QAV2GradingReport }
        >({
            query: ({ lessonId, grading_report }) => ({
                url: `/lessons/${lessonId}/qa/v2/result`,
                method: 'PATCH',
                body: { grading_report },
            }),
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

        // ==================== Teacher View Endpoints ====================
        getAllSubmissions: builder.query<SubmissionHistoryItem, null>({
            query: () => `projects-submission/all`,
        }),

        // ==================== Project Socratic Chat Endpoints ====================

        createSocraticSession: builder.mutation<CreateSocraticSessionResponse, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}/socratic/sessions`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, lessonId) => [
                { type: 'ChatModule', id: `socratic-${lessonId}` }
            ],
        }),

        listSocraticSessions: builder.query<ListSocraticSessionsResponse, string>({
            query: (lessonId) => `/lessons/${lessonId}/socratic/sessions`,
            providesTags: (result, error, lessonId) => [
                { type: 'ChatModule', id: `socratic-${lessonId}` }
            ],
        }),

        getSocraticSessionMessages: builder.query<SocraticSessionMessagesResponse, { lessonId: string; sessionId: string }>({
            query: ({ lessonId, sessionId }) => `/lessons/${lessonId}/socratic/sessions/${sessionId}/messages`,
            providesTags: (result, error, { lessonId, sessionId }) => [
                { type: 'ChatModule', id: `socratic-${lessonId}-${sessionId}` }
            ],
        }),

        sendSocraticMessage: builder.mutation<SendSocraticMessageResponse, { lessonId: string; sessionId: string } & SendSocraticMessageRequest>({
            query: ({ lessonId, sessionId, message, answer_mode }) => ({
                url: `/lessons/${lessonId}/socratic/sessions/${sessionId}/messages`,
                method: 'POST',
                body: { message, answer_mode },
            }),
            invalidatesTags: (result, error, { lessonId, sessionId }) => [
                { type: 'ChatModule', id: `socratic-${lessonId}` },
                { type: 'ChatModule', id: `socratic-${lessonId}-${sessionId}` }
            ],
        }),

        deleteSocraticSession: builder.mutation<void, { lessonId: string; sessionId: string }>({
            query: ({ lessonId, sessionId }) => ({
                url: `/lessons/${lessonId}/socratic/sessions/${sessionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { lessonId, sessionId }) => [
                { type: 'ChatModule', id: `socratic-${lessonId}` },
                { type: 'ChatModule', id: `socratic-${lessonId}-${sessionId}` }
            ],
        }),


    }),
});

export const {
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

    // Project Q&A v2 hooks
    useCreateProjectQAV2SessionMutation,
    useRetakeProjectQAV2SessionMutation,
    useGetProjectQAV2SessionQuery,
    useLazyGetProjectQAV2SessionQuery,
    useStartProjectQAV2InterviewMutation,
    useRespondProjectQAV2Mutation,
    useLazyGetProjectQAV2ReportQuery,
    useSaveProjectQAV2ResultMutation,

    // Project Submission hooks
    useSubmitProjectMutation,
    useUpdateSubmissionMutation,
    useGetSubmissionQuery,
    useLazyGetSubmissionQuery,
    useGetSubmitJsonQuery,
    useLazyGetSubmitJsonQuery,

    // Teacher view hooks
    useGetAllSubmissionsQuery,

    // Project Socratic hooks
    useCreateSocraticSessionMutation,
    useListSocraticSessionsQuery,
    useLazyGetSocraticSessionMessagesQuery,
    useSendSocraticMessageMutation,
    useDeleteSocraticSessionMutation,

} = projectApi;
