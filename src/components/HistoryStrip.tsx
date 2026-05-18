"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);

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

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      event.pointerId !== dragRef.current.pointerId
    ) {
      return;
    }
    const el = scrollerRef.current;
    if (!el) return;
    const dx = event.clientX - dragRef.current.startX;
    if (!dragRef.current.moved && Math.abs(dx) > 4) {
      dragRef.current.moved = true;
    }
    el.scrollLeft = dragRef.current.startScroll - dx;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      event.pointerId !== dragRef.current.pointerId
    ) {
      return;
    }
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    if (dragRef.current.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
    }
    dragRef.current.pointerId = -1;
    setIsDragging(false);
  }

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
      <div
        className={styles.scrollWrap}
        data-fade-left={fadeLeft ? "true" : "false"}
        data-fade-right={fadeRight ? "true" : "false"}
      >
        <div
          ref={scrollerRef}
          className={styles.scroller}
          data-dragging={isDragging ? "true" : "false"}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
        <ul className={styles.list}>
          {items.map((item) => {
            const interactive = Boolean(item.entry && onPick);
            const handleClick = () => {
              if (suppressClickRef.current) return;
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
      </div>
    </section>
  );
}
