"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  FolderIcon,
  HomeIcon,
  ImageIcon,
  VideoIcon,
  WandIcon,
} from "./Icons";
import styles from "./IconNav.module.css";

const items = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "images", label: "Images", Icon: ImageIcon },
  { id: "videos", label: "Videos", Icon: VideoIcon },
  { id: "enhance", label: "Enhance", Icon: WandIcon },
  { id: "library", label: "Library", Icon: FolderIcon },
] as const;

export function IconNav() {
  const [active, setActive] = useState<(typeof items)[number]["id"]>("home");
  const activeIndex = items.findIndex((item) => item.id === active);

  return (
    <nav aria-label="Workspace sections" className={styles.wrapper}>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ left: `calc(${(activeIndex / (items.length - 1)) * 100}% - 1.25rem)` }}
        />
      </div>
      <ul className={styles.list} role="tablist">
        {items.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={label}
                onClick={() => setActive(id)}
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
