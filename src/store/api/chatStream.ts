'use client';

import { SendMessageRequestV2, ChatStreamEvent } from '@/type/chat.type';
import { refreshAccessToken } from './authRefresh';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

/**
 * Stream `POST /chat/messages/stream` as an async generator of parsed SSE payloads.
 *
 * Not an RTK Query endpoint — a mutation can't yield progressively, and the endpoint is a POST
 * so the browser's `EventSource` (GET-only) can't be used either. This mirrors the server's own
 * `parseSSEStream` (chat.service.ts): split on the blank line between events, concatenate the
 * `data:` lines, `JSON.parse`. Nest's `@Sse()` here never emits an `event:` line, so the payload's
 * own `type` field is the only discriminator (same as the eval harness's SSE reader).
 *
 * 401 handling reproduces `baseApi.ts`'s cookie-refresh-then-retry-once, via the mutex shared in
 * `authRefresh.ts` so this never races a concurrent RTK Query refresh.
 */
export async function* streamChatMessage(
  body: SendMessageRequestV2,
  signal: AbortSignal,
  onUnauthorized: () => void,
): AsyncGenerator<ChatStreamEvent> {
  const doFetch = () =>
    fetch(`${API_BASE_URL}/chat/messages/stream`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(body),
      signal,
    });

  let res = await doFetch();
  if (res.status === 401) {
    const refreshed = await refreshAccessToken(onUnauthorized);
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok || !res.body) {
    throw new Error(`Chat stream request failed: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  // `currentData` MUST live outside the read loop: one SSE frame regularly straddles two network
  // chunks (the `data:` line arrives in chunk N, its terminating blank line in chunk N+1). Resetting
  // it per chunk silently drops those frames — including `done`, which would leave the bubble stuck
  // in `streaming: true` forever. Same lifetime as the server's own parseSSEStream.
  let currentData = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.replace(/\r$/, '');
        if (trimmed === '') {
          if (currentData) {
            const event = parseEvent(currentData);
            if (event) yield event;
          }
          currentData = '';
        } else if (trimmed.startsWith('data:')) {
          currentData += trimmed.slice(5).trim();
        }
        // `id:`/`event:`/comment lines are not used by this endpoint — ignored, same as the server.
      }
    }

    // Stream ended: fold a trailing line that never got its newline, then flush the last frame.
    const tail = buffer.replace(/\r$/, '');
    if (tail.startsWith('data:')) {
      currentData += tail.slice(5).trim();
    }
    if (currentData) {
      const event = parseEvent(currentData);
      if (event) yield event;
    }
  } finally {
    reader.releaseLock();
  }
}

function parseEvent(dataStr: string): ChatStreamEvent | null {
  try {
    return JSON.parse(dataStr) as ChatStreamEvent;
  } catch {
    return null;
  }
}
