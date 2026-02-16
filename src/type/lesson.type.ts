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

export interface LessonResponse {
    lesson: Lesson[];
    message: string;
}