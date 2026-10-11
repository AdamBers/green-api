import { Plus, ArrowRight } from 'lucide-react';
import type { Session } from '@/entities/session/types';
import Dialog from '@/shared/ui/Dialog';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { useCreateChat } from './model/useCreateChat';
import styles from './CreateChatFeature.module.scss';

function CreateChatFeature({
  session,
  onSelect,
}: {
  session: Session;
  onSelect: (id: string) => void;
}) {
  const { open, openDialog, close, register, errors, onSubmit } = useCreateChat(session, onSelect);
  return (
    <>
      <Button
        variant="ghost"
        iconOnly
        aria-label="Создать новый чат"
        title="Новый чат"
        onClick={openDialog}
      >
        <Plus size={22} />
      </Button>
      {open && (
        <Dialog title="Новый разговор" onClose={close}>
          <p className={styles.description}>
            Введите номер получателя в WhatsApp.
            <br />
            Если чат уже есть, мы откроем его.
          </p>
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <Input
              label="Номер телефона"
              type="tel"
              autoComplete="tel"
              placeholder="+7 999 123-45-67"
              autoFocus
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Имя · необязательно"
              autoComplete="off"
              placeholder="Как зовут собеседника?"
              {...register('name')}
              error={errors.name?.message}
            />
            <Button type="submit">
              Начать разговор
              <ArrowRight size={17} />
            </Button>
          </form>
        </Dialog>
      )}
    </>
  );
}
export default CreateChatFeature;
