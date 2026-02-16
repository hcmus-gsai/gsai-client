export interface EnrolledCourseResponse {
    message: string;
    data: EnrolledCourse[];
}

export interface EnrolledCourse {
    // Enrollment info
    id: string;              // Enrollment ID - dùng cho progress API
    enrolled_at: string;
    is_active: boolean;
    completion_status: string;
    completed_at: string;

    // Course info
    course_id: string;       // Course ID - dùng cho navigation
    course_code: string;
    course_name: string;
    description: string;
    teacher_id: string;
    duration: string;
    thumbnail_url: string;
    tuition_fee: number;
    category: string | string[];
}

