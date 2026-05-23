"use client";

import { useCallback, useEffect, useRef } from "react";
import { Turn } from "./Turn";
import type { ImageAction } from "./ImageActionBar";
import styles from "./Canvas.module.css";
import type { MwTurn } from "@/lib/my-way/types";

function applyAvatarShifts(
  root: HTMLElement | null,
  activeIdx: number | null,
  phase: "in" | "out",
) {
  if (!root) return;
  const cs = getComputedStyle(document.documentElement);
  const num = (name: string, fb: number) => {
    const v = parseFloat(cs.getPropertyValue(name));
    return Number.isFinite(v) ? v : fb;
  };
  const ease = (name: string, fb: string) =>
    cs.getPropertyValue(name).trim() || fb;

  const lift = num("--avatar-lift", -6);
  const falloff = num("--avatar-falloff", 0.45);
  const scale = num("--avatar-scale", 1.06);
  const tf =
    phase === "out"
      ? ease("--avatar-ease-out", "cubic-bezier(0.34, 3.85, 0.64, 1)")
      : ease("--avatar-ease-in", "cubic-bezier(0.22, 1, 0.36, 1)");

  root.querySelectorAll<HTMLElement>(".t-avatar").forEach((el, i) => {
    el.style.transitionTimingFunction = tf;
    if (activeIdx === null) {
      el.style.setProperty("--shift", "0px");
      el.style.setProperty("--scale-active", "1");
      return;
    }
    const d = Math.abs(i - activeIdx);
    el.style.setProperty(
      "--shift",
      (lift * Math.pow(falloff, d)).toFixed(3) + "px",
    );
    el.style.setProperty(
      "--scale-active",
      i === activeIdx ? String(scale) : "1",
    );
  });
}

type Props = {
  turns: MwTurn[];
  focusedVariantId: string | null;
  onAction: (turnId: string, variantId: string, action: ImageAction) => void;
  onRetry: (turnId: string, variantId: string) => void;
  onSuggest: (prompt: string) => void;
};

type EmptySample = {
  title: string;
  photoId: string;
  tilt: number;
};

const EMPTY_SAMPLES: EmptySample[] = [
  {
    title: "Misty mountain pass at sunrise",
    photoId: "1469474968028-56623f02e42e",
    tilt: -7,
  },
  {
    title: "Brutalist concrete monolith",
    photoId: "1488972685288-c3fd157d7c7a",
    tilt: 4,
  },
  {
    title: "Soft window light portrait",
    photoId: "1494790108377-be9c29b29330",
    tilt: -3,
  },
  {
    title: "Forest path through morning fog",
    photoId: "1497436072909-60f360e1d4b1",
    tilt: 6,
  },
];

export function Canvas({ turns, focusedVariantId, onAction, onRetry, onSuggest }: Props) {
  const latestRef = useRef<HTMLElement | null>(null);
  const turnCountRef = useRef(turns.length);
  const galleryRef = useRef<HTMLDivElement | null>(null);

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
            <span className={styles.emptyKicker}>Start from something</span>
            <div
              className={styles.gallery}
              ref={galleryRef}
              onMouseLeave={() => applyAvatarShifts(galleryRef.current, null, "out")}
            >
              {EMPTY_SAMPLES.map((sample, idx) => (
                <div
                  key={sample.photoId}
                  className={`${styles.galleryAvatar} t-avatar`}
                  style={
                    {
                      "--mw-tilt": `${sample.tilt}deg`,
                      "--mw-delay": `${idx * 80}ms`,
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => applyAvatarShifts(galleryRef.current, idx, "in")}
                >
                  <button
                    type="button"
                    className={styles.galleryCard}
                    onClick={() => onSuggest(sample.title)}
                    aria-label={`Try: ${sample.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://images.unsplash.com/photo-${sample.photoId}?w=400&h=520&fit=crop&q=80&auto=format`}
                      alt=""
                      loading="eager"
                    />
                    <span className={styles.galleryTitle}>{sample.title}</span>
                  </button>
                </div>
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
