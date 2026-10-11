import { useMutation } from '@tanstack/react-query';
import { getInstanceState } from '@/entities/session/api';
import type { Credentials } from '@/shared/api/instanceUrl';

export function useInstanceStateMutation() {
  return useMutation({
    mutationFn: (credentials: Credentials) => getInstanceState(credentials),
    retry: false,
  });
}
