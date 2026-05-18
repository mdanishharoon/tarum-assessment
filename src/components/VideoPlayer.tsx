"use client";

import { useEffect, useRef, useState } from "react";
import {
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  VolumeIcon,
} from "./Icons";
import styles from "./VideoPlayer.module.css";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  alt: string;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ src, poster, alt }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      setHasStarted(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(video.currentTime);
    const onDuration = () => setDuration(video.duration || 0);
    const onVolume = () => setMuted(video.muted);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("volumechange", onVolume);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("volumechange", onVolume);
    };
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      void video.play();
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }

  function toggleFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void video.requestFullscreen?.();
    }
  }

  function scrubTo(clientX: number) {
    const video = videoRef.current;
    const scrub = scrubRef.current;
    if (!video || !scrub || !Number.isFinite(video.duration)) return;
    const rect = scrub.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  }

  function handleScrubPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrubTo(event.clientX);
  }

  function handleScrubPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    scrubTo(event.clientX);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showOverlay = !isPlaying || hovered;
  const showCenterButton = !hasStarted || (!isPlaying && hovered);

  return (
    <div
      className={styles.player}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-playing={isPlaying ? "true" : "false"}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        className={styles.video}
        aria-label={alt}
        onClick={togglePlay}
      />

      {showCenterButton ? (
        <button
          type="button"
          className={styles.centerButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          tabIndex={-1}
        >
          {isPlaying ? (
            <PauseIcon className={styles.centerIcon} />
          ) : (
            <PlayIcon className={styles.centerIcon} />
          )}
        </button>
      ) : null}

      <div
        className={styles.controlBar}
        data-visible={showOverlay ? "true" : "false"}
      >
        <button
          type="button"
          className={styles.controlButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className={styles.controlIcon} />
          ) : (
            <PlayIcon className={styles.controlIcon} />
          )}
        </button>

        <div
          ref={scrubRef}
          className={styles.scrub}
          onPointerDown={handleScrubPointerDown}
          onPointerMove={handleScrubPointerMove}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuenow={Math.round(currentTime)}
        >
          <div className={styles.scrubTrack} />
          <div className={styles.scrubFill} style={{ width: `${progress}%` }} />
          <div className={styles.scrubThumb} style={{ left: `${progress}%` }} />
        </div>

        <span className={styles.time}>
          {formatTime(currentTime)} <span className={styles.timeDim}>/</span>{" "}
          {formatTime(duration)}
        </span>

        <button
          type="button"
          className={styles.controlButton}
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <MuteIcon className={styles.controlIcon} />
          ) : (
            <VolumeIcon className={styles.controlIcon} />
          )}
        </button>

        <button
          type="button"
          className={styles.controlButton}
          onClick={toggleFullscreen}
          aria-label="Fullscreen"
        >
          <FullscreenIcon className={styles.controlIcon} />
        </button>
      </div>
    </div>
  );
}
