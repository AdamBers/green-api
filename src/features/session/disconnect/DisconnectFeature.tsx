import { useState } from 'react';
import { LogOut } from 'lucide-react';
import Dialog from '@/shared/ui/Dialog';
import Button from '@/shared/ui/Button';
import { useDisconnect } from './model/useDisconnect';
import styles from './DisconnectFeature.module.scss';

function DisconnectFeature() {
  const [open, setOpen] = useState(false);
  const disconnect = useDisconnect();
  return (
    <>
      <Button
        variant="ghost"
        iconOnly
        aria-label="Выйти"
        title="Выйти"
        onClick={() => setOpen(true)}
      >
        <LogOut size={20} />
      </Button>
      {open && (
        <Dialog title="Завершить подключение?" onClose={() => setOpen(false)}>
          <p className={styles.text}>
            Данные подключения, список чатов и кеш переписки в этой вкладке будут очищены. Сообщения
            в WhatsApp останутся.
          </p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Остаться
            </Button>
            <Button onClick={() => void disconnect()}>Выйти</Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
export default DisconnectFeature;
