import { describe, expect, it } from 'vitest';
import { mapMessageHistory } from './history';
import { recoverInterruptedMessages } from './cache';

const dto = {
  idMessage: 'server-id',
  chatId: 'chat',
  timestamp: 100,
  type: 'outgoing',
  typeMessage: 'textMessage',
  textMessage: 'Привет',
  statusMessage: 'pending',
};
describe('message history mapper', () => {
  it('maps server DTO to the domain model and preserves accepted messages on reload', () => {
    const [message] = mapMessageHistory([dto]);
    expect(message.timestamp).toBe(100_000);
    expect(message.status).toBe('accepted');
    expect(recoverInterruptedMessages([message])[0].status).toBe('accepted');
    expect(message).not.toHaveProperty('idMessage');
  });
  it('ignores non-text messages and rejects malformed API responses', () => {
    expect(mapMessageHistory([{ ...dto, typeMessage: 'imageMessage' }])).toEqual([]);
    expect(() => mapMessageHistory({ messages: [] })).toThrow('неизвестный формат');
  });
});
