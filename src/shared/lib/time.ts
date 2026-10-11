export const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(timestamp);

export function formatDay(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  if (now.toDateString() === date.toDateString()) return 'Сегодня';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) return 'Вчера';
  return new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long' }).format(date);
}
