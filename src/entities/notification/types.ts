import { z } from 'zod';

export const notificationSchema = z.object({
  receiptId: z.number(),
  body: z.object({ typeWebhook: z.string() }).passthrough(),
});
export type Notification = z.infer<typeof notificationSchema>;

export const textEventSchema = z.object({
  typeWebhook: z.string(),
  idMessage: z.string(),
  timestamp: z.number(),
  senderData: z.object({
    chatId: z.string(),
    senderName: z.string().optional(),
    senderContactName: z.string().optional(),
  }),
  messageData: z.object({
    typeMessage: z.string(),
    textMessageData: z.object({ textMessage: z.string() }).optional(),
    extendedTextMessageData: z.object({ text: z.string() }).optional(),
  }),
});
export const statusEventSchema = z.object({
  chatId: z.string(),
  idMessage: z.string(),
  status: z.string(),
});
