import { http, HttpResponse } from 'msw';

export const fieldChecksHandlers = [
  http.get('/field-checks', () => {
    return HttpResponse.json([]);
  }),
  http.post('/field-checks', () => {
    return HttpResponse.json({ id: 'fc-1', status: 'completed' });
  }),
];
