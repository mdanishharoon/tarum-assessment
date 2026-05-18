import { HeaderActions } from "./HeaderActions";
import { IconNav } from "./IconNav";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.start}>
        <Logo />
      </div>
      <div className={styles.center}>
        <IconNav />
      </div>
      <div className={styles.end}>
        <HeaderActions />
      </div>
    </header>
  );
}
