"use client";

import { type SVGProps, useEffect, useMemo, useRef, useState } from "react";
import {
  IconBrush,
  IconClock,
  IconCommunity,
  IconHelp,
  IconImage,
  IconKeyboard,
  IconLibrary,
  IconMagic,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconSparkle,
  IconUpscale,
  IconVideo,
} from "./Icons";
import styles from "./CommandMenu.module.css";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactNode;

type Item = {
  id: string;
  label: string;
  Icon: IconComponent;
  iconBg?: string;
  meta?: string;
  shortcut?: string[];
};

type Group = {
  id: string;
  label: string;
  items: Item[];
};

const GROUPS: Group[] = [
  {
    id: "actions",
    label: "Quick actions",
    items: [
      {
        id: "new-canvas",
        label: "Start a new canvas",
        Icon: IconSparkle,
        shortcut: ["⌘", "N"],
      },
      {
        id: "clear",
        label: "Clear all generations",
        Icon: IconRefresh,
        shortcut: ["⌘", "⇧", "⌫"],
      },
      {
        id: "recent",
        label: "Jump to last turn",
        Icon: IconClock,
        shortcut: ["G", "L"],
      },
    ],
  },
  {
    id: "mode",
    label: "Switch mode",
    items: [
      {
        id: "mode-image",
        label: "Image",
        Icon: IconImage,
        iconBg: "var(--mw-amethyst)",
        meta: "Mode",
      },
      {
        id: "mode-video",
        label: "Video",
        Icon: IconVideo,
        iconBg: "var(--mw-emerald)",
        meta: "Mode",
      },
      {
        id: "mode-edit",
        label: "Edit (inpaint)",
        Icon: IconBrush,
        iconBg: "var(--mw-sunset)",
        meta: "Mode",
      },
      {
        id: "mode-upscale",
        label: "Upscale",
        Icon: IconUpscale,
        iconBg: "var(--mw-sky)",
        meta: "Mode",
      },
      {
        id: "mode-animate",
        label: "Animate",
        Icon: IconMagic,
        iconBg: "var(--mw-gold)",
        meta: "Mode",
      },
    ],
  },
  {
    id: "model",
    label: "Switch model",
    items: [
      { id: "model-flux", label: "Flux 1.1 Pro", Icon: IconSparkle, meta: "Model" },
      {
        id: "model-sd35",
        label: "Stable Diffusion 3.5",
        Icon: IconSparkle,
        meta: "Model",
      },
      { id: "model-dalle", label: "DALL·E 3", Icon: IconSparkle, meta: "Model" },
    ],
  },
  {
    id: "ratio",
    label: "Aspect ratio",
    items: [
      { id: "ratio-1-1", label: "Square", Icon: IconImage, meta: "1:1" },
      { id: "ratio-4-3", label: "Landscape", Icon: IconImage, meta: "4:3" },
      { id: "ratio-3-4", label: "Portrait", Icon: IconImage, meta: "3:4" },
      { id: "ratio-16-9", label: "Cinema", Icon: IconImage, meta: "16:9" },
    ],
  },
  {
    id: "navigate",
    label: "Go to",
    items: [
      { id: "go-library", label: "Library", Icon: IconLibrary },
      { id: "go-community", label: "Community", Icon: IconCommunity },
      { id: "go-settings", label: "Settings", Icon: IconSettings },
      { id: "go-shortcuts", label: "Keyboard shortcuts", Icon: IconKeyboard },
      { id: "go-help", label: "Help & support", Icon: IconHelp },
    ],
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CommandMenu({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          (item.meta?.toLowerCase().includes(q) ?? false),
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const flatItems = useMemo(() => filtered.flatMap((group) => group.items), [filtered]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((prev) => Math.min(prev + 1, Math.max(flatItems.length - 1, 0)));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, flatItems.length]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.querySelector<HTMLElement>(`[data-active="true"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [active, open]);

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
    >
      <div
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <IconSearch />
          </span>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type to jump anywhere…"
            aria-label="Search commands"
          />
          <span className={styles.searchKbd} aria-hidden>
            esc
          </span>
        </div>

        <div className={styles.list} ref={listRef}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyTitle}>Nothing matches</span>
              <span>Try fewer words.</span>
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.id} className={styles.section}>
                <div className={styles.sectionLabel}>{group.label}</div>
                {group.items.map((item) => {
                  runningIndex++;
                  const isActive = runningIndex === active;
                  const indexCapture = runningIndex;
                  const Icon = item.Icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.item}
                      data-active={isActive}
                      onClick={onClose}
                      onMouseEnter={() => setActive(indexCapture)}
                    >
                      <span
                        className={styles.itemIcon}
                        data-tinted={Boolean(item.iconBg)}
                        style={item.iconBg ? { background: item.iconBg } : undefined}
                      >
                        <Icon />
                      </span>
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
                      {item.shortcut && (
                        <span className={styles.itemShortcut} aria-hidden>
                          {item.shortcut.map((key, index) => (
                            <span key={`${item.id}-key-${index}`}>{key}</span>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <span className={styles.footerKbd}>↑</span>
            <span className={styles.footerKbd}>↓</span>
            navigate
          </span>
          <span className={styles.footerHint}>
            <span className={styles.footerKbd}>↵</span>
            select
          </span>
          <span className={styles.footerHint}>
            <span className={styles.footerKbd}>⎋</span>
            close
          </span>
          <span className={styles.footerBrand}>FORGE</span>
        </div>
      </div>
    </div>
  );
}
