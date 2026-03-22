export interface CourseResponse {
    message: string;
    data: Course;
}

export interface Course {
    id: string;
    course_id?: string; // alias cho id (backward compatibility)
    course_code: string;
    course_name: string;
    course_description: string;
    duration: string;
    thumbnail_url: string;
    tuition_fee: number;
    category: string | string[];
    is_active: boolean;
    teacher_id: string;
    teacher_name: string;
    teacher_avatar_url: string;
    is_enrolled: boolean;
}



export interface CourseQueryParams {
    name?: string;
    category?: string;
    minTuitionFee?: number;
    maxTuitionFee?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface CourseListResponse {
    message: string;
    data: Course[];
}

export interface CreateCourseRequest {
    course_code: string;
    course_name: string;
    course_description: string;
    duration: string;
    thumbnail_url?: string;
    tuition_fee: number;
    category: string | string[];
    is_active: boolean;
}
