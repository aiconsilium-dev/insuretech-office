import { useApp } from '@/contexts/AppContext';

export function useClaims() {
  const { claims } = useApp();
  return { data: claims, isLoading: false };
}
