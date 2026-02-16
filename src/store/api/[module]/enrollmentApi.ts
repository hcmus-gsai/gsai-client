import { baseApi } from '../baseApi';
import { EnrolledCourseResponse } from '@/type/enrollment.type';


export const enrollmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllEnrollments: builder.query<EnrolledCourseResponse , void>({
            query: () => '/enrollments/student',
            providesTags: ['Enrollment'],
        }),
        
        enrollInCourse: builder.mutation<{message: string}, string> ({
            query: (course_id) => ({
                url: '/enrollments',
                method: 'POST',
                body: { course_id },
            }),

            invalidatesTags: (result, error, course_id) => [
                'Enrollment',
                {
                    type: 'Course',
                    id: course_id,
                }
            ]
        })
    
        
    }),
});

export const {
    useGetAllEnrollmentsQuery,
    useEnrollInCourseMutation,
} = enrollmentApi;