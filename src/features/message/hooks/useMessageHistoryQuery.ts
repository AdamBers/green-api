import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatHistory } from '@/entities/message/api';
import { mergeMessages, messageKey } from '@/entities/message/cache';
import type { Message } from '@/entities/message/types';
import type { Credentials } from '@/shared/api/instanceUrl';

export function useMessageHistoryQuery(
  sessionId: string,
  chatId: string,
  credentials?: Credentials,
) {
  const client = useQueryClient();
  const key = messageKey(sessionId, chatId);
  return useQuery({
    queryKey: key,
    placeholderData: credentials ? undefined : [],
    queryFn: credentials
      ? async ({ signal }) => {
          const history = await getChatHistory(credentials, chatId, signal);
          return mergeMessages(client.getQueryData<Message[]>(key) ?? [], history);
        }
      : skipToken,
    staleTime: 30_000,
    refetchOnMount: credentials ? 'always' : false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
