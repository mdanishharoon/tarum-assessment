"use client";

import styles from "./Header.module.css";
import { IconBrandMark, IconHelp, IconMenu, IconSearch, IconSparkle } from "./Icons";

type Props = {
  onOpenCommander: () => void;
  onOpenNav?: () => void;
};

export function Header({ onOpenCommander, onOpenNav }: Props) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Open navigation"
        onClick={onOpenNav}
      >
        <IconMenu />
      </button>

      <span className={styles.brand} aria-hidden>
        <span className={styles.brandMark}>
          <IconBrandMark />
        </span>
        <span className={styles.brandTag}>Tarum</span>
      </span>

      <button
        type="button"
        className={styles.commander}
        aria-label="Open command menu"
        title="Open command menu"
        onClick={onOpenCommander}
      >
        <span className={styles.commanderIcon}>
          <IconSearch />
        </span>
        <span className={styles.commanderLabel}>What do you want to do?</span>
        <span className={styles.commanderKbd} aria-hidden>
          ⌘K
        </span>
      </button>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.upgrade}
          aria-label="Upgrade to Pro"
        >
          <IconSparkle />
          <span>Upgrade</span>
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Support"
          title="Support (coming soon)"
        >
          <IconHelp />
        </button>
        <button
          type="button"
          className={styles.avatar}
          aria-label="Account"
          title="Account (coming soon)"
        >
          A
        </button>
      </div>
    </header>
  );
}
