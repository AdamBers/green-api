import ChatConversation, { type ChatConversationProps } from './ChatConversation';
import EmptyConversation from './EmptyConversation';

type Props = Omit<ChatConversationProps, 'chat'> & { chat?: ChatConversationProps['chat'] };

function ConversationWidget({ chat, ...props }: Props) {
  if (!chat) return <EmptyConversation />;
  return <ChatConversation {...props} chat={chat} />;
}
export default ConversationWidget;
