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
import { IconChevronDown } from "./Icons";
import styles from "./ToolbarPill.module.css";

export type PillOption<T extends string | number> = {
  value: T;
  label: ReactNode;
  meta?: ReactNode;
  glyph?: ReactNode;
};

type Props<T extends string | number> = {
  icon: ReactNode;
  ariaLabel: string;
  value: T;
  options: PillOption<T>[];
  onChange: (next: T) => void;
  renderValue?: (option: PillOption<T> | undefined) => ReactNode;
  popoverDirection?: "up" | "down";
  className?: string;
};

type Align = "start" | "end" | "up" | "up-end";

export function ToolbarPill<T extends string | number>({
  icon,
  ariaLabel,
  value,
  options,
  onChange,
  renderValue,
  popoverDirection = "up",
  className,
}: Props<T>) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<Align>(popoverDirection === "up" ? "up" : "start");

  const active = options.find((opt) => opt.value === value);

  const computeAlign = useCallback(() => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const minWidth = 220;
    const horizontalOverflow = rect.left + minWidth > window.innerWidth - 16;
    const baseHorizontal: "start" | "end" = horizontalOverflow ? "end" : "start";
    if (popoverDirection === "up") {
      setAlign(baseHorizontal === "end" ? "up-end" : "up");
    } else {
      setAlign(baseHorizontal);
    }
  }, [popoverDirection]);

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

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className ?? ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.pill}
        data-open={open}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        <span className={styles.pillIcon} aria-hidden>
          {icon}
        </span>
        <span className={styles.value}>
          {renderValue ? renderValue(active) : (active?.label ?? "—")}
        </span>
        <IconChevronDown />
      </button>
      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          aria-label={ariaLabel}
          className={styles.popover}
          data-align={align}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={selected}
                data-active={selected}
                className={styles.option}
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
              >
                {opt.glyph ? (
                  <span className={styles.optionGlyph}>{opt.glyph}</span>
                ) : (
                  <span className={styles.optionMark} aria-hidden />
                )}
                {opt.label}
                {opt.meta && <span className={styles.optionMeta}>{opt.meta}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
