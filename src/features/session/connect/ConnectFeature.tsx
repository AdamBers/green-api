import { ArrowRight, ExternalLink, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { LIVE_API_ENABLED } from '@/shared/config/env';
import { useConnectFeature } from './model/useConnectFeature';
import styles from './ConnectFeature.module.scss';

function ConnectFeature() {
  const { register, errors, isPending, onSubmit, enterDemo } = useConnectFeature();
  const [showToken, setShowToken] = useState(false);
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>ВАШ WHATSAPP, НОВЫЙ ИНТЕРФЕЙС</span>
      <h1>Давайте подключимся</h1>
      <p className={styles.description}>
        Введите данные инстанса GREEN-API,
        <br />
        чтобы начать общение.
      </p>
      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <Input
          label="Адрес API"
          placeholder="https://7103.api.green-api.com"
          autoComplete="url"
          {...register('apiUrl')}
          error={errors.apiUrl?.message}
        />
        <Input
          label="ID инстанса"
          placeholder="Например, 7103123456"
          inputMode="numeric"
          autoComplete="off"
          {...register('idInstance')}
          error={errors.idInstance?.message}
        />
        <div className={styles.token}>
          <Input
            label="Токен доступа"
            type={showToken ? 'text' : 'password'}
            placeholder="apiTokenInstance"
            autoComplete="off"
            {...register('apiTokenInstance')}
            error={errors.apiTokenInstance?.message}
          />
          <Button
            variant="ghost"
            iconOnly
            aria-label={showToken ? 'Скрыть токен' : 'Показать токен'}
            onClick={() => setShowToken((value) => !value)}
          >
            {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        {errors.root && (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={!LIVE_API_ENABLED || isPending}>
          {isPending ? 'Подключаемся…' : 'Подключить WhatsApp'}
          <ArrowRight size={18} />
        </Button>
        {!LIVE_API_ENABLED && (
          <p className={styles.note}>
            Реальное подключение появится после настройки API.
            <br />
            Пока можно попробовать демоверсию ниже.
          </p>
        )}
      </form>
      <div className={styles.divider}>
        <span>ИЛИ</span>
      </div>
      <Button variant="secondary" onClick={enterDemo}>
        <FlaskConical size={18} />
        Открыть демоверсию
        <ArrowRight size={17} />
      </Button>
      <a
        className={styles.link}
        href="https://console.green-api.com/"
        target="_blank"
        rel="noreferrer"
      >
        Где найти данные подключения?
        <ExternalLink size={13} />
      </a>
      <p className={styles.privacy}>Данные сохраняются только в этой вкладке.</p>
    </div>
  );
}
export default ConnectFeature;
