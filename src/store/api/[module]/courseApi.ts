
import { baseApi } from '../baseApi';
import { CourseListResponse, CourseQueryParams, CourseResponse } from '../../../type/course.type';
import { ModuleResponse } from '../../../type/module.type';
import { store } from '@/store/store';
import { get } from 'http';

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query<CourseResponse, void>({
            query: () => '/courses',
            providesTags: ['Course'],
        }),

        getCourseById: builder.query<CourseResponse, string>({
            query: (course_id) => `/courses/${course_id}`,
            providesTags: (result, error, course_id) => [{ type: 'Course', id: course_id }],
        }),

        getCourseModules: builder.query<ModuleResponse, string>({
            query: (course_id) => `/courses/${course_id}/modules`,
            providesTags: (result, error, id) => [{ type: 'Course', id }],
        }),

        getCoursesByLessonId: builder.query<CourseResponse, string>({
            query: (lesson_id) => `/courses/lesson/${lesson_id}`,
            providesTags: ['Course'],
        }),

        searchCourses: builder.query<CourseListResponse, CourseQueryParams>({
            query: (params) => ({
                url: '/courses/search',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Course' as const, id })),
                        { type: 'Course', id: 'LIST' },
                    ]
                    : [{ type: 'Course', id: 'LIST' }],
        }),

        getAllCategories: builder.query<{ message: string; data: string[] }, void>({
            query: () => '/courses/categories',
            providesTags: ['Course'],
        }),

        // getTeacherInfo : builder.query<{message: string; data}, void>({
        //     query: (teacher_id) => `/courses/teacher/${teacher_id}`,
        //     providesTags: ['Course']
        // })

        getCoursesByTeacher: builder.query<CourseListResponse, CourseQueryParams>({
            query: (params) => ({
                url: `/courses/teacher`,
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Course' as const, id })),
                        { type: 'Course', id: 'LIST' },
                    ]
                    : [{ type: 'Course', id: 'LIST' }],
        }),

        getTeacherStatistic: builder.query<{ message: string; data: { total_courses: number; total_enrollments: number } }, void>({
            query: () => '/courses/teacher/me/statistic',
            providesTags: ['Course'],
        }),
        
    }),
});

export const {
    useGetCoursesQuery,
    useLazyGetCoursesQuery,
    useGetCourseByIdQuery,
    useLazyGetCourseByIdQuery,
    useGetCourseModulesQuery,
    useLazyGetCourseModulesQuery,
    useGetCoursesByLessonIdQuery,
    useSearchCoursesQuery,
    useLazySearchCoursesQuery,
    useGetAllCategoriesQuery,
    useLazyGetAllCategoriesQuery,
    useGetCoursesByTeacherQuery,
    useGetTeacherStatisticQuery,
} = courseApi;