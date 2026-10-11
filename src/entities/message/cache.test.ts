import { describe, expect, it } from 'vitest';
import { mergeMessages, recoverInterruptedMessages } from './cache';
import type { Message } from './types';

const first: Message = {
  id: '1',
  chatId: 'chat',
  text: 'Привет',
  timestamp: 100,
  direction: 'outgoing',
  status: 'read',
};
describe('mergeMessages', () => {
  it('clears an obsolete error once delivery succeeds', () => {
    const [message] = mergeMessages(
      [{ ...first, status: 'failed', error: 'Нет сети' }],
      [{ ...first, status: 'delivered' }],
    );
    expect(message.status).toBe('delivered');
    expect(message.error).toBeUndefined();
  });
  it('recovers interrupted sends without resending accepted messages', () => {
    const result = recoverInterruptedMessages([
      { ...first, status: 'sending' },
      { ...first, id: '2', status: 'accepted' },
    ]);
    expect(result[0].status).toBe('failed');
    expect(result[0].error).toContain('Проверьте переписку');
    expect(result[1].status).toBe('accepted');
  });
  it('deduplicates repeated notifications and preserves read status', () => {
    const result = mergeMessages([first], [{ ...first, status: 'sent' }]);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('read');
  });
  it('sorts history and new notifications chronologically', () => {
    expect(
      mergeMessages([{ ...first, id: '2', timestamp: 200 }], [first]).map(({ id }) => id),
    ).toEqual(['1', '2']);
  });
  it('does not hide an explicit delivery failure', () => {
    expect(mergeMessages([first], [{ ...first, status: 'failed' }])[0].status).toBe('failed');
  });
});
