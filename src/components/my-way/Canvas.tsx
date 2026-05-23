"use client";

import { useCallback, useEffect, useRef } from "react";
import { Turn } from "./Turn";
import type { ImageAction } from "./ImageActionBar";
import styles from "./Canvas.module.css";
import type { MwTurn } from "@/lib/my-way/types";

type Props = {
  turns: MwTurn[];
  focusedVariantId: string | null;
  onAction: (turnId: string, variantId: string, action: ImageAction) => void;
  onRetry: (turnId: string, variantId: string) => void;
  onSuggest: (prompt: string) => void;
};

const EMPTY_HINTS = [
  "Cinematic foggy alley, neon shop signs",
  "Studio shot of a brutalist ceramic vase",
  "Watercolor portrait, low contrast",
  "Slow dolly through a quiet city at dawn",
];

export function Canvas({ turns, focusedVariantId, onAction, onRetry, onSuggest }: Props) {
  const latestRef = useRef<HTMLElement | null>(null);
  const turnCountRef = useRef(turns.length);

  const setLatestRef = useCallback((el: HTMLElement | null) => {
    latestRef.current = el;
  }, []);

  useEffect(() => {
    if (turns.length > turnCountRef.current) {
      latestRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    turnCountRef.current = turns.length;
  }, [turns.length]);

  if (turns.length === 0) {
    return (
      <div className={styles.scrollWrap}>
        <div className={styles.canvas} data-empty>
          <div className={styles.empty}>
            <div className={styles.emptyShapes} aria-hidden>
              <span className={styles.emptyDot} style={{ background: "var(--mw-amethyst)" }} />
              <span className={styles.emptyDot} style={{ background: "var(--mw-sunset)" }} />
              <span className={styles.emptyDot} style={{ background: "var(--mw-lime)" }} />
            </div>
            <div className={styles.emptyHints}>
              {EMPTY_HINTS.slice(0, 3).map((hint) => (
                <button
                  key={hint}
                  type="button"
                  className={styles.emptyHint}
                  onClick={() => onSuggest(hint)}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollWrap}>
      <div className={styles.canvas}>
        {turns.map((turn, index) => (
          <Turn
            key={turn.id}
            turn={turn}
            index={index}
            focusedVariantId={focusedVariantId}
            onAction={onAction}
            onRetry={onRetry}
            ref={index === turns.length - 1 ? setLatestRef : undefined}
          />
        ))}
      </div>
    </div>
  );
}
