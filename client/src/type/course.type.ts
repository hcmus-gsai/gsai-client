
export interface CourseResponse {
    message: string;
    data: Course;
}

export interface Course {
    id: string;
    course_code: string;
    course_name: string;
    complete_status: string;

    //More fields
    description: string;
    teacher_id: string;
    duration: string;
    thumbnail_url: string,
    tuition_fee: number,
    category: string | string[],
    completed_at: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    lesson_name: string;
    order_index: number;
    estimated_completion_time: string;
    type: 'video' | 'document' | 'quiz';
    created_at: string;
    updated_at: string;
}

export interface LessonsResponse {
    lesson: Lesson[];
    message: string;
}

export interface Module {
    id: string;
    course_id: string;
    module_name: string;
    module_description: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface ModulesResponse {
    modules: Module[];
    total: number;
}

//Searching params
export interface SearchParams {
    keyword: string;
    page?: number;
    limit?: number;
}

export interface CourseFilterParams {
    category?: string;
    teacher_id?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    page?: number;
    limit?: number;
}