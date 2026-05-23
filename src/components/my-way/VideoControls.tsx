"use client";

import { useRef, useState } from "react";
import { IconPlus } from "./Icons";
import styles from "./VideoControls.module.css";
import type { MwMotion } from "@/lib/my-way/types";

type FrameSlot = { url: string } | null;

type Props = {
  firstFrame: FrameSlot;
  lastFrame: FrameSlot;
  motion: MwMotion;
  onSetFirstFrame: (url: string | null) => void;
  onSetLastFrame: (url: string | null) => void;
  onMotionChange: (next: MwMotion) => void;
};

type MotionCell = { value: MwMotion; row: number; col: number; glyph: string; label: string };

const MOTION_CELLS: MotionCell[] = [
  { value: "zoom-out", row: 1, col: 1, glyph: "⤡", label: "Zoom out" },
  { value: "up", row: 1, col: 2, glyph: "↑", label: "Pan up" },
  { value: "orbit", row: 1, col: 3, glyph: "↻", label: "Orbit" },
  { value: "left", row: 2, col: 1, glyph: "←", label: "Pan left" },
  { value: "still", row: 2, col: 2, glyph: "•", label: "Still" },
  { value: "right", row: 2, col: 3, glyph: "→", label: "Pan right" },
  { value: "zoom-in", row: 3, col: 1, glyph: "⤢", label: "Zoom in" },
  { value: "down", row: 3, col: 2, glyph: "↓", label: "Pan down" },
];

export function VideoControls({
  firstFrame,
  lastFrame,
  motion,
  onSetFirstFrame,
  onSetLastFrame,
  onMotionChange,
}: Props) {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const lastInputRef = useRef<HTMLInputElement | null>(null);
  const [shots, setShots] = useState<number[]>([1]);

  function readFile(file: File | undefined, setter: (url: string | null) => void) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(url);
  }

  function addShot() {
    setShots((prev) => (prev.length >= 4 ? prev : [...prev, prev.length + 1]));
  }

  return (
    <div className={styles.row}>
      <div className={styles.frames}>
        <FrameButton
          frame={firstFrame}
          label="First"
          inputRef={firstInputRef}
          onUpload={(file) => readFile(file, onSetFirstFrame)}
          onClear={() => onSetFirstFrame(null)}
        />
        <span className={styles.frameArrow} aria-hidden>
          →
        </span>
        <FrameButton
          frame={lastFrame}
          label="Last"
          inputRef={lastInputRef}
          onUpload={(file) => readFile(file, onSetLastFrame)}
          onClear={() => onSetLastFrame(null)}
        />
      </div>

      <div
        className={styles.motion}
        role="radiogroup"
        aria-label="Camera motion"
      >
        {MOTION_CELLS.map((cell) => (
          <button
            key={cell.value}
            type="button"
            role="radio"
            aria-checked={cell.value === motion}
            aria-label={cell.label}
            data-active={cell.value === motion}
            className={styles.motionCell}
            style={{ gridRow: cell.row, gridColumn: cell.col }}
            onClick={() => onMotionChange(cell.value)}
          >
            <span aria-hidden>{cell.glyph}</span>
          </button>
        ))}
      </div>

      <div className={styles.sequence}>
        <div className={styles.shotStrip} aria-label="Shot sequence">
          {shots.map((n) => (
            <span
              key={n}
              className={styles.shotPill}
              data-active={n === 1}
              data-stub={n !== 1}
            >
              {n}
            </span>
          ))}
        </div>
        <button
          type="button"
          className={styles.sequenceStub}
          onClick={addShot}
          title={shots.length >= 4 ? "Max 4 shots" : "Add another shot (stub)"}
          disabled={shots.length >= 4}
        >
          <IconPlus />
          Shot
        </button>
      </div>
    </div>
  );
}

type FrameButtonProps = {
  frame: FrameSlot;
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File | undefined) => void;
  onClear: () => void;
};

function FrameButton({ frame, label, inputRef, onUpload, onClear }: FrameButtonProps) {
  return (
    <button
      type="button"
      className={styles.frameSlot}
      data-filled={Boolean(frame)}
      aria-label={`${label} frame${frame ? " (filled, click to replace)" : " (click to add)"}`}
      onClick={(event) => {
        if (frame && event.altKey) {
          onClear();
          return;
        }
        inputRef.current?.click();
      }}
    >
      {frame ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={frame.url} alt="" />
      ) : (
        <IconPlus />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => onUpload(event.target.files?.[0])}
      />
      <span className={styles.frameLabel}>{label}</span>
    </button>
  );
}
