import styles from './Avatar.module.scss';

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const tone = [...name].reduce((total, letter) => total + letter.charCodeAt(0), 0) % 4;
  return (
    <span
      aria-hidden="true"
      className={`${styles.avatar} ${styles[`tone${tone}`]} ${large ? styles.large : ''}`}
    >
      {initials}
    </span>
  );
}
export default Avatar;
