"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IconChevronDown, IconSliders } from "./Icons";
import { MODELS } from "@/lib/ratios";
import type { MwDuration, MwRatio } from "@/lib/my-way/types";
import styles from "./SettingsPill.module.css";

type Props = {
  model: string;
  onModel: (next: string) => void;
  ratio: MwRatio;
  onRatio: (next: MwRatio) => void;
  duration: MwDuration;
  onDuration: (next: MwDuration) => void;
  showDuration: boolean;
};

const RATIOS: { value: MwRatio; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "4:3", label: "Landscape" },
  { value: "3:4", label: "Portrait" },
  { value: "16:9", label: "Cinema" },
];

const DURATIONS: MwDuration[] = [4, 6, 8];

const RATIO_DIMS: Record<MwRatio, { w: number; h: number }> = {
  "1:1": { w: 14, h: 14 },
  "4:3": { w: 17, h: 13 },
  "3:4": { w: 13, h: 17 },
  "16:9": { w: 20, h: 11 },
};

function RatioGlyph({ ratio }: { ratio: MwRatio }) {
  const { w, h } = RATIO_DIMS[ratio];
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: `${w}px`,
        height: `${h}px`,
        background: "currentColor",
        borderRadius: "2px",
      }}
    />
  );
}

export function SettingsPill({
  model,
  onModel,
  ratio,
  onRatio,
  duration,
  onDuration,
  showDuration,
}: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [alignEnd, setAlignEnd] = useState(false);

  const modelEntry = MODELS.find((m) => m.id === model);

  const computeAlign = useCallback(() => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const overflow = rect.left + 340 > window.innerWidth - 16;
    setAlignEnd(overflow);
  }, []);

  const toggle = useCallback(() => {
    computeAlign();
    setOpen((prev) => !prev);
  }, [computeAlign]);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useLayoutEffect(() => {
    if (open) computeAlign();
  }, [open, computeAlign]);

  const summary: ReactNode = (
    <>
      <span>{modelEntry?.short ?? "—"}</span>
      <span className={styles.summaryDot} aria-hidden />
      <span>{ratio}</span>
      {showDuration && (
        <>
          <span className={styles.summaryDot} aria-hidden />
          <span>{duration}s</span>
        </>
      )}
    </>
  );

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.pill}
        data-open={open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-settings`}
        aria-label="Generation settings"
        onClick={toggle}
      >
        <span className={styles.pillIcon} aria-hidden>
          <IconSliders />
        </span>
        <span className={styles.summary}>{summary}</span>
        <IconChevronDown className={styles.chevron} />
      </button>
      {open && (
        <div
          id={`${id}-settings`}
          role="dialog"
          aria-label="Generation settings"
          className={styles.popover}
          data-align={alignEnd ? "end" : "start"}
        >
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Model</span>
            <div className={styles.options}>
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={styles.option}
                  data-active={m.id === model}
                  onClick={() => onModel(m.id)}
                >
                  {m.short}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Aspect ratio</span>
            <div className={styles.options}>
              {RATIOS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={styles.option}
                  data-active={r.value === ratio}
                  onClick={() => onRatio(r.value)}
                >
                  <span className={styles.optionGlyph}>
                    <RatioGlyph ratio={r.value} />
                  </span>
                  {r.value}
                </button>
              ))}
            </div>
          </div>

          {showDuration && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Length</span>
              <div className={styles.options}>
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={styles.option}
                    data-active={d === duration}
                    onClick={() => onDuration(d)}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
