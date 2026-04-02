import { useState } from 'react';

export function useCreateClaim() {
  const [isLoading, setIsLoading] = useState(false);

  async function createClaim(_data: Record<string, unknown>) {
    setIsLoading(true);
    // Mock: simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  }

  return { createClaim, isLoading };
}
