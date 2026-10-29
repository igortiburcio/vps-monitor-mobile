import { fetch as expoFetch } from 'expo/fetch';

import { API_URL } from '../lib/config';

export interface SseMessage {
  event: string;
  data: string;
}

function parseBlock(raw: string): SseMessage | null {
  let event = 'message';
  const data: string[] = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.replace(/\r$/, '');

    if (trimmed.startsWith('event:')) event = trimmed.slice(6).trim();
    else if (trimmed.startsWith('data:')) data.push(trimmed.slice(5).trim());
  }

  if (data.length === 0) return null;

  return { event, data: data.join('\n') };
}

export interface SseOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  token: string;
  signal?: AbortSignal;
}

/**
 * Lê um endpoint SSE do backend.
 * Usa `expo/fetch` porque o fetch padrão do React Native não faz streaming.
 */
export async function* streamSse(
  path: string,
  { method = 'GET', body, token, signal }: SseOptions,
): AsyncGenerator<SseMessage> {
  const response = await expoFetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Falha no stream (HTTP ${response.status})`);
  }

  if (!response.body) {
    throw new Error('Resposta sem corpo para streaming');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let separator = buffer.indexOf('\n\n');
    while (separator >= 0) {
      const block = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);

      const message = parseBlock(block);
      if (message) yield message;

      separator = buffer.indexOf('\n\n');
    }
  }
}
