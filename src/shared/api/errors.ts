import axios from 'axios';
import { z } from 'zod';

export const apiErrorSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  status: z.string().optional(),
});
export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
export type ErrorKind =
  'auth' | 'validation' | 'instance' | 'rateLimit' | 'network' | 'server' | 'unknown';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly kind: ErrorKind = 'unknown',
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (!axios.isAxiosError<unknown>(error)) {
    return new AppError('Не удалось выполнить действие. Попробуйте ещё раз.');
  }
  const status = error.response?.status;
  const data = error.response?.data;
  const parsed = apiErrorSchema.safeParse(data);
  const raw = typeof data === 'string' ? data : parsed.success ? (parsed.data.message ?? '') : '';
  const code = parsed.success ? parsed.data.code : undefined;
  const message = raw.toLowerCase();
  if (!error.response)
    return new AppError('Не удалось связаться с сервером. Проверьте подключение.', 'network');
  if (message.includes('suspended'))
    return new AppError('На аккаунте временные ограничения отправки.', 'instance', status, code);
  if (message.includes('webhook url'))
    return new AppError(
      'Очистите Webhook URL в настройках инстанса GREEN-API.',
      'instance',
      status,
      code,
    );
  if (message.includes('not authorized'))
    return new AppError(
      'Подключите WhatsApp через QR-код в кабинете GREEN-API.',
      'instance',
      status,
      code,
    );
  if (message.includes('starting'))
    return new AppError(
      'Инстанс запускается. Подождите и повторите попытку.',
      'instance',
      status,
      code,
    );
  if (message.includes('expired') || message.includes('deleted'))
    return new AppError(
      'Инстанс недоступен. Проверьте его в кабинете GREEN-API.',
      'instance',
      status,
      code,
    );
  if (status === 401)
    return new AppError('Проверьте токен доступа GREEN-API.', 'auth', status, code);
  if (status === 403)
    return new AppError('Проверьте ID инстанса и адрес API.', 'auth', status, code);
  if (status === 429 || status === 466)
    return new AppError(
      'Достигнут лимит запросов или чатов. Попробуйте позже.',
      'rateLimit',
      status,
      code,
    );
  if (status === 400)
    return new AppError('Проверьте введённые данные.', 'validation', status, code);
  if (status && status >= 500)
    return new AppError('Сервис временно недоступен. Попробуйте позже.', 'server', status, code);
  return new AppError('Не удалось выполнить запрос. Попробуйте ещё раз.', 'unknown', status, code);
}

export function isRequestCancelled(error: unknown): boolean {
  return axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError');
}
