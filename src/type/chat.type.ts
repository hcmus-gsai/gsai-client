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
  // Required on the server (`@IsNotEmpty()` on SendMessageV2Dto) — always send it.
  answer_mode: 'text' | 'audio';
}

// 4-way retrieve-first classification. Refusal reasons only set when refused === true.
export type ChatLabel = 'chat' | 'learning' | 'cross_module' | 'out_of_corpus';
export type ChatRefusalReason = 'cross_module' | 'out_of_corpus';

export interface SuggestedModule {
  id: string;
  name: string;
  order_index: number;
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
    intent?: string;
    refused?: boolean;
    refusal_reason?: ChatRefusalReason | null;
    suggested_module?: SuggestedModule | null;
  };
}

/** One event of the `POST /chat/messages/stream` SSE payload (nested under `data:`). */
export type ChatStreamEvent =
  | { type: 'token'; delta: string }
  | {
      type: 'done';
      messageId: string;
      intent: string;
      label?: ChatLabel;
      refused?: boolean;
      refusal_reason?: ChatRefusalReason | null;
      suggested_module?: SuggestedModule | null;
      sources?: unknown[];
      audio_url?: string;
    }
  | { type: 'error'; detail: string };

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