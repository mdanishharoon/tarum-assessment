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

  return (
    <div ref={containerRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.chip}
        data-open={open ? "true" : "false"}
        onClick={() => setOpen((value) => !value)}
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
        <div className={styles.popover} role="dialog" aria-label={ariaLabel}>
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
