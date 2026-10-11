import { skipToken, useQueries } from '@tanstack/react-query';
import { messageKey } from '@/entities/message/cache';
import type { Message } from '@/entities/message/types';

// Только подписка на существующий кеш. Список чатов не загружает историю каждого чата.
export function useMessagePreviewsQuery(sessionId: string, chatIds: string[]) {
  return useQueries({
    queries: chatIds.map((chatId) => ({
      queryKey: messageKey(sessionId, chatId),
      queryFn: skipToken,
      select: (messages: Message[]) => messages.at(-1),
    })),
  });
}
