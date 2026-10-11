import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Chat } from '../types';

type ChatStore = {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  markRead: (id: string) => void;
  incrementUnread: (id: string) => void;
  reset: (chats?: Chat[]) => void;
};
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      addChat: (chat) =>
        set(({ chats }) => ({
          chats: chats.some(({ id }) => id === chat.id) ? chats : [...chats, chat],
        })),
      markRead: (id) =>
        set(({ chats }) => ({
          chats: chats.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)),
        })),
      incrementUnread: (id) =>
        set(({ chats }) => ({
          chats: chats.map((chat) =>
            chat.id === id ? { ...chat, unread: chat.unread + 1 } : chat,
          ),
        })),
      reset: (chats = []) => set({ chats }),
    }),
    {
      name: 'green-chat-chats',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ chats }) => ({ chats }),
    },
  ),
);
