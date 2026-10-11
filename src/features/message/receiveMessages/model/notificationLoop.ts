import type { Notification } from '@/entities/notification/types';
import { isRequestCancelled, normalizeApiError, type AppError } from '@/shared/api/errors';
import { delay } from '@/shared/lib/delay';

type Dependencies = {
  receive: (signal: AbortSignal) => Promise<Notification | null>;
  process: (notification: Notification) => void;
  acknowledge: (receiptId: number, signal: AbortSignal) => Promise<void>;
  onError: (error: AppError | null) => void;
};

export async function runNotificationLoop(
  dependencies: Dependencies,
  signal: AbortSignal,
): Promise<void> {
  let failures = 0;
  while (!signal.aborted) {
    try {
      const notification = await dependencies.receive(signal);
      if (signal.aborted) return;
      if (notification) {
        dependencies.process(notification);
        await dependencies.acknowledge(notification.receiptId, signal);
      }
      failures = 0;
      dependencies.onError(null);
    } catch (error) {
      if (signal.aborted || isRequestCancelled(error)) return;
      const normalized = normalizeApiError(error);
      dependencies.onError(normalized);
      if (
        ['auth', 'validation', 'instance', 'unknown'].includes(normalized.kind) ||
        normalized.status === 466
      )
        return;
      failures++;
      try {
        await delay(Math.min(1000 * 2 ** failures, 30_000), signal);
      } catch (pauseError) {
        if (isRequestCancelled(pauseError)) return;
        throw pauseError;
      }
    }
  }
}
