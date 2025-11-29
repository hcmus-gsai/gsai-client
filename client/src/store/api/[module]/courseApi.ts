// import { baseApi } from '../baseApi';
// import {
//     Course,
//     CourseDetail,
//     CourseChapter,
//     CourseVideo,
//     GetCoursesRequest,
//     GetCoursesResponse,
//     GetCourseDetailRequest,
//     GetCourseDetailResponse,
//     GetCourseChaptersRequest,
//     GetCourseChaptersResponse,
//     GetCourseVideoRequest,
//     GetCourseVideoResponse,
// } from '../../../type/course.type';

// export const courseApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // Get all courses (with optional filters)
//         getCourses: builder.query<GetCoursesResponse, GetCoursesRequest | void>({
//             query: (params = {}) => {
//                 const searchParams = new URLSearchParams();
//                 if (params.category) searchParams.append('category', params.category);
//                 if (params.search) searchParams.append('search', params.search);
//                 if (params.limit) searchParams.append('limit', params.limit.toString());
//                 if (params.offset) searchParams.append('offset', params.offset.toString());
                
//                 const queryString = searchParams.toString();
//                 return `/course${queryString ? `?${queryString}` : ''}`;
//             },
//             providesTags: ['Course'],
//         }),

//         // Get course by ID
//         getCourseById: builder.query<Course, number>({
//             query: (id) => `/course/${id}`,
//             providesTags: (result, error, id) => [{ type: 'Course', id }],
//         }),

//         // Get course detail by category and name
//         getCourseDetail: builder.query<GetCourseDetailResponse, GetCourseDetailRequest>({
//             query: ({ category, name }) => `/course/${category}/${name}`,
//             providesTags: (result, error, { category, name }) => [
//                 { type: 'Course', id: `${category}-${name}` },
//             ],
//         }),

//         // Get courses by category
//         getCoursesByCategory: builder.query<Course[], string>({
//             query: (category) => `/course/category/${category}`,
//             providesTags: (result, error, category) => [
//                 { type: 'Course', id: `category-${category}` },
//             ],
//         }),

//         // Get course chapters
//         getCourseChapters: builder.query<GetCourseChaptersResponse, GetCourseChaptersRequest>({
//             query: ({ category, courseName }) => `/course/${category}/${courseName}/chapters`,
//             providesTags: (result, error, { category, courseName }) => [
//                 { type: 'Course', id: `${category}-${courseName}-chapters` },
//             ],
//         }),

//         // Get course video
//         getCourseVideo: builder.query<GetCourseVideoResponse, GetCourseVideoRequest>({
//             query: ({ category, courseName, videoId }) => 
//                 `/course/${category}/${courseName}/video/${videoId}`,
//             providesTags: (result, error, { category, courseName, videoId }) => [
//                 { type: 'Course', id: `${category}-${courseName}-${videoId}` },
//             ],
//         }),

//         // Create course (Admin/Teacher only)
//         createCourse: builder.mutation<Course, Partial<Course>>({
//             query: (body) => ({
//                 url: '/course',
//                 method: 'POST',
//                 body,
//             }),
//             invalidatesTags: ['Course'],
//         }),

//         // Update course (Admin/Teacher only)
//         updateCourse: builder.mutation<Course, { id: number; data: Partial<Course> }>({
//             query: ({ id, data }) => ({
//                 url: `/course/${id}`,
//                 method: 'PUT',
//                 body: data,
//             }),
//             invalidatesTags: (result, error, { id }) => [
//                 { type: 'Course', id },
//                 'Course',
//             ],
//         }),

//         // Delete course (Admin/Teacher only)
//         deleteCourse: builder.mutation<{ message: string }, number>({
//             query: (id) => ({
//                 url: `/course/${id}`,
//                 method: 'DELETE',
//             }),
//             invalidatesTags: ['Course'],
//         }),
//     }),
// });

// // Export hooks for usage in components
// export const {
//     useGetCoursesQuery,
//     useGetCourseByIdQuery,
//     useGetCourseDetailQuery,
//     useGetCoursesByCategoryQuery,
//     useGetCourseChaptersQuery,
//     useGetCourseVideoQuery,
//     useCreateCourseMutation,
//     useUpdateCourseMutation,
//     useDeleteCourseMutation,
// } = courseApi;

import {baseApi} from '../baseApi';
import {CourseInfo} from '../../../type/course.type';
import { string } from 'better-auth';

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getCourses: builder.query<{courses: CourseInfo[]}, void>({
            query: () => '/courses',
            providesTags: ['Course'],
        }),

        getCourseById: builder.query<CourseInfo, string>({
            query : (id) => `/courses/${id}`,
            providesTags: (result, error, id) => [{ type: 'Course', id }],
        }),

     
    }),
});

export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
} = courseApi;