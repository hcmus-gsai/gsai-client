import { baseApi } from '../baseApi';
import { CreateCourseRequest } from '@/type/course.type';

export type MaterialType = 'document' | 'video' | 'project';

export interface CreateCourseResponse {
    id: string;
    message: string;
}

export interface CreateModuleDto {
    module_name: string;
    module_description?: string;
    order_index: number;
}

export interface UpdateModuleDto {
    module_name?: string;
    module_description?: string;
}

export interface ReorderModulesDto {
    module_ids: string[];
}

export interface ModuleItem {
    id: string;
    course_id: string;
    module_name: string;
    module_description?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface CreateModulesBatchResponse {
    message: string;
    modules: ModuleItem[];
}

export interface CreateLessonDto {
    name?: string;
    lesson_name: string;
    lesson_description?: string;
    moduleId?: string;
    orderIndex?: number;
    contentType?: 'video' | 'document' | 'quiz' | 'project';
    estimatedCompletionTime?: string;
}

export interface CreateLessonResponse {
    id: string;
    message: string;
}

export interface ReorderLessonsDto {
    lesson_ids: string[];
}

export interface UpsertQuizStructureDto {
    expired_date: number;
    duration: number;
    passing_score_percentage: number;
    questions: Array<{
        id?: string;
        question_text: string;
        question_type: 'multiple_choice';
        points: number;
        order_index?: number;
        options: Array<{
            id?: string;
            option_text: string;
            is_correct: boolean;
            order_index?: number;
        }>;
    }>;
}

const toNativeFile = (input: unknown): File | null => {
    if (input instanceof File) {
        return input;
    }

    const candidate = input as { originFileObj?: unknown } | null;
    if (candidate?.originFileObj instanceof File) {
        return candidate.originFileObj;
    }

    return null;
};

export const createClassApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCourseStep: builder.mutation<CreateCourseResponse, CreateCourseRequest>({
            query: (course) => ({
                url: '/courses',
                method: 'POST',
                body: course,
            }),
            invalidatesTags: ['Course'],
        }),

        patchCourseStep: builder.mutation<{ message: string }, { courseId: string; body: Partial<CreateCourseRequest> }>({
            query: ({ courseId, body }) => ({
                url: `/courses/${courseId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
        }),

        deleteCourseStep: builder.mutation<{ message: string }, string>({
            query: (courseId) => ({
                url: `/courses/${courseId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Course'],
        }),

        createModuleStep: builder.mutation<ModuleItem, { courseId: string; body: CreateModuleDto }>({
            query: ({ courseId, body }) => ({
                url: `/courses/${courseId}/modules`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
        }),

        createModulesBatchStep: builder.mutation<CreateModulesBatchResponse, { courseId: string; modules: CreateModuleDto[] }>({
            query: ({ courseId, modules }) => ({
                url: `/courses/${courseId}/modules/batch`,
                method: 'POST',
                body: { modules },
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }],
        }),

        patchModuleStep: builder.mutation<ModuleItem, { moduleId: string; body: UpdateModuleDto }>({
            query: ({ moduleId, body }) => ({
                url: `/modules/${moduleId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { moduleId }) => [{ type: 'Module', id: moduleId }],
        }),

        deleteModuleStep: builder.mutation<void, string>({
            query: (moduleId) => ({
                url: `/modules/${moduleId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Module', 'Lesson'],
        }),

        reorderModulesStep: builder.mutation<
            { message: string; course_id: string; new_order: string[] },
            { courseId: string; body: ReorderModulesDto }
        >({
            query: ({ courseId, body }) => ({
                url: `/courses/${courseId}/modules/reorder`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { courseId }) => [{ type: 'Course', id: courseId }, 'Module'],
        }),

        createLessonStep: builder.mutation<CreateLessonResponse, { moduleId: string; body: CreateLessonDto }>({
            query: ({ moduleId, body }) => {
                // Backend CreateLessonDto currently validates `name` and `moduleId` from body.
                // Adapt client payload while keeping `lesson_name` contract in UI code.
                const payload = {
                    ...body,
                    name: body.name ?? body.lesson_name,
                    moduleId,
                };

                return {
                    url: `/modules/${moduleId}/lessons`,
                    method: 'POST',
                    body: payload,
                };
            },
            invalidatesTags: ['Lesson'],
        }),

        patchLessonStep: builder.mutation<{ message: string }, { lessonId: string; body: Partial<CreateLessonDto> }>({
            query: ({ lessonId, body }) => ({
                url: `/lessons/${lessonId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
        }),

        deleteLessonStep: builder.mutation<void, string>({
            query: (lessonId) => ({
                url: `/lessons/${lessonId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Lesson', 'Document', 'Video', 'Project'],
        }),

        reorderLessonsStep: builder.mutation<
            { message: string; module_id: string; new_order: string[] },
            { moduleId: string; body: ReorderLessonsDto }
        >({
            query: ({ moduleId, body }) => ({
                // Backend route currently uses /lessons/:id/reorder where :id is moduleId
                url: `/lessons/${moduleId}/reorder`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { moduleId }) => [{ type: 'Module', id: moduleId }, 'Lesson'],
        }),

        createDocumentMaterialStep: builder.mutation<{ message: string }, { lessonId: string; file: unknown }>({
            query: ({ lessonId, file }) => {
                const nativeFile = toNativeFile(file);
                const formData = new FormData();
                if (nativeFile) {
                    formData.append('file', nativeFile);
                }

                return {
                    url: `/lessons/${lessonId}/documents`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Document'],
        }),

        createVideoMaterialStep: builder.mutation<{ message: string; video?: { id: string } }, { lessonId: string; file: unknown; video_name: string }>({
            query: ({ lessonId, file, video_name }) => {
                const nativeFile = toNativeFile(file);
                const formData = new FormData();
                if (nativeFile) {
                    formData.append('file', nativeFile);
                }
                formData.append('video_name', video_name);

                return {
                    url: `/lessons/${lessonId}/videos`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Video'],
        }),

        createProjectMaterialStep: builder.mutation<{ message: string; lesson?: { id: string } }, { lessonId: string; file: unknown; expired_date: number }>({
            query: ({ lessonId, file, expired_date }) => {
                const nativeFile = toNativeFile(file);
                const formData = new FormData();
                if (nativeFile) {
                    formData.append('file', nativeFile);
                }
                formData.append('expired_date', expired_date.toString());

                return {
                    url: `/lessons/${lessonId}/projects`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Project'],
        }),

        upsertQuizStructureStep: builder.mutation<
            { quiz: { id: string }; questions: any[] },
            { lessonId: string; body: UpsertQuizStructureDto }
        >({
            query: ({ lessonId, body }) => ({
                url: `/lessons/${lessonId}/quizzes/structure`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Quiz'],
        }),

        patchMaterialStep: builder.mutation<
            { message: string; material: { id: string; material_type: MaterialType; material_name?: string; expired_date?: number } },
            { materialId: string; body: { material_type?: MaterialType; material_name?: string; expired_date?: number } }
        >({
            query: ({ materialId, body }) => ({
                url: `/materials/${materialId}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Document', 'Video', 'Project'],
        }),

        deleteMaterialStep: builder.mutation<void, string>({
            query: (materialId) => ({
                url: `/materials/${materialId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Document', 'Video', 'Project'],
        }),
    }),
});

export const {
    useCreateCourseStepMutation,
    usePatchCourseStepMutation,
    useDeleteCourseStepMutation,

    useCreateModuleStepMutation,
    useCreateModulesBatchStepMutation,
    usePatchModuleStepMutation,
    useDeleteModuleStepMutation,
    useReorderModulesStepMutation,

    useCreateLessonStepMutation,
    usePatchLessonStepMutation,
    useDeleteLessonStepMutation,
    useReorderLessonsStepMutation,

    useCreateDocumentMaterialStepMutation,
    useCreateVideoMaterialStepMutation,
    useCreateProjectMaterialStepMutation,
    useUpsertQuizStructureStepMutation,
    usePatchMaterialStepMutation,
    useDeleteMaterialStepMutation,
} = createClassApi;
