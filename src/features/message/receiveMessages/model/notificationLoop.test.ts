import { describe, expect, it, vi } from 'vitest';
import { AppError } from '@/shared/api/errors';
import { runNotificationLoop } from './notificationLoop';

describe('notification loop', () => {
  it('cancels the retry delay without starting another request', async () => {
    const controller = new AbortController();
    const receive = vi.fn().mockRejectedValue(new AppError('Нет сети', 'network'));
    const onError = () => {
      setTimeout(() => controller.abort(), 0);
    };
    await runNotificationLoop(
      { receive, process: vi.fn(), acknowledge: vi.fn(), onError },
      controller.signal,
    );
    expect(receive).toHaveBeenCalledOnce();
  });
  it('processes before acknowledging and never overlaps reads', async () => {
    const controller = new AbortController();
    const order: string[] = [];
    await runNotificationLoop(
      {
        receive: async () => {
          order.push('receive');
          return { receiptId: 7, body: { typeWebhook: 'test' } };
        },
        process: () => {
          order.push('process');
        },
        acknowledge: async (receiptId) => {
          expect(receiptId).toBe(7);
          order.push('delete');
          controller.abort();
        },
        onError: () => undefined,
      },
      controller.signal,
    );
    expect(order).toEqual(['receive', 'process', 'delete']);
  });
  it('does not delete an event whose processing failed', async () => {
    const acknowledge = vi.fn();
    const onError = vi.fn();
    await runNotificationLoop(
      {
        receive: async () => ({ receiptId: 7, body: { typeWebhook: 'test' } }),
        process: () => {
          throw new AppError('Invalid event', 'instance');
        },
        acknowledge,
        onError,
      },
      new AbortController().signal,
    );
    expect(acknowledge).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });
  it('stops immediately on invalid credentials', async () => {
    const receive = vi.fn().mockRejectedValue(new AppError('Bad token', 'auth', 401));
    await runNotificationLoop(
      { receive, process: vi.fn(), acknowledge: vi.fn(), onError: vi.fn() },
      new AbortController().signal,
    );
    expect(receive).toHaveBeenCalledOnce();
  });
});
