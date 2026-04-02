import type { Claim } from '@/lib/types';
import type { Tab } from './types';

export function filterClaims(claims: Claim[], tab: Tab): Claim[] {
  if (tab === "all") return claims;
  return claims.filter((c) => c.source === tab);
}
