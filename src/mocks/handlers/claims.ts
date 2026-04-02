import { http, HttpResponse } from 'msw';
import { mockClaims } from '../data/claims';

export const claimsHandlers = [
  http.get('/claims', () => {
    return HttpResponse.json(mockClaims);
  }),
  http.post('/claims', () => {
    return HttpResponse.json({ id: `HC-2026-${Date.now()}`, status: 'received' });
  }),
];
