"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./LoadingTile.module.css";

type Props = {
  startedAt: number;
  delay: number;
  seedId: string;
  visible?: boolean;
  ready?: boolean;
};

const BLOB_COLORS = [
  ["#7a78ff", "#ff6d38"],
  ["#00a652", "#ffc412"],
  ["#478bff", "#7a78ff"],
  ["#ff6d38", "#ffc412"],
  ["#ccccff", "#478bff"],
];

const GRID_SIZE = 5;
const CENTER = 2;

// Diamond/circle arrangement: 5x5 grid with corners hidden.
type DotCell = { row: number; col: number; ring: number };
const DOTS: DotCell[] = (() => {
  const result: DotCell[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const isCorner = (r === 0 || r === GRID_SIZE - 1) && (c === 0 || c === GRID_SIZE - 1);
      if (isCorner) continue;
      const ring = Math.max(Math.abs(r - CENTER), Math.abs(c - CENTER));
      result.push({ row: r, col: c, ring });
    }
  }
  return result;
})();

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function progressAt(elapsed: number, delay: number, ready: boolean): number {
  // Phase 1 — generation in progress. Asymptotic ramp to 95 over `delay` ms.
  const ratio = Math.max(0, elapsed / Math.max(delay, 1));
  const value = 1 - Math.exp(-ratio * 2.6);
  const genPercent = Math.min(95, Math.floor(value * 95));
  if (!ready) return genPercent;
  // Phase 2 — generation done, media still buffering. Climb 95 → 99 linearly.
  const overTime = Math.max(0, elapsed - delay);
  return Math.min(99, 95 + Math.floor(overTime / 700));
}

export function LoadingTile({
  startedAt,
  delay,
  seedId,
  visible = true,
  ready = false,
}: Props) {
  const [percent, setPercent] = useState<number>(() =>
    progressAt(Date.now() - startedAt, delay, ready),
  );
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    function tick() {
      const next = progressAt(Date.now() - startedAt, delay, ready);
      setPercent((prev) => (prev === next ? prev : next));
      tickRef.current = window.setTimeout(tick, 140);
    }
    tick();
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, [startedAt, delay, ready]);

  const { colorA, colorB, bx, by } = useMemo(() => {
    const h = hashSeed(seedId);
    const pair = BLOB_COLORS[h % BLOB_COLORS.length];
    const bx = 15 + (h % 60);
    const by = 20 + ((h >> 4) % 50);
    return { colorA: pair[0], colorB: pair[1], bx, by };
  }, [seedId]);

  return (
    <div
      className={styles.loading}
      data-visible={visible}
      style={
        {
          "--mw-blob-color": colorA,
          "--mw-blob-color-b": colorB,
          "--mw-blob-x": `${bx}%`,
          "--mw-blob-y": `${by}%`,
        } as React.CSSProperties
      }
    >
      <div className={styles.grid} aria-hidden>
        {DOTS.map(({ row, col, ring }) => (
          <span
            key={`${row}-${col}`}
            className={styles.dot}
            style={
              {
                gridRow: row + 1,
                gridColumn: col + 1,
                "--mw-ring": ring,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <span className={styles.label}>
        Generating <strong>{percent}%</strong>
      </span>
    </div>
  );
}
