"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";


import { ChevronDownIcon } from "./Icons";
import { SegmentedControl } from "./SegmentedControl";
import styles from "./SettingChip.module.css";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  hint?: string;
};

type SettingChipProps<T extends string> = {
  ariaLabel: string;
  popoverHeading: string;
  displayValue: string;
  displayIcon?: ReactNode;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
};

export function SettingChip<T extends string>({
  ariaLabel,
  popoverHeading,
  displayValue,
  displayIcon,
  value,
  options,
  onChange,
}: SettingChipProps<T>) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"start" | "end">("start");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function decideAlign(): "start" | "end" {
    if (typeof window === "undefined" || !containerRef.current) return "start";
    const chipRect = containerRef.current.getBoundingClientRect();
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const minPopover = (window.innerWidth < 480 ? 14 : 17) * rem;
    const expectedWidth = Math.max(chipRect.width, minPopover);
    if (chipRect.left + expectedWidth > window.innerWidth - 8) {
      return "end";
    }
    return "start";
  }

  function handleToggle() {
    setOpen((prev) => {
      if (!prev) setAlign(decideAlign());
      return !prev;
    });
  }

  return (
    <div ref={containerRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.chip}
        data-open={open ? "true" : "false"}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {displayIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {displayIcon}
          </span>
        ) : null}
        <span className={styles.value}>{displayValue}</span>
        <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
      </button>
      {open ? (
        <div
          className={styles.popover}
          data-align={align}
          role="dialog"
          aria-label={ariaLabel}
        >
          <span className={styles.popoverHeading}>{popoverHeading}</span>
          <SegmentedControl
            ariaLabel={ariaLabel}
            value={value}
            options={options}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
