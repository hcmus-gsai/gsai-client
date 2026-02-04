enum JobStatus {
    CREATED = "created",
    QUEUED = "queued",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}

interface IVideoGenJob {
    id: string;
    teacher_id: string;
    lesson_id: string;
    video_name: string;
    job_status: JobStatus;
    lipsync_status: JobStatus;
    ocr_status: JobStatus;
    lipsync_image_url?: string; // Dùng dấu ? vì có nullable: true
    voice_sample_audio_url: string[]; // Mảng string cho array: true
    slide_file_url?: string;
    transcript_text?: string;
    error_message?: string;
    generated_video_url?: string;
    /**
     * ocr_json thường được lưu là JSONB trong Postgres. 
     * Khi API trả về, nó thường là một Object/Array đã được parse.
     */
    ocr_json?: any; 
    create_at: string | Date; // Date từ API thường là chuỗi ISO string
    completed_at: string | Date;
}

export interface IVideoGenJobResponse {
    videoGenJob: IVideoGenJob;
    message: string;
}