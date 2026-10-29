import { API_URL } from '../lib/config';
import type { SessionUser, SignInResponse } from './types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

function buildHeaders(init: RequestInit): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.body ? { 'Content-Type': 'application/json' } : {}),
  };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  return { ...headers, ...((init.headers as Record<string, string>) ?? {}) };
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(', ');
    if (body.message) return body.message;
  } catch {
    // corpo não-JSON
  }

  return `Erro ${response.status}`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: buildHeaders(init) });

  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ token: string; user: SessionUser }> {
  const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message =
      response.status === 401 ? 'E-mail ou senha inválidos' : await readErrorMessage(response);
    throw new ApiError(response.status, message);
  }

  const body = (await response.json()) as SignInResponse;
  const token = body.token ?? response.headers.get('set-auth-token');

  if (!token) throw new ApiError(500, 'O servidor não retornou um token de sessão');

  return {
    token,
    user: body.user ?? { id: '', name: '', email, image: null },
  };
}
