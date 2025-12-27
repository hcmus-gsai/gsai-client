import { ProjectSubmissionResponse } from '@/type/project.type';
import { baseApi } from '../baseApi';

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubmission: builder.query<ProjectSubmissionResponse, string>({
            query: (lesson_id) => `/lessons/${lesson_id}/projects-submission`,
        }),
    }),
});

export const {
    useLazyGetSubmissionQuery
} = projectApi