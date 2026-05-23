"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { IconBrush, IconMagic, IconRefresh, IconRevise, IconSparkle } from "./Icons";
import styles from "./ImageActionBar.module.css";

export type ImageAction = "vary" | "edit" | "animate" | "ref" | "revise";

type Props = {
  visible: boolean;
  onAction: (action: ImageAction) => void;
};

const ACTIONS: { key: ImageAction; label: string; Icon: typeof IconBrush }[] = [
  { key: "edit", label: "Edit", Icon: IconBrush },
  { key: "vary", label: "Vary", Icon: IconRefresh },
  { key: "animate", label: "Animate", Icon: IconMagic },
  { key: "ref", label: "Use as ref", Icon: IconSparkle },
  { key: "revise", label: "Revise", Icon: IconRevise },
];

export function ImageActionBar({ visible, onAction }: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  useLayoutEffect(() => {
    if (hoveredIndex === null || !barRef.current) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const btn = buttonRefs.current[hoveredIndex];
    if (!btn) return;
    const barRect = barRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - barRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [hoveredIndex]);

  return (
    <div
      className={styles.wrap}
      data-visible={visible}
      role="toolbar"
      aria-label="Image actions"
    >
      <div
        className={styles.bar}
        ref={barRef}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <span
          className={styles.indicator}
          aria-hidden
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
            opacity: indicator.opacity,
          }}
        />
        {ACTIONS.map(({ key, label, Icon }, idx) => (
          <button
            key={key}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            type="button"
            className={styles.button}
            data-highlighted={hoveredIndex === idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onFocus={() => setHoveredIndex(idx)}
            onBlur={() => setHoveredIndex(null)}
            onClick={(event) => {
              event.stopPropagation();
              onAction(key);
            }}
          >
            <Icon />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
