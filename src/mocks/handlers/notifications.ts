import { http, HttpResponse } from 'msw';

export const notificationsHandlers = [
  http.get('/notifications', () => {
    return HttpResponse.json([
      { id: '1', message: '101동 1502호 방문 요청 접수', read: false, createdAt: '2026-03-25' },
      { id: '2', message: '상반기 하자점검 일정 안내', read: false, createdAt: '2026-03-28' },
    ]);
  }),
];
