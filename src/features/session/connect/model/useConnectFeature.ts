import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSessionStore } from '@/entities/session/store/sessionStore';
import { useChatStore } from '@/entities/chat/store/chatStore';
import { messageKey } from '@/entities/message/cache';
import { useInstanceStateMutation } from '@/features/session/hooks/useInstanceStateMutation';
import { AppError, normalizeApiError } from '@/shared/api/errors';
import { LIVE_API_ENABLED } from '@/shared/config/env';
import { DEMO_CHAT_ID, getDemoMessages } from './demoSession';
import { connectSchema, type ConnectValues } from './schema';

export function useConnectFeature() {
  const client = useQueryClient();
  const { mutateAsync, isPending } = useInstanceStateMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ConnectValues>({
    resolver: zodResolver(connectSchema),
    defaultValues: { apiUrl: '', idInstance: '', apiTokenInstance: '' },
  });
  const enterDemo = () => {
    client.clear();
    const sessionId = crypto.randomUUID();
    client.setQueryData(messageKey(sessionId, DEMO_CHAT_ID), getDemoMessages());
    useChatStore
      .getState()
      .reset([{ id: DEMO_CHAT_ID, name: 'Алексей', phone: '', createdAt: Date.now(), unread: 0 }]);
    useSessionStore.getState().connect({ id: sessionId, mode: 'demo' });
  };
  const onSubmit = handleSubmit(async (values) => {
    try {
      if (!LIVE_API_ENABLED)
        throw new AppError(
          'Подключение GREEN-API пока выключено. Используйте деморежим.',
          'instance',
        );
      const state = await mutateAsync(values);
      if (state !== 'authorized')
        throw new AppError(
          state === 'starting'
            ? 'Инстанс запускается. Попробуйте позже.'
            : 'Подключите WhatsApp в кабинете GREEN-API.',
          'instance',
        );
      client.clear();
      useChatStore.getState().reset();
      useSessionStore
        .getState()
        .connect({ id: crypto.randomUUID(), mode: 'live', credentials: values });
    } catch (error) {
      setError('root', { message: normalizeApiError(error).message });
    }
  });
  return { register, errors, isPending, onSubmit, enterDemo };
}
