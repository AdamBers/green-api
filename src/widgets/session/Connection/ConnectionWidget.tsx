import { MessageCircle, CheckCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import ConnectFeature from '@/features/session/connect/ConnectFeature';
import styles from './ConnectionWidget.module.scss';

function ConnectionWidget() {
  return (
    <>
      <div className={styles.card}>
        <section className={styles.hero}>
          <div className={styles.brand}>
            <MessageCircle size={29} strokeWidth={1.7} />
            <span>
              green<span className={styles.brandLight}>chat</span>
              <i />
            </span>
          </div>
          <div className={styles.intro}>
            <span className={styles.badge}>POWERED BY GREEN-API</span>
            <h2>
              Ближе.
              <br />
              Даже на расстоянии.
            </h2>
            <p>
              Знакомые разговоры.
              <br />
              Простое пространство для общения.
            </p>
          </div>
          <div className={styles.preview} aria-hidden="true">
            <div className={styles.previewIncoming}>
              Привет! Как твои дела? 👋<span>12:40</span>
            </div>
            <div className={styles.previewOutgoing}>
              Привет! Рад тебя слышать
              <span>
                12:41 <CheckCheck size={14} />
              </span>
            </div>
            <div className={styles.dots}>
              <i />
              <i />
              <i />
            </div>
          </div>
          <footer>
            <ShieldCheck size={17} />
            <span>Ваши разговоры. Ваше пространство.</span>
            <ArrowUpRight size={16} />
          </footer>
        </section>
        <section className={styles.form}>
          <ConnectFeature />
        </section>
      </div>
      <span className={styles.caption}>WhatsApp-клиент · Тестовое задание GREEN-API</span>
    </>
  );
}
export default ConnectionWidget;
