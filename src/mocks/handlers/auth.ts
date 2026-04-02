import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.get('/auth/me', () => {
    return HttpResponse.json({ name: '김관리', apt: '헬리오시티', role: 'manager' });
  }),
  http.post('/auth/login', () => {
    return HttpResponse.json({ token: 'mock-access-token' });
  }),
  http.post('/auth/refresh', () => {
    return HttpResponse.json({ token: 'mock-refreshed-token' });
  }),
];
