export interface TranscribeResponse {
    transcript: string;
    message: string;
    teacher_id: string;
}

export interface VoiceCloneResponse {
    cloned_audio_url: string;
}