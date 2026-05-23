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
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setMediaLoaded(false);
    setLoadError(false);
  }, [variant.url]);

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

  const showActions =
    variant.status === "ready" && mediaLoaded && !loadError && (hovered || pinned);
  const showError = variant.status === "error" || loadError;

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
      {!showError && (
        <LoadingTile
          startedAt={variant.startedAt}
          delay={variant.delay}
          seedId={variant.id}
          visible={variant.status === "pending" || !mediaLoaded}
          ready={variant.status === "ready"}
        />
      )}

      {variant.status === "ready" && variant.kind === "image" && !loadError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.image}
          src={variant.url}
          alt={variant.alt}
          data-loaded={mediaLoaded}
          onLoad={() => setMediaLoaded(true)}
          onError={() => setLoadError(true)}
        />
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
            preload="metadata"
            data-loaded={mediaLoaded}
            onLoadedMetadata={() => setMediaLoaded(true)}
            onLoadedData={() => setMediaLoaded(true)}
            onCanPlay={() => setMediaLoaded(true)}
            onError={() => setLoadError(true)}
          />
          {mediaLoaded && !playing && (
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

      {showError && (
        <div className={styles.error}>
          <div className={styles.errorTitle}>Hmm.</div>
          <div className={styles.errorBody}>Couldn&apos;t make this one. Try again?</div>
          <button
            type="button"
            className={styles.errorRetry}
            onClick={(event) => {
              event.stopPropagation();
              setLoadError(false);
              setMediaLoaded(false);
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
