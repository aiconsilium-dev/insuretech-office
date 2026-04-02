import { apiFetch } from './client';
import type { ApiFieldCheck } from './types';

export function fetchFieldChecks(): Promise<ApiFieldCheck[]> {
  return apiFetch<ApiFieldCheck[]>('/field-checks');
}

export function submitFieldCheck(data: Partial<ApiFieldCheck>): Promise<ApiFieldCheck> {
  return apiFetch<ApiFieldCheck>('/field-checks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
