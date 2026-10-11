import { Send } from 'lucide-react';
import Button from '@/shared/ui/Button';
import { useMessageForm } from './model/useMessageForm';
import styles from './SendMessageFeature.module.scss';

function SendMessageFeature({ onSend }: { onSend: (text: string) => void }) {
  const { register, errors, submit } = useMessageForm(onSend);
  return (
    <footer className={styles.footer}>
      <form className={styles.composer} onSubmit={submit} noValidate>
        <textarea
          rows={1}
          aria-label="Сообщение"
          placeholder="Напишите сообщение…"
          {...register('text')}
          aria-invalid={!!errors.text}
          aria-describedby={errors.text ? 'message-error' : undefined}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <Button type="submit" iconOnly aria-label="Отправить сообщение" title="Отправить сообщение">
          <Send size={19} />
        </Button>
      </form>
      {errors.text && (
        <p id="message-error" className={styles.error} role="alert">
          {errors.text.message}
        </p>
      )}
      <p className={styles.hint}>
        Enter — отправить <span>·</span> Shift + Enter — новая строка
      </p>
    </footer>
  );
}
export default SendMessageFeature;
