export interface CourseResponse {
    message: string;
    data: Course;
}

export interface Course {
    id: string;
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
    is_enrolled: boolean;
}
