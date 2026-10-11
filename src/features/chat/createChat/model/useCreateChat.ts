import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '@/entities/chat/store/chatStore';
import type { Session } from '@/entities/session/types';
import { messageKey } from '@/entities/message/cache';
import { formatPhone, normalizePhone } from '@/shared/lib/phone';
import { createChatSchema, type CreateChatValues } from './schema';

export function useCreateChat(session: Session, onSelect: (id: string) => void) {
  const [open, setOpen] = useState(false);
  const client = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChatValues>({
    resolver: zodResolver(createChatSchema),
    defaultValues: { name: '', phone: '' },
  });
  const close = () => {
    setOpen(false);
    reset();
  };
  const onSubmit = handleSubmit(({ name, phone }) => {
    const normalized = normalizePhone(phone)!;
    const id = `${normalized.slice(1)}@c.us`;
    useChatStore.getState().addChat({
      id,
      name: name || formatPhone(normalized),
      phone: normalized,
      createdAt: Date.now(),
      unread: 0,
    });
    if (session.mode === 'demo')
      client.setQueryData(messageKey(session.id, id), (existing) => existing ?? []);
    onSelect(id);
    close();
  });
  return { open, openDialog: () => setOpen(true), close, register, errors, onSubmit };
}
