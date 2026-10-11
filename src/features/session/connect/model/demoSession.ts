import type { Message } from '@/entities/message/types';

export const DEMO_CHAT_ID = 'demo-alex';
export function getDemoMessages(): Message[] {
  const chatId = DEMO_CHAT_ID;
  const time = Date.now() - 12 * 60_000;
  return [
    {
      id: 'demo-1',
      chatId,
      text: 'Привет! Это демочат 👋',
      timestamp: time,
      direction: 'incoming',
    },
    {
      id: 'demo-2',
      chatId,
      text: 'Здесь можно проверить интерфейс до подключения WhatsApp.',
      timestamp: time + 20_000,
      direction: 'incoming',
    },
    {
      id: 'demo-3',
      chatId,
      text: 'Отлично, всё выглядит понятно!',
      timestamp: time + 60_000,
      direction: 'outgoing',
      status: 'read',
    },
    {
      id: 'demo-4',
      chatId,
      text: 'Напиши что-нибудь — я отвечу автоматически. Переписка сохранится после обновления страницы.',
      timestamp: time + 90_000,
      direction: 'incoming',
    },
  ];
}
