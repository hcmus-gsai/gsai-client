
export interface CourseResponse {
    message: string;
    data: Course[];
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
    completed_at : string;
}

export interface LessonInfo {
    id: string;
    name: string;
    estimatedTime: string;
    type: 'video' | 'article' | 'quiz';
    status: 'completed' | 'in-progress' | 'not-started';

    startedAt?: string;
    completedAt?: string;
    deadline?: string;
    grade?: number;
}

export interface ModuleInfo {
    id: string;
    name: string;
    status: 'completed' | 'in-progress' | 'not-started';

    startedAt?: string;
    completedAt?: string;

    // Course lessons
    lessons: LessonInfo[];
}
//Seaching params
export interface SearchParams {
    keyword: string;
    page?:number;
    limit?:number;
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




