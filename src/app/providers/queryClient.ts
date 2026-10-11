import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { MESSAGE_STORAGE_KEY } from '@/shared/config/storage';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: Infinity, retry: false }, mutations: { retry: false } },
});
export const queryPersister = createSyncStoragePersister({
  storage: window.sessionStorage,
  key: MESSAGE_STORAGE_KEY,
  throttleTime: 0,
});
