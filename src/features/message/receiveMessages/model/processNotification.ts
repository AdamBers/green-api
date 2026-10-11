import type { QueryClient } from '@tanstack/react-query';
import {
  textEventSchema,
  statusEventSchema,
  type Notification,
} from '@/entities/notification/types';
import { useChatStore } from '@/entities/chat/store/chatStore';
import { mergeMessages, messageKey } from '@/entities/message/cache';
import type { Message } from '@/entities/message/types';
import { AppError } from '@/shared/api/errors';
import { formatPhone } from '@/shared/lib/phone';

export function processNotification(
  client: QueryClient,
  sessionId: string,
  notification: Notification,
): void {
  const { body } = notification;
  if (body.typeWebhook === 'outgoingMessageStatus') {
    const result = statusEventSchema.safeParse(body);
    if (!result.success) throw new AppError('Не удалось обработать статус сообщения.', 'instance');
    const { chatId, idMessage, status } = result.data;
    client.setQueryData<Message[]>(messageKey(sessionId, chatId), (messages) =>
      messages?.map((message) => {
        if (message.id !== idMessage) return message;
        if (status === 'sent' || status === 'delivered' || status === 'read')
          return mergeMessages([message], [{ ...message, status }])[0];
        if (['failed', 'noAccount', 'notInGroup', 'suspended'].includes(status))
          return {
            ...message,
            status: 'failed',
            error:
              status === 'noAccount'
                ? 'На этом номере нет WhatsApp.'
                : 'WhatsApp не смог доставить сообщение.',
          };
        return message;
      }),
    );
    return;
  }
  if (
    !['incomingMessageReceived', 'outgoingAPIMessageReceived', 'outgoingMessageReceived'].includes(
      body.typeWebhook,
    )
  )
    return;
  const result = textEventSchema.safeParse(body);
  if (!result.success)
    throw new AppError(
      'Не удалось обработать сообщение. Проверьте формат уведомления.',
      'instance',
    );
  const event = result.data;
  const text =
    event.messageData.textMessageData?.textMessage ??
    event.messageData.extendedTextMessageData?.text;
  if (
    !['textMessage', 'extendedTextMessage'].includes(event.messageData.typeMessage) ||
    text === undefined
  )
    return;
  const chatId = event.senderData.chatId;
  const key = messageKey(sessionId, chatId);
  const existing = client.getQueryData<Message[]>(key) ?? [];
  const incoming = body.typeWebhook === 'incomingMessageReceived';
  const phone = chatId.endsWith('@c.us') ? `+${chatId.split('@')[0]}` : '';
  useChatStore.getState().addChat({
    id: chatId,
    name:
      event.senderData.senderContactName ||
      event.senderData.senderName ||
      formatPhone(phone) ||
      chatId,
    phone,
    createdAt: event.timestamp * 1000,
    unread: 0,
  });
  client.setQueryData<Message[]>(
    key,
    mergeMessages(existing, [
      {
        id: event.idMessage,
        chatId,
        text,
        timestamp: event.timestamp * 1000,
        direction: incoming ? 'incoming' : 'outgoing',
        status: incoming ? undefined : 'sent',
      },
    ]),
  );
  if (
    incoming &&
    !existing.some((message) => message.id === event.idMessage) &&
    new URLSearchParams(window.location.search).get('chat') !== chatId
  ) {
    useChatStore.getState().incrementUnread(chatId);
  }
}
