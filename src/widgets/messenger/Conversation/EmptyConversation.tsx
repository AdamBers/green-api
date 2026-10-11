import { MessageCircle, ArrowUpRight } from 'lucide-react';
import styles from './ConversationWidget.module.scss';

function EmptyConversation() {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeIcon}>
        <MessageCircle size={48} strokeWidth={1.2} />
      </div>
      <span className={styles.eyebrow}>МЕСТО ДЛЯ ВАШИХ РАЗГОВОРОВ</span>
      <h2>Оставайтесь на связи</h2>
      <p>
        Выберите чат слева или начните новый.
        <br />
        Всё важное начинается с простого сообщения.
      </p>
      <span className={styles.welcomeBottom}>
        Просто. Спокойно. По делу.
        <ArrowUpRight size={15} />
      </span>
    </div>
  );
}
export default EmptyConversation;
