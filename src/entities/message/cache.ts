import type { Message } from './types';

const STATUS_RANK = { sending: 0, accepted: 1, sent: 2, delivered: 3, read: 4, failed: -1 };

export const messageKey = (sessionId: string, chatId: string) =>
  ['messages', sessionId, chatId] as const;

export function recoverInterruptedMessages(messages: Message[]): Message[] {
  return messages.map((message) =>
    message.status === 'sending'
      ? {
          ...message,
          status: 'failed',
          error: 'Отправка прервана обновлением страницы. Проверьте переписку перед повтором.',
        }
      : message,
  );
}

export function mergeMessages(current: Message[], incoming: Message[]): Message[] {
  const messages = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) {
    const previous = messages.get(message.id);
    const keepStatus =
      previous?.status &&
      message.status &&
      message.status !== 'failed' &&
      STATUS_RANK[previous.status] > STATUS_RANK[message.status];
    const status = keepStatus ? previous.status : (message.status ?? previous?.status);
    messages.set(message.id, {
      ...previous,
      ...message,
      status,
      error: status === 'failed' ? (message.error ?? previous?.error) : undefined,
    });
  }
  return [...messages.values()].sort((a, b) => a.timestamp - b.timestamp);
}
