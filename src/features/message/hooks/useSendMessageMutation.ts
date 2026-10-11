import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/entities/message/api';
import type { Credentials } from '@/shared/api/instanceUrl';

export function useSendMessageMutation(sessionId: string) {
  return useMutation({
    mutationKey: ['send-message', sessionId],
    mutationFn: ({
      credentials,
      chatId,
      text,
      signal,
    }: {
      credentials: Credentials;
      chatId: string;
      text: string;
      signal: AbortSignal;
    }) => {
      return sendMessage(credentials, chatId, text, signal);
    },
    retry: false,
  });
}
