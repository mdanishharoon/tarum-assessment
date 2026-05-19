"use client";

import { cn } from "@/lib/cn";
import type { GenerationMode } from "@/lib/types";
import styles from "./ModeTabs.module.css";

type ModeTabsProps = {
  value: GenerationMode;
  onChange: (mode: GenerationMode) => void;
};

const modes: { id: GenerationMode; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
];

export function ModeTabs({ value, onChange }: ModeTabsProps) {
  const activeIndex = modes.findIndex((m) => m.id === value);
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Generation mode">
      <span
        className={styles.indicator}
        aria-hidden="true"
        style={{
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 0.64}rem))`,
        }}
      />
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          role="tab"
          aria-selected={value === mode.id}
          onClick={() => onChange(mode.id)}
          className={cn(styles.tab, value === mode.id && styles.tabActive)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
