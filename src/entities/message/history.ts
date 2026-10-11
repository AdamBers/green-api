import type { Message, MessageStatus } from './types';
import { z } from 'zod';
import { AppError } from '@/shared/api/errors';

const historySchema = z.array(
  z.object({
    idMessage: z.string(),
    chatId: z.string(),
    timestamp: z.number(),
    type: z.enum(['incoming', 'outgoing']),
    typeMessage: z.string(),
    textMessage: z.string().optional(),
    statusMessage: z.string().optional(),
  }),
);

export function mapMessageHistory(data: unknown): Message[] {
  const result = historySchema.safeParse(data);
  if (!result.success)
    throw new AppError('Получен неизвестный формат истории сообщений.', 'instance');
  return result.data.flatMap((dto): Message[] => {
    if (
      !['textMessage', 'extendedTextMessage'].includes(dto.typeMessage) ||
      dto.textMessage === undefined
    )
      return [];
    return [
      {
        id: dto.idMessage,
        chatId: dto.chatId,
        text: dto.textMessage,
        timestamp: dto.timestamp * 1000,
        direction: dto.type,
        status: toMessageStatus(dto.statusMessage),
      },
    ];
  });
}

function toMessageStatus(value?: string): MessageStatus | undefined {
  if (value === 'pending') return 'accepted';
  if (value === 'sent' || value === 'delivered' || value === 'read' || value === 'failed')
    return value;
  return undefined;
}
