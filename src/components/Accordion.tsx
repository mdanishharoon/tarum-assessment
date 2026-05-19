"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./Icons";
import styles from "./Accordion.module.css";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  disabledHint?: string;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  disabledHint,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const effectiveOpen = disabled ? false : open;
  return (
    <div
      className={cn(styles.wrapper, effectiveOpen && styles.wrapperOpen)}
      data-disabled={disabled ? "true" : undefined}
    >
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setOpen((value) => !value);
        }}
        aria-expanded={effectiveOpen}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        title={disabled ? disabledHint : undefined}
        className={styles.trigger}
      >
        <span className={styles.title}>{title}</span>
        <ChevronDownIcon className={cn(styles.chevron, effectiveOpen && styles.chevronOpen)} />
      </button>
      <div className={styles.content} hidden={!effectiveOpen}>
        {children}
      </div>
    </div>
  );
}
