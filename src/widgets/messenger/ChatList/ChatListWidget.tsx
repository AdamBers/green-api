import { Search, MessageCircle, FlaskConical } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useChatStore } from '@/entities/chat/store/chatStore';
import type { Session } from '@/entities/session/types';
import ChatRow from '@/entities/chat/ui/ChatRow';
import CreateChatFeature from '@/features/chat/createChat/CreateChatFeature';
import DisconnectFeature from '@/features/session/disconnect/DisconnectFeature';
import { useMessagePreviewsQuery } from '@/features/message/hooks/useMessagePreviewsQuery';
import styles from './ChatListWidget.module.scss';

function ChatListWidget({
  session,
  selectedId,
  onSelect,
}: {
  session: Session;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const chats = useChatStore((state) => state.chats);
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const results = useMessagePreviewsQuery(
    session.id,
    chats.map((chat) => chat.id),
  );
  const previews = chats.map((chat, index) => ({ chat, message: results[index]?.data }));
  const visible = previews
    .filter(({ chat }) =>
      `${chat.name} ${chat.phone}`.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        (b.message?.timestamp ?? b.chat.createdAt) - (a.message?.timestamp ?? a.chat.createdAt),
    );
  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>
            Сообщения<span>{chats.length}</span>
          </h1>
          <div>
            <CreateChatFeature session={session} onSelect={onSelect} />
            <span className={styles.mobileExit}>
              <DisconnectFeature />
            </span>
          </div>
        </div>
        <p>Хороший разговор начинается с «привет».</p>
      </header>
      <div className={styles.search}>
        <Search size={17} />
        <input
          aria-label="Поиск чатов"
          placeholder="Найти разговор"
          value={search}
          onChange={(event) =>
            setParams(
              (previous) => {
                const next = new URLSearchParams(previous);
                if (event.target.value) next.set('search', event.target.value);
                else next.delete('search');
                return next;
              },
              { replace: true },
            )
          }
        />
      </div>
      <div className={styles.list} aria-label="Список чатов">
        {visible.length ? (
          visible.map(({ chat, message }) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              selected={chat.id === selectedId}
              preview={
                message
                  ? `${message.direction === 'outgoing' ? 'Вы: ' : ''}${message.text}`
                  : 'Начните новый разговор'
              }
              timestamp={message?.timestamp}
              onSelect={() => onSelect(chat.id)}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <MessageCircle size={29} strokeWidth={1.4} />
            <p>{search ? 'Разговоры не найдены' : 'Пока нет разговоров'}</p>
            <span>
              {search ? 'Попробуйте другое имя или номер.' : 'Нажмите +, чтобы создать первый чат.'}
            </span>
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        {session.mode === 'demo' ? (
          <>
            <FlaskConical size={15} />
            <span>Деморежим</span>
            <span className={styles.local}>Локальная переписка</span>
          </>
        ) : (
          <>
            <i />
            <span>WhatsApp подключён</span>
          </>
        )}
      </footer>
    </>
  );
}
export default ChatListWidget;
