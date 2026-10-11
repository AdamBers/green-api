import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useChatStore } from '@/entities/chat/store/chatStore';
import type { Session } from '@/entities/session/types';
import { useReceiveMessagesFeature } from '@/features/message/receiveMessages/useReceiveMessagesFeature';
import DisconnectFeature from '@/features/session/disconnect/DisconnectFeature';
import ChatListWidget from '../ChatList/ChatListWidget';
import ConversationWidget from '../Conversation/ConversationWidget';
import Layout from '@/shared/ui/Layout';
import styles from './MessengerWidget.module.scss';

function MessengerWidget({ session }: { session: Session }) {
  const [params, setParams] = useSearchParams();
  const chats = useChatStore((state) => state.chats);
  const selectedId = params.get('chat') ?? undefined;
  const selectedChat = chats.find((chat) => chat.id === selectedId);
  const { error, reconnect } = useReceiveMessagesFeature(session);
  useEffect(() => {
    if (selectedId) useChatStore.getState().markRead(selectedId);
  }, [selectedId]);
  const selectChat = (id?: string) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (id) next.set('chat', id);
      else next.delete('chat');
      return next;
    });
  };
  return (
    <Layout
      detailOpen={!!selectedChat}
      sidebar={<ChatListWidget session={session} selectedId={selectedId} onSelect={selectChat} />}
      navigation={
        <>
          <span className={styles.logo} title="Green Chat">
            <MessageCircle size={25} strokeWidth={1.7} />
          </span>
          <div className={styles.bottom}>
            <DisconnectFeature />
            <span className={styles.me} title="Мой аккаунт">
              Я
            </span>
          </div>
        </>
      }
    >
      {error && (
        <div className={styles.connectionError} role="status">
          <span>{error.message}</span>
          <button type="button" onClick={reconnect}>
            Повторить подключение
          </button>
        </div>
      )}
      <ConversationWidget session={session} chat={selectedChat} onBack={() => selectChat()} />
    </Layout>
  );
}
export default MessengerWidget;
