import type { ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { Message } from '@/entities/message/types';
import { recoverInterruptedMessages } from '@/entities/message/cache';
import { queryClient, queryPersister } from './queryClient';

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      onSuccess={() => {
        for (const query of queryClient.getQueryCache().findAll({ queryKey: ['messages'] })) {
          queryClient.setQueryData<Message[]>(query.queryKey, (messages) =>
            messages ? recoverInterruptedMessages(messages) : messages,
          );
        }
      }}
      persistOptions={{
        persister: queryPersister,
        buster: 'v1',
        maxAge: 24 * 60 * 60_000,
        dehydrateOptions: {
          shouldDehydrateMutation: () => false,
          shouldDehydrateQuery: (query) =>
            query.queryKey[0] === 'messages' && query.state.status === 'success',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
export default QueryProvider;
