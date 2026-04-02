import { apiFetch } from './client';
import type { ApiUser } from './types';

export function fetchMe(): Promise<ApiUser> {
  return apiFetch<ApiUser>('/auth/me');
}

export function login(email: string, password: string): Promise<{ token: string }> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
