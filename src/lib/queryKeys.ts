export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  claims: {
    all: () => ['claims'] as const,
    list: (filters?: Record<string, unknown>) => ['claims', 'list', filters] as const,
    detail: (id: string) => ['claims', 'detail', id] as const,
  },
  fieldChecks: {
    all: () => ['fieldChecks'] as const,
    list: () => ['fieldChecks', 'list'] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
    list: () => ['notifications', 'list'] as const,
  },
};
