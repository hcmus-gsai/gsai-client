export interface QuizResponse {
    lesson_id: string;
    lesson_name: string;
    quiz_id: string | null;
    expired_date: string | null;
    duration: number | null;
    passing_score_percentage: number | null;
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

export interface QuizSubmitResponse {
    attempt: any;
    responses: any[];
}

export interface GradeResponse {
    updatedAttempt: any;
    responses: any[];
}