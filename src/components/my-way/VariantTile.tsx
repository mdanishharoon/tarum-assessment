"use client";

import { useEffect, useRef, useState } from "react";
import { ImageActionBar, type ImageAction } from "./ImageActionBar";
import { IconPlay } from "./Icons";
import { LoadingTile } from "./LoadingTile";
import styles from "./VariantTile.module.css";
import type { MwRatio, MwVariant } from "@/lib/my-way/types";

type Props = {
  variant: MwVariant;
  ratio: MwRatio;
  focused: boolean;
  onAction: (variantId: string, action: ImageAction) => void;
  onRetry: (variantId: string) => void;
};

export function VariantTile({ variant, ratio, focused, onAction, onRetry }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!pinned) return;
    function close(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setPinned(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [pinned]);

  function handleVideoToggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  const showActions = variant.status === "ready" && (hovered || pinned);

  return (
    <div
      ref={wrapRef}
      className={styles.tile}
      data-aspect={ratio}
      data-status={variant.status}
      data-focused={focused}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (variant.status === "ready") setPinned((prev) => !prev);
      }}
    >
      {variant.status === "pending" && (
        <LoadingTile
          startedAt={variant.startedAt}
          delay={variant.delay}
          seedId={variant.id}
        />
      )}

      {variant.status === "ready" && variant.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.image} src={variant.url} alt={variant.alt} />
      )}

      {variant.status === "ready" && variant.kind === "video" && (
        <div className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.image}
            src={variant.url}
            poster={variant.poster}
            loop
            muted
            playsInline
          />
          {!playing && (
            <button
              type="button"
              className={styles.videoPlay}
              aria-label="Play video"
              onClick={(event) => {
                event.stopPropagation();
                handleVideoToggle();
              }}
            >
              <span>
                <IconPlay />
              </span>
            </button>
          )}
        </div>
      )}

      {variant.status === "error" && (
        <div className={styles.error}>
          <div className={styles.errorTitle}>Hmm.</div>
          <div className={styles.errorBody}>Couldn&apos;t make this one. Try again?</div>
          <button
            type="button"
            className={styles.errorRetry}
            onClick={(event) => {
              event.stopPropagation();
              onRetry(variant.id);
            }}
          >
            Retry
          </button>
        </div>
      )}

      <ImageActionBar
        visible={showActions}
        onAction={(action) => onAction(variant.id, action)}
      />
    </div>
  );
}
