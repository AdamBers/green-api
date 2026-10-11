import { apiClient } from '@/shared/api/client';
import { instanceUrl, type Credentials } from '@/shared/api/instanceUrl';
import { mapMessageHistory } from './history';
import type { Message } from './types';

export async function getChatHistory(
  credentials: Credentials,
  chatId: string,
  signal?: AbortSignal,
): Promise<Message[]> {
  const { data } = await apiClient.post<unknown>(
    instanceUrl(credentials, 'getChatHistory'),
    { chatId, count: 100 },
    { signal },
  );
  return mapMessageHistory(data);
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
  signal?: AbortSignal,
): Promise<string> {
  const { data } = await apiClient.post<{ idMessage: string }>(
    instanceUrl(credentials, 'sendMessage'),
    { chatId, message },
    { signal },
  );
  return data.idMessage;
}
