"use client";

import { IconBrush, IconMagic, IconRefresh, IconRevise, IconSparkle } from "./Icons";
import styles from "./ImageActionBar.module.css";

export type ImageAction = "vary" | "edit" | "animate" | "ref" | "revise";

type Props = {
  visible: boolean;
  onAction: (action: ImageAction) => void;
};

const ACTIONS: { key: ImageAction; label: string; Icon: typeof IconBrush; emphasis?: boolean }[] = [
  { key: "edit", label: "Edit", Icon: IconBrush, emphasis: true },
  { key: "vary", label: "Vary", Icon: IconRefresh },
  { key: "animate", label: "Animate", Icon: IconMagic },
  { key: "ref", label: "Use as ref", Icon: IconSparkle },
  { key: "revise", label: "Revise", Icon: IconRevise },
];

export function ImageActionBar({ visible, onAction }: Props) {
  return (
    <div className={styles.wrap} data-visible={visible} role="toolbar" aria-label="Image actions">
      <div className={styles.bar}>
        {ACTIONS.map(({ key, label, Icon, emphasis }, idx) => (
          <span key={key} style={{ display: "inline-flex", alignItems: "center" }}>
            {idx === 1 && <span className={styles.divider} aria-hidden />}
            <button
              type="button"
              className={styles.button}
              data-emphasis={Boolean(emphasis)}
              onClick={(event) => {
                event.stopPropagation();
                onAction(key);
              }}
            >
              <Icon />
              <span className={styles.label}>{label}</span>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
