// ==================== Project Document ====================
export interface ProjectDocumentResponse {
    file_url: string;
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
        timestamp: string;
    };
}

export interface QAMessage {
    id: string;
    lesson_id: string;
    enrollment_id: string;
    role: 'user' | 'assistant' | 'system';
    content: any;
    timestamp: string;
}

export interface QAHistoryResponse {
    lessonId: string;
    enrollmentId: string;
    history: QAMessage[];
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