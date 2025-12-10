
import { baseApi } from '../baseApi';
import { LessonResponse } from '../../../type/lesson.type';

export const moduleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getModuleLessons: builder.query<LessonResponse, string>({
            query: (module_id) => `/modules/${module_id}/lessons`,
            providesTags: (result, error, id) => [{ type: 'Module', id }],
        }),
    })     
});

export const {
    useLazyGetModuleLessonsQuery,
} = moduleApi;