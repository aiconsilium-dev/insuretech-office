import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => ({ name: '김관리', apt: '헬리오시티' }),
    staleTime: Infinity,
  });
}
