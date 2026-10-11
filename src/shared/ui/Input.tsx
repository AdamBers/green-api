import { useId, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};
function Input({ label, error, hint, id, ...props }: Props) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  return (
    <div className={styles.field}>
      <label htmlFor={fieldId}>{label}</label>
      <input
        {...props}
        id={fieldId}
        className={error ? styles.invalid : ''}
        aria-invalid={!!error}
        aria-describedby={error || hint ? descriptionId : undefined}
      />
      {(error || hint) && (
        <span
          id={descriptionId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
export default Input;
