import { z } from 'zod';

export const messageSchema = z.object({
  text: z.string().trim().min(1, 'Введите сообщение').max(20_000, 'Не больше 20 000 символов'),
});
export type MessageValues = z.infer<typeof messageSchema>;
