export interface TranscribeRequest {
    audioUrl: string;
    message: string;
}

export interface TranscribeResponse {
    text: string;
    message: string;
}
