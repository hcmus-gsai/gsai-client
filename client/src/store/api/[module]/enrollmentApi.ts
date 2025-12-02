import { baseApi } from '../baseApi';
import { EnrolledCourseResponse } from '@/type/enrollment.type';


export const enrollmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllEnrollments: builder.query<EnrolledCourseResponse , void>({
            query: () => '/enrollments/student',
            providesTags: ['Enrollment'],
        }),

        // getEnrollmentById: builder.query<EnrolledCourseResponse, void>({
        //     query: (enrollment_id) =>  `/enrollments/student/${enrollment_id}`,
        //     providesTags: ['Enrollment'],
        // }),
        
    }),
});

export const {
    useGetAllEnrollmentsQuery,
} = enrollmentApi;