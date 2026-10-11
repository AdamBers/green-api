import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Session } from '../types';

type SessionStore = {
  session: Session | null;
  connect: (session: Session) => void;
  disconnect: () => void;
};
export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session: null,
      connect: (session) => set({ session }),
      disconnect: () => set({ session: null }),
    }),
    {
      name: 'green-chat-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ session }) => ({ session }),
    },
  ),
);
