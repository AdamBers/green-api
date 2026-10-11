import { useEffect, useState } from 'react';
import { useIsRestoring, useQueryClient } from '@tanstack/react-query';
import { deleteNotification, receiveNotification } from '@/entities/notification/api';
import type { Session } from '@/entities/session/types';
import type { AppError } from '@/shared/api/errors';
import { runNotificationLoop } from './model/notificationLoop';
import { processNotification } from './model/processNotification';

export function useReceiveMessagesFeature(session: Session) {
  const client = useQueryClient();
  const restoring = useIsRestoring();
  const [error, setError] = useState<AppError | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (session.mode !== 'live' || restoring) return;
    const controller = new AbortController();
    void runNotificationLoop(
      {
        receive: (signal) => receiveNotification(session.credentials, signal),
        acknowledge: (receiptId, signal) =>
          deleteNotification(session.credentials, receiptId, signal),
        process: (notification) => processNotification(client, session.id, notification),
        onError: (next) => {
          if (!controller.signal.aborted) setError(next);
        },
      },
      controller.signal,
    );
    return () => controller.abort();
  }, [session, client, attempt, restoring]);
  return {
    error,
    reconnect: () => {
      setError(null);
      setAttempt((value) => value + 1);
    },
  };
}
