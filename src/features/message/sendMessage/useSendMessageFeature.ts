import { useQueryClient } from '@tanstack/react-query';
import { useSendMessageMutation } from '@/features/message/hooks/useSendMessageMutation';
import { useSessionStore } from '@/entities/session/store/sessionStore';
import { useChatStore } from '@/entities/chat/store/chatStore';
import { mergeMessages, messageKey } from '@/entities/message/cache';
import type { Message } from '@/entities/message/types';
import type { Session } from '@/entities/session/types';
import { isRequestCancelled, normalizeApiError } from '@/shared/api/errors';
import { delay } from '@/shared/lib/delay';

export function useSendMessageFeature(session: Session) {
  const client = useQueryClient();
  const { mutateAsync } = useSendMessageMutation(session.id);
  const send = async (chatId: string, text: string, retryId?: string) => {
    const key = messageKey(session.id, chatId);
    const current = client.getQueryData<Message[]>(key) ?? [];
    if (retryId && current.find((message) => message.id === retryId)?.status !== 'failed') return;
    const pending: Message = {
      id: retryId ?? crypto.randomUUID(),
      chatId,
      text,
      timestamp: Date.now(),
      direction: 'outgoing',
      status: 'sending',
    };
    const controller = new AbortController();
    const unsubscribe = useSessionStore.subscribe((state) => {
      if (state.session?.id !== session.id) controller.abort();
    });
    client.setQueryData<Message[]>(key, (messages = []) =>
      mergeMessages(
        messages.filter((message) => message.id !== pending.id),
        [pending],
      ),
    );
    try {
      let id: string;
      if (session.mode === 'live') {
        id = await mutateAsync({
          credentials: session.credentials,
          chatId,
          text,
          signal: controller.signal,
        });
      } else {
        await delay(350, controller.signal);
        id = crypto.randomUUID();
      }
      if (useSessionStore.getState().session?.id !== session.id) return;
      client.setQueryData<Message[]>(key, (messages = []) =>
        mergeMessages(
          messages.filter((message) => message.id !== pending.id),
          [{ ...pending, id, status: session.mode === 'demo' ? 'read' : 'accepted' }],
        ),
      );
      if (session.mode === 'demo') {
        await delay(850, controller.signal);
        if (useSessionStore.getState().session?.id !== session.id) return;
        client.setQueryData<Message[]>(key, (messages = []) =>
          mergeMessages(messages, [
            {
              id: crypto.randomUUID(),
              chatId,
              text: 'Демоответ: сообщение получено! В подключённом WhatsApp здесь появится ответ собеседника.',
              direction: 'incoming',
              timestamp: Date.now(),
            },
          ]),
        );
        if (new URLSearchParams(window.location.search).get('chat') !== chatId)
          useChatStore.getState().incrementUnread(chatId);
      }
    } catch (error) {
      if (isRequestCancelled(error) || useSessionStore.getState().session?.id !== session.id)
        return;
      client.setQueryData<Message[]>(key, (messages = []) =>
        messages.map((message) =>
          message.id === pending.id
            ? { ...message, status: 'failed', error: normalizeApiError(error).message }
            : message,
        ),
      );
    } finally {
      unsubscribe();
    }
  };
  return { send };
}
