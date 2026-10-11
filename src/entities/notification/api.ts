import { apiClient } from '@/shared/api/client';
import { instanceUrl, type Credentials } from '@/shared/api/instanceUrl';
import { notificationSchema, type Notification } from './types';
import { AppError } from '@/shared/api/errors';

export async function receiveNotification(
  credentials: Credentials,
  signal: AbortSignal,
): Promise<Notification | null> {
  const { data } = await apiClient.get<unknown>(instanceUrl(credentials, 'receiveNotification'), {
    signal,
    params: { receiveTimeout: 30 },
  });
  if (data === null || data === '') return null;
  const result = notificationSchema.safeParse(data);
  if (!result.success)
    throw new AppError(
      'Получен неизвестный формат уведомления. Проверьте настройки инстанса.',
      'instance',
    );
  return result.data;
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal: AbortSignal,
): Promise<void> {
  await apiClient.delete(instanceUrl(credentials, 'deleteNotification') + `/${receiptId}`, {
    signal,
  });
}
