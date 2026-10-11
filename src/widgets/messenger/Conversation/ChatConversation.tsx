import { ArrowLeft, FlaskConical, MessageCircle, ShieldCheck } from 'lucide-react';
import type { Chat } from '@/entities/chat/types';
import type { Session } from '@/entities/session/types';
import { useMessageHistoryQuery } from '@/features/message/hooks/useMessageHistoryQuery';
import { useSendMessageFeature } from '@/features/message/sendMessage/useSendMessageFeature';
import SendMessageFeature from '@/features/message/sendMessage/SendMessageFeature';
import Avatar from '@/shared/ui/Avatar';
import Button from '@/shared/ui/Button';
import { formatPhone } from '@/shared/lib/phone';
import { normalizeApiError } from '@/shared/api/errors';
import MessageList from './MessageList';
import styles from './ConversationWidget.module.scss';

export type ChatConversationProps = {
  session: Session;
  chat: Chat;
  onBack: () => void;
};

function ChatConversation({ session, chat, onBack }: ChatConversationProps) {
  const { send } = useSendMessageFeature(session);
  const {
    data: messages = [],
    isPending,
    isError,
    error,
    refetch,
  } = useMessageHistoryQuery(
    session.id,
    chat.id,
    session.mode === 'live' ? session.credentials : undefined,
  );
  if (isPending)
    return (
      <div className={styles.state} role="status">
        <MessageCircle size={30} />
        <p>Загружаем переписку…</p>
        <Button variant="secondary" onClick={onBack}>
          К списку чатов
        </Button>
      </div>
    );
  if (isError)
    return (
      <div className={styles.state} role="alert">
        <p>{normalizeApiError(error).message}</p>
        <Button onClick={() => void refetch()}>Попробовать снова</Button>
        <Button variant="ghost" onClick={onBack}>
          К списку чатов
        </Button>
      </div>
    );
  return (
    <>
      <header className={styles.header}>
        <Button
          variant="ghost"
          iconOnly
          aria-label="Назад к чатам"
          className={styles.back}
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <Avatar name={chat.name} />
        <div className={styles.identity}>
          <h2>{chat.name}</h2>
          <span>{chat.phone ? formatPhone(chat.phone) : 'Демо-собеседник'}</span>
        </div>
        <span className={styles.channel}>
          <MessageCircle size={15} />
          WhatsApp
        </span>
      </header>
      {session.mode === 'demo' && (
        <div className={styles.demo}>
          <FlaskConical size={14} />
          <span>Демочат · Сообщения не отправляются в WhatsApp</span>
        </div>
      )}
      <div className={styles.canvas}>
        <div className={styles.safety}>
          <ShieldCheck size={13} />
          <span>
            {session.mode === 'demo'
              ? 'Этот разговор доступен только в вашей вкладке.'
              : 'Сообщения отправляются через ваш инстанс GREEN-API.'}
          </span>
        </div>
        <MessageList
          key={chat.id}
          messages={messages}
          onRetry={(message) => void send(chat.id, message.text, message.id)}
        />
      </div>
      <SendMessageFeature key={chat.id} onSend={(text) => void send(chat.id, text)} />
    </>
  );
}
export default ChatConversation;
