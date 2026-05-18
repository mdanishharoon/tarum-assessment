"use client";

import { useId } from "react";
import { ChevronDownIcon } from "./Icons";
import styles from "./PillSelect.module.css";

type Option<T extends string> = { value: T; label: string };

type PillSelectProps<T extends string> = {
  label: string;
  hideLabel?: boolean;
  prefix?: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
};

export function PillSelect<T extends string>({
  label,
  hideLabel = false,
  prefix,
  value,
  options,
  onChange,
}: PillSelectProps<T>) {
  const id = useId();
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={hideLabel ? styles.srOnly : styles.label}>
        {label}
      </label>
      <div className={styles.pill}>
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={styles.select}
          aria-label={hideLabel ? label : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.chevron} />
      </div>
    </div>
  );
}
