"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, PlayIcon, VideoIcon } from "./Icons";
import { PromptCard } from "./PromptCard";
import type { GenerationItem, ScheduledItem } from "@/lib/types";
import styles from "./ResultsCanvas.module.css";

export type CanvasCell =
  | { state: "pending"; item: ScheduledItem; startedAt: number }
  | { state: "done"; item: GenerationItem };

type ResultsCanvasProps = {
  cells: CanvasCell[];
  prompt: string;
  modelLabel: string;
  isLoading: boolean;
};

function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return now;
}

export function ResultsCanvas({ cells, prompt, modelLabel, isLoading }: ResultsCanvasProps) {
  const now = useNow(isLoading);

  return (
    <div className={styles.canvas}>
      <aside className={styles.infoColumn} aria-label="Generation context">
        <PromptCard prompt={prompt} modelLabel={modelLabel} isLoading={isLoading} />
      </aside>
      <ul
        className={styles.grid}
        aria-label="Generated media"
        aria-busy={isLoading || undefined}
        aria-live="polite"
      >
        {cells.map((cell, index) => {
          if (cell.state === "pending") {
            const elapsed = now - cell.startedAt;
            const ratio = Math.min(elapsed / cell.item.delay, 0.99);
            const percent = Math.max(0, Math.floor(ratio * 100));
            const Glyph = cell.item.kind === "video" ? VideoIcon : ImageIcon;
            return (
              <li key={`pending-${index}`} className={styles.cell}>
                <div className={styles.skeleton} aria-hidden="true" />
                <span className={styles.cellGlyph} aria-hidden="true">
                  <Glyph />
                </span>
                <span className={styles.cellPercent} aria-label={`Loading ${percent}%`}>
                  {percent}%
                </span>
              </li>
            );
          }

          const item = cell.item;
          return (
            <li key={item.id} className={styles.cell}>
              {item.kind === "image" ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 18vw"
                  className={styles.media}
                />
              ) : (
                <div className={styles.videoWrapper}>
                  <video
                    src={item.url}
                    poster={item.poster}
                    controls
                    preload="metadata"
                    playsInline
                    className={styles.media}
                    aria-label={item.alt}
                  />
                  <span className={styles.playBadge} aria-hidden="true">
                    <PlayIcon className={styles.playIcon} />
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
