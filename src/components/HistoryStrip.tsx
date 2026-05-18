import Image from "next/image";
import { historyItems } from "@/lib/history";
import styles from "./HistoryStrip.module.css";

export function HistoryStrip() {
  return (
    <section aria-label="Generation history" className={styles.container}>
      <div className={styles.label}>
        <span className={styles.labelTitle}>History</span>
        <button type="button" className={styles.labelLink}>
          View All
        </button>
      </div>
      <div className={styles.scroller}>
        <ul className={styles.list}>
          {historyItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <button type="button" className={styles.thumb} aria-label={item.alt}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={240}
                  height={240}
                  className={styles.thumbImage}
                  sizes="(max-width: 640px) 96px, 120px"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
