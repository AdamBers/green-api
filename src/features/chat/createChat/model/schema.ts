import { z } from 'zod';
import { normalizePhone } from '@/shared/lib/phone';

export const createChatSchema = z.object({
  name: z.string().trim().max(60, 'Не больше 60 символов'),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !!normalizePhone(value),
      'Введите полный номер с кодом страны, например +7 999 123-45-67',
    ),
});
export type CreateChatValues = z.infer<typeof createChatSchema>;
