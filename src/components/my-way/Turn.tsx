"use client";

import { forwardRef, useEffect, useState } from "react";
import { VariantTile } from "./VariantTile";
import type { ImageAction } from "./ImageActionBar";
import { IconCheck, IconCopy, IconInfo } from "./Icons";
import styles from "./Turn.module.css";
import { MODELS } from "@/lib/ratios";
import type { MwTurn } from "@/lib/my-way/types";

type Props = {
  turn: MwTurn;
  index: number;
  focusedVariantId: string | null;
  onAction: (turnId: string, variantId: string, action: ImageAction) => void;
  onRetry: (turnId: string, variantId: string) => void;
};

function relativeTime(timestamp: number): string {
  const diff = Math.max(0, Date.now() - timestamp);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function modeLabel(mode: MwTurn["mode"]): string {
  if (mode === "video") return "Video";
  if (mode === "inpaint") return "Inpaint";
  return "Image";
}

export const Turn = forwardRef<HTMLElement, Props>(function Turn(
  { turn, index, focusedVariantId, onAction, onRetry },
  ref,
) {
  const count = turn.variants.length as 1 | 2 | 4;
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(turn.prompt).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  const modelShort =
    MODELS.find((m) => m.id === turn.model)?.short ?? turn.model;
  void now;

  return (
    <section
      className={styles.turn}
      ref={ref}
      aria-label={`Turn ${index + 1}: ${turn.prompt}`}
    >
      <header className={styles.header}>
        <p className={styles.prompt} title={turn.prompt}>
          {turn.prompt}
        </p>
        <div className={styles.actions}>
          <div className={styles.infoWrap}>
            <button
              type="button"
              className={styles.actionButton}
              aria-label="Generation details"
              aria-describedby={`turn-${turn.id}-info`}
            >
              <IconInfo />
            </button>
            <div
              id={`turn-${turn.id}-info`}
              role="tooltip"
              className={styles.infoPopover}
            >
              <span>{modelShort}</span>
              <span className={styles.metaDot} aria-hidden />
              <span>{modeLabel(turn.mode)}</span>
              <span className={styles.metaDot} aria-hidden />
              <span>{turn.ratio}</span>
              <span className={styles.metaDot} aria-hidden />
              <span>{relativeTime(turn.createdAt)}</span>
            </div>
          </div>
          <button
            type="button"
            className={styles.actionButton}
            data-active={copied}
            onClick={handleCopy}
            aria-label={copied ? "Prompt copied" : "Copy prompt"}
            title={copied ? "Copied" : "Copy prompt"}
          >
            <span className="t-icon-swap" data-state={copied ? "b" : "a"} aria-hidden>
              <span className="t-icon" data-icon="a">
                <IconCopy />
              </span>
              <span className="t-icon" data-icon="b">
                <IconCheck />
              </span>
            </span>
          </button>
        </div>
      </header>

      <div className={styles.grid} data-count={count}>
        {turn.variants.map((variant) => (
          <VariantTile
            key={variant.id}
            variant={variant}
            ratio={turn.ratio}
            focused={focusedVariantId === variant.id}
            onAction={(variantId, action) => onAction(turn.id, variantId, action)}
            onRetry={(variantId) => onRetry(turn.id, variantId)}
          />
        ))}
      </div>
    </section>
  );
});
