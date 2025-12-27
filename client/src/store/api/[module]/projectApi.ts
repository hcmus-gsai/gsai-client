import { ProjectSubmissionResponse, SubmissionMuatationResponse } from '@/type/project.type';
import { baseApi } from '../baseApi';

export const projectApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getSubmission: builder.query<ProjectSubmissionResponse, string>({
            query: (lesson_id) => `/lessons/${lesson_id}/projects-submission`,
        }),

        submitProject: builder.mutation<SubmissionMuatationResponse, { lesson_id: string, github_url: string }>({
            query: ({ lesson_id, github_url  }) => ({
                url: `/lessons/${lesson_id}/projects-submission`,
                method: 'POST',
                body: {
                    github_url: github_url
                },
            }),
            invalidatesTags: (result, error, { lesson_id }) => [{ type: 'Project', id: lesson_id }],
        }),

        updateSubmittedProject: builder.mutation<SubmissionMuatationResponse, { lesson_id: string, github_url: string }>({
            query: ({ lesson_id, github_url  }) => ({
                url: `/lessons/${lesson_id}/projects-submission`,
                method: 'PUT',
                body: {
                    github_url: github_url
                },
            }),
            invalidatesTags: (result, error, { lesson_id }) => [{ type: 'Project', id: lesson_id }],
        }),
    }),
});

export const {
    useLazyGetSubmissionQuery,
    useSubmitProjectMutation,
    useUpdateSubmittedProjectMutation
} = projectApi