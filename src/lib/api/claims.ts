import { apiFetch } from './client';
import type { ApiClaim } from './types';

export function fetchClaims(): Promise<ApiClaim[]> {
  return apiFetch<ApiClaim[]>('/claims');
}

export function fetchClaim(id: string): Promise<ApiClaim> {
  return apiFetch<ApiClaim>(`/claims/${id}`);
}

export function createClaim(data: Partial<ApiClaim>): Promise<ApiClaim> {
  return apiFetch<ApiClaim>('/claims', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
