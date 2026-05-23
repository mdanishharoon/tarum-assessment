"use client";

import { type ReactNode, useId } from "react";
import styles from "./Segmented.module.css";

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
};

type Props<T extends string | number> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  className?: string;
};

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  className,
}: Props<T>) {
  const id = useId();
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value),
  );
  const count = options.length;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`${styles.group} ${className ?? ""}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        className={styles.indicator}
        aria-hidden
        style={{
          left: "3px",
          width: `calc((100% - 6px) / ${count})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            id={`${id}-${opt.value}`}
            aria-checked={active}
            aria-label={opt.ariaLabel}
            data-active={active}
            onClick={() => onChange(opt.value)}
            className={styles.option}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
