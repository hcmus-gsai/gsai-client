
import { baseApi } from '../baseApi';
import { CourseResponse, Course, SearchParams, CourseFilterParams } from '../../../type/course.type';
import { string } from 'better-auth';

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        //POST: Create new course (optional thumbnail_url)

        createCourse: builder.mutation<CourseResponse, Course>({
            query: (course) => ({
                url:  '/courses',
                method: 'POST',
                body: course,
            }),
            invalidatesTags: ['Course'],
        }),

        //GET: Get all course created by the the teacher (all teacher)
        getCoursesByTeacher: builder.query<CourseResponse, void>({
            query : () => '/courses/teacher',
            providesTags: ['Course'],
        }),

        //GET: Get all course created by the current teacher user
        getCoursesByTeacherId: builder.query<CourseResponse, string>({
            query: (teacher_id) => `/courses/teacher/${teacher_id}`,
            providesTags: ['Course'],
        }),

        //GET: Get course detailed by id

        getCourseById: builder.query<CourseResponse, string>({
            query:(course_id) => `/courses/${course_id}`,
            providesTags: (result, error, id) => [{ type: 'Course', id }],
        }),

        //GET: get courses
        getCourses: builder.query<CourseResponse, void>({
            query: () => '/courses',
            providesTags: ['Course'],
        }),

        //PUT: update course by id

        updateCourseInfo: builder.mutation<CourseResponse, {course_id:string, course: Partial<Course>}>({
            query: ({course_id, course}) => ({
                url: `/courses/${course_id}`,
                method: 'PUT',
                body: course,
            }),
            invalidatesTags: (result, error, { course_id }) => [{ type: 'Course', id: course_id }],

        }),

        //PATCH: update course status
        updateCourseStatus: builder.mutation<CourseResponse, {course_id:string, is_active:boolean}>({
            query: ({course_id, is_active}) => ({
                url: `/courses/${course_id}/status`,
                method: 'PATCH',
                body: {is_active},
            }),
            invalidatesTags: (result, error, { course_id }) => [{ type: 'Course', id: course_id }],

        }),

        //DELETE: delete or deactivate course by id

        deleteCourseById: builder.mutation<CourseResponse, string>({
            query: (course_id) => ({
                url: `/courses/${course_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Course'],
        }),


        //POST: Update/upload course thumbnail
        updateCourseThumbnail: builder.mutation<CourseResponse, {course_id:string, thumbnail_url:string}>({
            query: ({course_id, thumbnail_url}) => ({
                url: `/courses/${course_id}/thumbnail`,
                method: 'POST',
                body: {thumbnail_url},
            }),
            invalidatesTags: (result, error, { course_id }) => [{ type: 'Course', id: course_id }],

        }),

        //DELETE: delete course thumbnail
        deleteCourseThumbnail: builder.mutation<CourseResponse, {course_id:string}>({
            query: ({course_id}) => ({
                url: `/courses/${course_id}/thumbnail`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { course_id }) => [{ type: 'Course', id: course_id }],
        }),


        //GET: get course info

        getCourseInfo: builder.query<CourseResponse, string>({
            query: (course_id) => `/courses/${course_id}/info`,
            providesTags: (result, error, id) => [{ type: 'Course', id }],
        }),

        getCoursePreview: builder.query<any, string>({
            query: (course_id) => `/courses/${course_id}/preview`,
        }),

        // GET /courses/search - Search courses by keywords

        searchCourses: builder.query<CourseResponse, SearchParams>({
            query: (params) =>({
                url: '/courses/search',
                params: params,
            }),
            providesTags: ['Course'],
        }),

        filterCourses: builder.query<CourseResponse, CourseFilterParams>({
            query: (params) => ({
              url: '/courses/filter',
              params: params,
            }),
            providesTags: ['Course'],
        }),

        //GET: Get popular courses

        getPopularCourses: builder.query<CourseResponse, { limit?: number } | void>({
            query: (params) => ({
                url: '/courses/popular',
                params: { limit: params?.limit || 8 },
            }),
            providesTags: ['Course'],

        }),

        //GET: get recommended courses
        getRecommendedCourses: builder.query<CourseResponse, { limit?: number } | void>({
            query: (params) => ({
                url: '/courses/recommended',
                params: { limit: params?.limit || 8 },
            }),
            providesTags: ['Course'],
        }),


        //GET: get free course
        getFreeCourses: builder.query<CourseResponse, { limit?: number } | void>({
            query: (params) => ({
                url: '/courses/free',
                params: { limit: params?.limit || 8 },
            }),
            providesTags: ['Course'],
        }),

    }),
});

export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useGetCoursesByTeacherQuery,
    useGetCoursesByTeacherIdQuery,
    useUpdateCourseInfoMutation,
    useUpdateCourseStatusMutation,
    useDeleteCourseByIdMutation,
    useUpdateCourseThumbnailMutation,
    useDeleteCourseThumbnailMutation,
    
} = courseApi;