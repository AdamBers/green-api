import { Fragment, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import type { Message } from '@/entities/message/types';
import MessageBubble from '@/entities/message/ui/MessageBubble';
import { formatDay } from '@/shared/lib/time';
import styles from './ConversationWidget.module.scss';

function MessageList({
  messages,
  onRetry,
}: {
  messages: Message[];
  onRetry: (message: Message) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const lastId = messages.at(-1)?.id;
  useEffect(() => {
    if (followRef.current && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lastId]);
  if (!messages.length)
    return (
      <div className={styles.noMessages}>
        <span>
          <ArrowDown size={19} />
        </span>
        <h2>Первое «привет» — за вами</h2>
        <p>Напишите сообщение, чтобы начать разговор.</p>
      </div>
    );
  return (
    <div
      ref={scrollRef}
      className={styles.messages}
      role="log"
      aria-label="Сообщения чата"
      aria-live="polite"
      aria-relevant="additions"
      onScroll={(event) => {
        const node = event.currentTarget;
        followRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 100;
      }}
    >
      {messages.map((message, index) => (
        <Fragment key={message.id}>
          {(index === 0 ||
            new Date(messages[index - 1].timestamp).toDateString() !==
              new Date(message.timestamp).toDateString()) && (
            <span className={styles.day}>{formatDay(message.timestamp)}</span>
          )}
          <MessageBubble message={message} onRetry={() => onRetry(message)} />
        </Fragment>
      ))}
    </div>
  );
}
export default MessageList;
