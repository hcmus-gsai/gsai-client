
import { baseApi } from '../baseApi';
import { CourseResponse} from '../../../type/course.type';
import { ModuleResponse} from '../../../type/module.type';

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
    })     
});

export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useLazyGetCourseByIdQuery,
    useGetCourseModulesQuery,
    useGetCoursesByLessonIdQuery,
} = courseApi;