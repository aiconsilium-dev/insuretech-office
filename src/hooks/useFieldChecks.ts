import { useApp } from '@/contexts/AppContext';

export function useFieldChecks() {
  const { claims } = useApp();
  const fieldItems = claims.filter(
    (c) => c.status === 'received' || c.status === 'review',
  );
  return { data: fieldItems, isLoading: false };
}
