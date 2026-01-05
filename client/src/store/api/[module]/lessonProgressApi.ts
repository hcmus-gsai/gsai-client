import { baseApi } from "../baseApi";
import { CreateLessonProgressResponse, LessonProgressResponse } from "@/type/lessonProgress.type";

export const lessonProgressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createLearningProgress: builder.mutation<CreateLessonProgressResponse, string>({
            query: (courseId) => ({
                url: `/learning-progress/${courseId}`,
                method: 'POST',
                body: { courseId },
            }),
            invalidatesTags: ['LessonProgress', 'Enrollment'],
        }),

        getLearningProgressByCourse: builder.query<LessonProgressResponse, string>({
            query: (courseId) => `/learning-progress/${courseId}`,
            providesTags: (result, error, courseId) => [
                { type: 'LessonProgress', id: courseId },
                'LessonProgress',
            ],
        }),

        getLearningProgressByEnrollment: builder.query<LessonProgressResponse, string>({
            query: (enrollmentId) => `/enrollments/${enrollmentId}/progress`,
            providesTags: (result, error, enrollmentId) => [
                { type: 'LessonProgress', id: enrollmentId },
                'LessonProgress',
            ],
        }),
    }),
});

export const {
    useCreateLearningProgressMutation,
    useGetLearningProgressByCourseQuery,
    useLazyGetLearningProgressByCourseQuery,
    useGetLearningProgressByEnrollmentQuery,
    useLazyGetLearningProgressByEnrollmentQuery,
} = lessonProgressApi;