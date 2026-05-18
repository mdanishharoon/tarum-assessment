import { SparklesIcon } from "./Icons";
import styles from "./EmptyState.module.css";

export function EmptyState() {
  return (
    <div className={styles.wrapper} aria-live="polite">
      <span className={styles.badge} aria-hidden="true">
        <SparklesIcon className={styles.badgeIcon} />
      </span>
      <h2 className={styles.title}>Your canvas is waiting</h2>
      <p className={styles.body}>
        Describe an idea on the left, choose a count and ratio, then hit Generate. Results land
        here.
      </p>
    </div>
  );
}
