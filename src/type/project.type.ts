// ==================== Project Document ====================
export interface ProjectDocumentResponse {
    file_url: string;
    expired_date?: number;
}

export interface ProjectTranscriptResponse {
    transcript: string;
}

export interface CreateProjectRequest {
    file: File;
    expired_date: number;
}

// ==================== Project Submission ====================
export interface ProjectSubmissionResponse {
    due: string;
    submission_status: string;
    grading_status: string;
    last_modified: string;
    submission: string;
}

/* ===== ENUM TYPES ===== */

export type SubmissionStatus =
    | "NOT_SUBMITTED"
    | "SUBMITTED"
    | "RESUBMITTED"; // nếu backend có

export type GradingStatus =
    | "NOT_GRADED"
    | "GRADED";

/* ===== ENTITY RESPONSE ===== */

export interface ProjectSubmission {
    id: string;
    lesson_id: string;
    user_id: string;

    submission_status: SubmissionStatus;
    grading_status: GradingStatus;

    github_url: string | null;
    submit_json: string | null;

    submitted_at: string | null; // ISO string
}

/* ===== API RESPONSE ===== */
/**
 * GET /lessons/:id/projects-submission
 * POST /lessons/:id/projects-submission
 * PUT  /lessons/:id/projects-submission
 */
export interface SubmissionMuatationResponse {
    data: ProjectSubmission;
}
export interface SubmitProjectRequest {
    github_url: string;
}

export interface UpdateSubmissionRequest {
    github_url: string;
}

export interface SubmitJsonResponse {
    submit_json: any;
}

// ==================== Project Q&A ====================
export interface StartQASessionResponse {
    session_id: string;
    lessonId: string;
    enrollmentId: string;
    created_at: string;
    message?: string;
}

export interface SendQAMessageRequest {
    message: string;
    answer_mode: string; // "text" | "audio"
}

export interface SendQAMessageResponse {
    userMessage: {
        id: string;
        lesson_id: string;
        enrollment_id: string;
        role: 'user';
        content: {
            message: string;
        };
        timestamp: string;
    };
    assistantMessage: {
        id: string;
        lesson_id: string;
        enrollment_id: string;
        role: 'assistant';
        content: {
            response: string;
            file_references?: Array<{
                file_path: string;
                line_numbers: number[] | null;
                reason: string;
            }>;
            suggestions?: string[];
        };
        audio_url?: string;
        timestamp: string;
    };
}

export interface QAMessage {
    id: string;
    lesson_id: string;
    enrollment_id: string;
    role: 'user' | 'assistant' | 'system';
    content: any;
    audio_url?: string;
    timestamp: string;
}

export interface QAHistoryResponse {
    lessonId: string;
    enrollmentId: string;
    history: QAMessage[];
    grading_status?: string;
}

// ==================== Project Q&A v2 (vấn đáp 3 câu + báo cáo chấm điểm) ====================

export interface QAV2Question {
    question_id: string;
    content: string;
    intent: string;
    rubric_ref: string | null;
    difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface QAV2QuestionScore {
    question_id: string;
    question_content: string;
    score: 0 | 1 | 2;
    score_label: 'không hiểu' | 'hiểu một phần' | 'hiểu hoàn toàn';
    what_student_got_right: string;
    what_student_missed: string;
    key_evidence: string;
    rubric_criteria_met: string | null;
}

/**
 * Kết quả đối chiếu bài nộp với đề bài (agent tính ở bước sinh câu hỏi).
 * `unknown` nghĩa là hệ thống không đối chiếu được (thiếu đề bài gốc / lỗi), KHÔNG phải "đạt".
 */
export type QAV2ValidationStatus = 'valid' | 'invalid' | 'unknown';

export interface QAV2SubmissionValidation {
    status: QAV2ValidationStatus;
    is_valid: boolean;
    /** Điểm phù hợp với đề bài, thang 0-100. */
    validity_score: number;
    /** Ngưỡng tối thiểu để được coi là đạt yêu cầu. */
    threshold: number;
    verdict_label: string;
    issues: string[];
    summary: string;
}

export interface QAV2GradingReport {
    student_name: string | null;
    total_score: number;
    max_score: number;
    percentage: number;
    score_out_of_10?: number;
    summary: string;
    per_question: QAV2QuestionScore[];
    generated_at: string;

    // Kết luận về bài nộp, đính kèm báo cáo để học sinh biết vì sao bị 0 điểm.
    submission_status?: QAV2ValidationStatus;
    submission_verdict?: string;
    submission_valid?: boolean;
    submission_validity_score?: number;
    submission_validity_threshold?: number;
    submission_issues?: string[];
    submission_summary?: string;
    forced_zero?: boolean;
    attempt?: number;
}

export type QAV2Stage = 'loading' | 'interviewing' | 'grading' | 'result';

export interface QAV2Attempt {
    attempt: number;
    session_id: string | null;
    grading_report: QAV2GradingReport | null;
    submission_validation: QAV2SubmissionValidation | null;
    finished_at: string;
}

export interface QAV2CreateSessionResponse {
    session_id: string | null;
    questions: QAV2Question[];
    status: string;
    stage: QAV2Stage;
    grading_report: QAV2GradingReport | null;
    submission_validation?: QAV2SubmissionValidation;
    attempt?: number;
    previous_attempts?: QAV2Attempt[];
}

export interface QAV2CurrentSessionResponse {
    session_id: string | null;
    stage: QAV2Stage;
    questions: QAV2Question[];
    grading_report: QAV2GradingReport | null;
    submission_validation?: QAV2SubmissionValidation;
    attempt?: number;
    previous_attempts?: QAV2Attempt[];
    last_status?: {
        agent_message: string;
        current_question_id: string;
        question_index: number;
        question_status: string;
        interview_status: string;
    };
    updated_at: string;
}

export interface QAV2StartInterviewResponse {
    question_index: number;
    agent_message: string;
    current_question_id: string;
    submission_validation?: QAV2SubmissionValidation;
}

export interface QAV2RespondResponse {
    agent_message: string;
    current_question_id: string;
    question_index: number;
    question_status: string;
    interview_status: 'in_progress' | 'completed';
}

export interface SubmitJsonNode {
    name: string;
    type: 'file' | 'folder';
    children?: SubmitJsonNode[];
    content?: string;
    extension?: string;
    size?: number;
    total_files?: number;
    total_folders?: number;
    skipped_files?: number;
}

// ==================== Project Submission Teacher View ====================
export interface SubmissionHistoryItem {
    message: string;
    data: {
        course_name: string;
        lesson_name: string;
        student_name: string;
        submitted_at: string;
        submission_status: string;
        grade: string;
        grading_status: string;
    }[];
}

// ==================== Project Socratic Chat ====================
export interface SocraticSessionItem {
    session_id: string;
    created_at: string;
    last_message_at: string;
    message_count: number;
}

export interface CreateSocraticSessionResponse {
    session_id: string;
    created_at: string;
}

export interface ListSocraticSessionsResponse {
    lessonId: string;
    userId: string;
    sessions: SocraticSessionItem[];
}

export interface SocraticMessage {
    id: string;
    session_id: string;
    lesson_id: string;
    user_id: string;
    role: 'user' | 'assistant' | 'system';
    content: any;
    audio_url?: string;
    timestamp: string;
}

export interface SocraticSessionMessagesResponse {
    lessonId: string;
    userId: string;
    session_id: string;
    messages: SocraticMessage[];
}

export interface SendSocraticMessageRequest {
    message: string;
    answer_mode?: 'text' | 'audio';
}

export interface SendSocraticMessageResponse {
    userMessage: SocraticMessage;
    assistantMessage: SocraticMessage;
}