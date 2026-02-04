import { Lesson } from "./lesson.type";

export interface LessonProgress {
    id: string;
    lesson_id: string;
    user_id: string;
    course_id: string;
    module_id: string;
    is_completed: boolean;
    completed_at?: string;
    lesson?: Lesson;
}

export interface LessonProgressResponse {
    lessonProgress: LessonProgress[];
    message: string;
}

export interface CreateLessonProgressResponse {
    message: string;
}

