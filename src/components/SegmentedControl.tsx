"use client";

import type { ReactNode } from "react";
import styles from "./SegmentedControl.module.css";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  hint?: string;
};

type SegmentedControlProps<T extends string> = {
  ariaLabel: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={styles.group}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active ? "true" : "false"}
            onClick={() => onChange(option.value)}
            className={styles.item}
            title={option.hint || option.label}
          >
            {option.icon ? (
              <span className={styles.icon} aria-hidden="true">
                {option.icon}
              </span>
            ) : null}
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RatioGlyph({ ratio }: { ratio: string }) {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return null;
  const box = 14;
  const rectW = w >= h ? box : box * (w / h);
  const rectH = h >= w ? box : box * (h / w);
  const x = (box - rectW) / 2;
  const y = (box - rectH) / 2;
  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      aria-hidden="true"
    >
      <rect
        x={x + 0.6}
        y={y + 0.6}
        width={rectW - 1.2}
        height={rectH - 1.2}
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
