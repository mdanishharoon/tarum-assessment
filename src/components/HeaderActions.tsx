import { GalleryIcon, SupportIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./HeaderActions.module.css";

export function HeaderActions() {
  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.pill} aria-label="Open gallery">
        <GalleryIcon className={styles.pillIcon} />
        <span className={styles.pillLabel}>Gallery</span>
      </button>
      <button type="button" className={styles.pill} aria-label="Contact support">
        <SupportIcon className={styles.pillIcon} />
        <span className={styles.pillLabel}>Support</span>
      </button>
      <ThemeToggle />
      <button type="button" className={styles.avatar} aria-label="Account menu">
        <span aria-hidden="true">A</span>
      </button>
    </div>
  );
}
