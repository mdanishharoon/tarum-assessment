"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, VideoIcon } from "./Icons";
import { PromptCard } from "./PromptCard";
import { VideoPlayer } from "./VideoPlayer";
import type {
  GenerationItem,
  GenerationMode,
  ScheduledItem,
} from "@/lib/types";
import styles from "./ResultsCanvas.module.css";

export type CanvasCell =
  | {
      state: "submitting";
      index: number;
      placeholderId: string;
      kind: GenerationMode;
      startedAt: number;
    }
  | { state: "pending"; item: ScheduledItem; startedAt: number }
  | { state: "done"; item: GenerationItem };

type ResultsCanvasProps = {
  cells: CanvasCell[];
  generationId: string;
  prompt: string;
  modelLabel: string;
  isLoading: boolean;
  justCompleted: boolean;
};

type ProgressPoint = { t: number; p: number };

function buildProgressCurve(delayMs: number): ProgressPoint[] {
  const intermediate = 5 + Math.floor(Math.random() * 5);
  const times: number[] = [];
  const percents: number[] = [];
  for (let i = 0; i < intermediate; i++) {
    times.push(Math.random() * delayMs * 0.94);
    percents.push(3 + Math.random() * 93);
  }
  times.sort((a, b) => a - b);
  percents.sort((a, b) => a - b);
  const curve: ProgressPoint[] = [{ t: 0, p: 0 }];
  for (let i = 0; i < intermediate; i++) {
    curve.push({ t: times[i], p: percents[i] });
  }
  curve.push({ t: delayMs, p: 99 });
  return curve;
}

function valueAt(curve: ProgressPoint[], elapsed: number): number {
  let value = 0;
  for (const point of curve) {
    if (point.t > elapsed) break;
    value = point.p;
  }
  return value;
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number, index: number): number {
  const x = (seed * 1103515245 + 12345 + index * 1664525) >>> 0;
  return (x % 1_000_000) / 1_000_000;
}

function blobStyle(id: string): React.CSSProperties {
  const seed = hashSeed(id);
  const r = (i: number) => pseudoRandom(seed, i);
  return {
    "--blob-a-duration": `${(6 + r(0) * 4).toFixed(2)}s`,
    "--blob-a-delay": `-${(r(1) * 5).toFixed(2)}s`,
    "--blob-a-direction": r(2) > 0.5 ? "alternate-reverse" : "alternate",
    "--blob-b-duration": `${(7 + r(3) * 5).toFixed(2)}s`,
    "--blob-b-delay": `-${(r(4) * 6).toFixed(2)}s`,
    "--blob-b-direction": r(5) > 0.5 ? "alternate-reverse" : "alternate",
    "--sheen-duration": `${(3 + r(6) * 2.2).toFixed(2)}s`,
    "--sheen-delay": `-${(r(7) * 3).toFixed(2)}s`,
  } as React.CSSProperties;
}

function CellPercent({ startedAt, delay }: { startedAt: number; delay: number }) {
  const curveRef = useRef<ProgressPoint[] | null>(null);
  if (curveRef.current === null) curveRef.current = buildProgressCurve(delay);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 120);
    return () => clearInterval(interval);
  }, []);

  const elapsed = now - startedAt;
  const percent = Math.floor(valueAt(curveRef.current, elapsed));
  return (
    <span className={styles.cellPercent} aria-label={`Loading ${percent}%`}>
      {percent}%
    </span>
  );
}

export function ResultsCanvas({
  cells,
  generationId,
  prompt,
  modelLabel,
  isLoading,
  justCompleted,
}: ResultsCanvasProps) {
  return (
    <div className={styles.canvas}>
      <aside className={styles.infoColumn} aria-label="Generation context">
        <PromptCard
          prompt={prompt}
          modelLabel={modelLabel}
          isLoading={isLoading}
          justCompleted={justCompleted}
        />
      </aside>
      <ul
        className={styles.grid}
        aria-label="Generated media"
        aria-busy={isLoading || undefined}
        aria-live="polite"
      >
        {cells.map((cell, index) => {
          const stateAttr =
            cell.state === "done"
              ? "done"
              : cell.state === "pending"
                ? "pending"
                : "submitting";
          const kind =
            cell.state === "submitting" ? cell.kind : cell.item.kind;
          const Glyph = kind === "video" ? VideoIcon : ImageIcon;
          const seedId =
            cell.state === "submitting" ? cell.placeholderId : cell.item.id;
          const cellStyle = {
            ...blobStyle(seedId),
            "--cell-index": index,
          } as React.CSSProperties;

          return (
            <li
              key={`${generationId}-${index}`}
              className={styles.cell}
              data-state={stateAttr}
              style={cellStyle}
            >
              {cell.state !== "submitting" ? (
                <div className={styles.mediaLayer}>
                  {cell.item.kind === "image" ? (
                    <Image
                      src={cell.item.url}
                      alt={cell.item.alt}
                      width={cell.item.width}
                      height={cell.item.height}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 18vw"
                      className={styles.media}
                    />
                  ) : (
                    <VideoPlayer
                      src={cell.item.url}
                      poster={cell.item.poster}
                      alt={cell.item.alt}
                    />
                  )}
                </div>
              ) : null}
              <div
                className={styles.skeletonLayer}
                aria-hidden={cell.state === "done" ? true : undefined}
              >
                <div className={styles.skeleton} />
                <span className={styles.cellGlyph} aria-hidden="true">
                  <Glyph />
                </span>
                {cell.state === "pending" ? (
                  <CellPercent
                    startedAt={cell.startedAt}
                    delay={cell.item.delay}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
