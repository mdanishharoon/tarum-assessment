"use client";

import { cn } from "@/lib/cn";
import {
  FolderIconSolid,
  HomeIconSolid,
  ImageIconSolid,
  VideoIconSolid,
  WandIconSolid,
} from "./Icons";
import styles from "./IconNav.module.css";

export type HistoryTab = "home" | "image" | "video" | "enhance" | "library";

const items: ReadonlyArray<{ id: HistoryTab; label: string; Icon: typeof HomeIconSolid }> = [
  { id: "home", label: "All history", Icon: HomeIconSolid },
  { id: "image", label: "Image history", Icon: ImageIconSolid },
  { id: "video", label: "Video history", Icon: VideoIconSolid },
  { id: "enhance", label: "Enhance", Icon: WandIconSolid },
  { id: "library", label: "Library", Icon: FolderIconSolid },
];

type IconNavProps = {
  active: HistoryTab | null;
  onSelect: (tab: HistoryTab) => void;
  panelId?: string;
  buttonRef?: React.RefObject<Record<HistoryTab, HTMLButtonElement | null>>;
};

export function IconNav({ active, onSelect, panelId = "history-panel", buttonRef }: IconNavProps) {
  const activeIndex = active ? items.findIndex((item) => item.id === active) : -1;
  const progress = activeIndex >= 0 && items.length > 1 ? activeIndex / (items.length - 1) : 0;

  return (
    <nav aria-label="History tabs" className={styles.wrapper}>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          data-visible={active ? "true" : "false"}
          style={{ "--progress": progress } as React.CSSProperties}
        />
      </div>
      <ul className={styles.list}>
        {items.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                ref={(el) => {
                  if (buttonRef?.current) buttonRef.current[id] = el;
                }}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isActive}
                aria-controls={panelId}
                aria-label={label}
                onClick={() => onSelect(id)}
                className={cn(styles.item, isActive && styles.itemActive)}
              >
                <Icon className={styles.icon} />
                <span className="sr-only">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
