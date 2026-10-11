import { z } from 'zod';

export const connectSchema = z.object({
  apiUrl: z.url('Введите корректный адрес API').refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'api.green-api.com' || /^\d+\.api\.green-api\.com$/.test(url.hostname)) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.pathname === '/' || url.pathname === '')
    );
  }, 'Используйте HTTPS-адрес API из кабинета GREEN-API'),
  idInstance: z.string().trim().regex(/^\d+$/, 'ID инстанса должен содержать только цифры'),
  apiTokenInstance: z
    .string()
    .trim()
    .min(1, 'Введите токен доступа')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Проверьте формат токена'),
});
export type ConnectValues = z.infer<typeof connectSchema>;
