import { Check, CheckCheck, Clock3, AlertCircle } from 'lucide-react';
import { formatTime } from '@/shared/lib/time';
import type { Message } from '../types';
import styles from './MessageBubble.module.scss';

const statusLabels = {
  sending: 'Отправляется',
  accepted: 'Принято API',
  sent: 'Отправлено',
  delivered: 'Доставлено',
  read: 'Прочитано',
  failed: 'Не отправлено',
};
function MessageBubble({ message, onRetry }: { message: Message; onRetry: () => void }) {
  const outgoing = message.direction === 'outgoing';
  const status = message.status;
  return (
    <div className={`${styles.wrapper} ${outgoing ? styles.outgoing : ''}`}>
      <div className={`${styles.bubble} ${status === 'failed' ? styles.failed : ''}`}>
        <p>{message.text}</p>
        <span className={styles.meta}>
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
          {outgoing && status && (
            <span
              title={statusLabels[status]}
              aria-label={statusLabels[status]}
              className={status === 'read' ? styles.read : ''}
            >
              {status === 'sending' ? (
                <Clock3 size={13} />
              ) : status === 'failed' ? (
                <AlertCircle size={13} />
              ) : status === 'read' || status === 'delivered' ? (
                <CheckCheck size={15} />
              ) : (
                <Check size={15} />
              )}
            </span>
          )}
        </span>
      </div>
      {status === 'failed' && (
        <div className={styles.failure}>
          <span>{message.error ?? 'Не удалось отправить сообщение.'}</span>
          <button type="button" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}
    </div>
  );
}
export default MessageBubble;
