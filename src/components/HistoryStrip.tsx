"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { historyItems as seedItems } from "@/lib/history";
import {
  loadHistory,
  subscribeToHistory,
  type HistoryEntry,
} from "@/lib/history-store";
import type { GenerationMode } from "@/lib/types";
import { cn } from "@/lib/cn";
import styles from "./HistoryStrip.module.css";

type DisplayItem = {
  id: string;
  src: string;
  alt: string;
  entry?: HistoryEntry;
};

type SlideDirection = "enter" | "left" | "right";

type HistoryStripProps = {
  onPick?: (entry: HistoryEntry) => void;
  filter?: GenerationMode | null;
  label?: string;
  asDropdown?: boolean;
  open?: boolean;
  id?: string;
  /** Stable key for the active mode — drives the slide animation. */
  contentKey?: string;
  /** Direction to slide the content in from when contentKey changes. */
  direction?: SlideDirection;
};

function toDisplay(entry: HistoryEntry): DisplayItem {
  return {
    id: entry.id,
    src: entry.thumbnailUrl,
    alt: entry.prompt.slice(0, 96) || "Past generation",
    entry,
  };
}

export function HistoryStrip({
  onPick,
  filter = null,
  label = "History",
  asDropdown = false,
  open = false,
  id,
  contentKey = "default",
  direction = "enter",
}: HistoryStripProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntries(loadHistory());
    const unsubscribe = subscribeToHistory(setEntries);
    return unsubscribe;
  }, []);

  const items: DisplayItem[] = useMemo(() => {
    const filtered = filter
      ? entries.filter((entry) => entry.mode === filter)
      : entries;
    const stored = filtered.map(toDisplay);
    const fillCount = Math.max(0, 15 - stored.length);
    const fill = seedItems.slice(0, fillCount).map((item) => ({
      id: item.id,
      src: item.src,
      alt: item.alt,
    }));
    return [...stored, ...fill];
  }, [entries, filter]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 1) {
        setFadeLeft(false);
        setFadeRight(false);
        return;
      }
      setFadeLeft(el.scrollLeft > 1);
      setFadeRight(el.scrollLeft < maxScroll - 1);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [items.length]);

  return (
    <section
      id={id}
      aria-label="Generation history"
      className={cn(styles.container, asDropdown && styles.dropdown)}
      data-open={asDropdown ? (open ? "true" : "false") : undefined}
      role={asDropdown ? "region" : undefined}
    >
      <div
        key={contentKey}
        className={styles.content}
        data-direction={direction}
      >
        <div className={styles.label}>
          <span className={styles.labelTitle}>{label}</span>
          <button
            type="button"
            className={styles.labelLink}
            aria-disabled="true"
            title="A full gallery view isn't part of this prototype"
          >
            View All
          </button>
        </div>
        <div
          className={styles.scrollWrap}
          data-fade-left={fadeLeft ? "true" : "false"}
          data-fade-right={fadeRight ? "true" : "false"}
        >
          <div ref={scrollerRef} className={styles.scroller}>
            <ul className={styles.list}>
              {items.map((item, index) => {
                const interactive = Boolean(item.entry && onPick);
                const handleClick = () => {
                  if (item.entry && onPick) onPick(item.entry);
                };
                return (
                  <li
                    key={item.id}
                    className={styles.item}
                    style={{ "--item-index": index } as React.CSSProperties}
                  >
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
        </div>
      </div>
    </section>
  );
}
