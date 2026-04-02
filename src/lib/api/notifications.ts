import { apiFetch } from './client';
import type { ApiNotification } from './types';

export function fetchNotifications(): Promise<ApiNotification[]> {
  return apiFetch<ApiNotification[]>('/notifications');
}
