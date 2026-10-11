import type { Session } from '@/entities/session/types';
import MessengerWidget from '@/widgets/messenger/Messenger/MessengerWidget';

function MessengerPage({ session }: { session: Session }) {
  return <MessengerWidget session={session} />;
}
export default MessengerPage;
