export interface EnrolledCourseResponse {
    message: string;
    data: EnrolledCourse[];
}

export interface EnrolledCourse {
    id: string;
    course_code: string;
    course_name: string;
    completion_status: string;
}

