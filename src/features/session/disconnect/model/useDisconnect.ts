import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useSessionStore } from '@/entities/session/store/sessionStore';
import { useChatStore } from '@/entities/chat/store/chatStore';
import { MESSAGE_STORAGE_KEY } from '@/shared/config/storage';

export function useDisconnect() {
  const client = useQueryClient();
  const [, setParams] = useSearchParams();
  return async () => {
    useSessionStore.getState().disconnect();
    await client.cancelQueries();
    client.clear();
    useChatStore.getState().reset();
    useSessionStore.persist.clearStorage();
    useChatStore.persist.clearStorage();
    sessionStorage.removeItem(MESSAGE_STORAGE_KEY);
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete('chat');
        next.delete('search');
        return next;
      },
      { replace: true },
    );
  };
}
