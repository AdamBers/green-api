import Avatar from '@/shared/ui/Avatar';
import { formatTime } from '@/shared/lib/time';
import type { Chat } from '../types';
import styles from './ChatRow.module.scss';

function ChatRow({
  chat,
  selected,
  preview,
  timestamp,
  onSelect,
}: {
  chat: Chat;
  selected: boolean;
  preview: string;
  timestamp?: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.row} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
    >
      <Avatar name={chat.name} large />
      <span className={styles.content}>
        <span className={styles.heading}>
          <strong>{chat.name}</strong>
          {timestamp && (
            <time dateTime={new Date(timestamp).toISOString()}>{formatTime(timestamp)}</time>
          )}
        </span>
        <span className={styles.bottom}>
          <span className={styles.preview}>{preview}</span>
          {chat.unread > 0 && (
            <span className={styles.count} aria-label={`${chat.unread} непрочитанных`}>
              {chat.unread}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
export default ChatRow;
