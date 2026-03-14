export enum ContentType {
  TEXT = 'text',
  FILE = 'file',
  HYBRID = 'hybrid'
}

export interface SendMessageRequest {
  module_id: string;
  content_type: ContentType;
  message_text?: string;
  attached_file_url?: string;
}

export interface SendMessageResponse {
  session_id: string;

  user_message: {
    id: string;
    message_text: string | null;
    attached_file_url: string | null;
    timestamp: string;
  };

  bot_response: {
    id: string;
    message_text: string;
    timestamp: string;
    error_message: string | null;
  };
}

export interface SendMessageRequestV2 {
  module_id: string;
  content_type: ContentType;
  message_text?: string;
  attached_file_url?: string;
  answer_mode?: 'text' | 'audio';
}

export interface SendMessageResponseV2 {
  session_id: string;

  user_message: {
    id: string;
    message_text: string | null;
    attached_file_url: string | null;
    timestamp: string;
  };

  bot_response: {
    id: string;
    message_text: string;
    timestamp: string;
    error_message: string | null;
    audio_url?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender_type: 'user' | 'bot';
  content_type: ContentType;
  message_text: string;
  attached_file_url: string | null;
  timestamp: string;
  error_message: string | null;
  audio_url?: string;
}

export interface ChatHistoryRequest {
  module_id: string;
  limit?: number;
  offset?: number;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }

}