export interface EnrolledCourseResponse {
    message: string;
    data: EnrolledCourse[];
}

export interface EnrolledCourse {
    id: string;
    course_code: string;
    course_name: string;
    completion_status: string;

    //Reamin fields

    description: string,
    teacher_id: string,
    duration: string,
    thumbnail_url: string,
    tuition_fee: number,
    
    category: string | string[],

    enrolled_at: string,
    is_active: boolean,
    completed_at: string
}

