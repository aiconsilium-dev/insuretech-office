export function useNotifications() {
  const notifications = [
    { id: '1', message: '101동 1502호 방문 요청 접수 — 누수 의심', read: false, date: '03.25' },
    { id: '2', message: '2026년 상반기 공용부 하자점검 일정 안내', read: false, date: '03.28' },
  ];
  return { data: notifications, isLoading: false };
}
