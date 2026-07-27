export interface QuizResponse {
    lesson_id: string;
    lesson_name: string;
    quiz_id: string | null;
    expired_date: string;
    duration: number | null;
    passing_score_percentage: number | null;
}

export interface QuizCourseResponse {
    id: string;
    lesson_id: string;
    expired_date: number | null;
    duration: number | null;
    passing_score_percentage: number | null;
    lesson: {
        id: string;
        lesson_name: string;
        type: 'quiz';
        order_index: number;
        estimated_completion_time: string;
    };
}

export interface QuestionsResponse {
    id: string;
    question_text: string;
    points: number;
    options: OptionResponse[];
    order_index: number;
}

export interface OptionResponse {
    id: string;
    option_text: string;
    is_correct: boolean;
    order_index: number;
}

export interface AnswerSubmit {
    question_id: string;
    student_answer_text?: string;
    selected_option_ids?: string;
}

export interface GradeResponse {
    updatedAttempt: any;
    responses: any[];
}

export interface AttemptResponse {
    id: string;
    enrollment_id: string;
    quiz_id: string;
    status: string;
    score_percentage: number;
    is_passed: boolean;
    submitted_at: string | null;
    graded_at: string | null;
    graded_by_teacher_id: string | null;
    correct_count: number;
    total_questions: number;
    time_used: number;
}