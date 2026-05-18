"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./Icons";
import styles from "./Accordion.module.css";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn(styles.wrapper, open && styles.wrapperOpen)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={styles.trigger}
      >
        <span className={styles.title}>{title}</span>
        <ChevronDownIcon className={cn(styles.chevron, open && styles.chevronOpen)} />
      </button>
      <div className={styles.content} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
