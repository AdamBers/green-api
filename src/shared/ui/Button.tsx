import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  iconOnly?: boolean;
};
function Button({
  variant = 'primary',
  iconOnly,
  className = '',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${iconOnly ? styles.icon : ''} ${className}`}
      {...props}
    />
  );
}
export default Button;
