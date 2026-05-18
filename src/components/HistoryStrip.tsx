"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { historyItems as seedItems } from "@/lib/history";
import {
  loadHistory,
  subscribeToHistory,
  type HistoryEntry,
} from "@/lib/history-store";
import styles from "./HistoryStrip.module.css";

type DisplayItem = {
  id: string;
  src: string;
  alt: string;
  entry?: HistoryEntry;
};

type HistoryStripProps = {
  onPick?: (entry: HistoryEntry) => void;
};

function toDisplay(entry: HistoryEntry): DisplayItem {
  return {
    id: entry.id,
    src: entry.thumbnailUrl,
    alt: entry.prompt.slice(0, 96) || "Past generation",
    entry,
  };
}

export function HistoryStrip({ onPick }: HistoryStripProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
    const unsubscribe = subscribeToHistory(setEntries);
    return unsubscribe;
  }, []);

  const items: DisplayItem[] = useMemo(() => {
    const stored = entries.map(toDisplay);
    const fillCount = Math.max(0, 15 - stored.length);
    const fill = seedItems.slice(0, fillCount).map((item) => ({
      id: item.id,
      src: item.src,
      alt: item.alt,
    }));
    return [...stored, ...fill];
  }, [entries]);

  return (
    <section aria-label="Generation history" className={styles.container}>
      <div className={styles.label}>
        <span className={styles.labelTitle}>History</span>
        <button
          type="button"
          className={styles.labelLink}
          aria-disabled="true"
          title="A full gallery view isn't part of this prototype"
        >
          View All
        </button>
      </div>
      <div className={styles.scroller}>
        <ul className={styles.list}>
          {items.map((item) => {
            const interactive = Boolean(item.entry && onPick);
            const handleClick = () => {
              if (item.entry && onPick) onPick(item.entry);
            };
            return (
              <li key={item.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.thumb}
                  aria-label={
                    item.entry
                      ? `Reuse prompt: ${item.alt}`
                      : `${item.alt} (sample)`
                  }
                  onClick={handleClick}
                  disabled={!interactive}
                  data-interactive={interactive ? "true" : "false"}
                >
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
            );
          })}
        </ul>
      </div>
    </section>
  );
}
