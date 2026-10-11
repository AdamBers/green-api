import type { ReactNode } from 'react';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode;
  navigation?: ReactNode;
  sidebar?: ReactNode;
  detailOpen?: boolean;
};
function Layout({ children, navigation, sidebar, detailOpen }: Props) {
  if (!sidebar) return <main className={styles.centered}>{children}</main>;
  return (
    <main className={`${styles.shell} ${detailOpen ? styles.detailOpen : ''}`}>
      <nav className={styles.navigation} aria-label="Основная навигация">
        {navigation}
      </nav>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <section className={styles.content} aria-label="Основная область">
        {children}
      </section>
    </main>
  );
}
export default Layout;
