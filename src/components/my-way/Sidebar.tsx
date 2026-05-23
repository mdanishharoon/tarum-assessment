"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
  IconBrandMark,
  IconBrush,
  IconCommunity,
  IconHome,
  IconImage,
  IconLibrary,
  IconMagic,
  IconSidebarToggle,
  IconSparkle,
  IconUpscale,
  IconVideo,
} from "./Icons";
import styles from "./Sidebar.module.css";

export type SidebarTool =
  | "image"
  | "video"
  | "edit"
  | "upscale"
  | "animate";

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => ReactNode;

type PrimaryItem = {
  key: string;
  label: string;
  Icon: IconComponent;
  kbd?: string;
};

type ToolDef = {
  key: SidebarTool;
  label: string;
  Icon: IconComponent;
  accent: string;
};

const PRIMARY: PrimaryItem[] = [
  { key: "home", label: "Home", Icon: IconHome, kbd: "H" },
  { key: "library", label: "Library", Icon: IconLibrary, kbd: "L" },
];

const TOOLS: ToolDef[] = [
  { key: "image", label: "Image", Icon: IconImage, accent: "var(--mw-amethyst)" },
  { key: "video", label: "Video", Icon: IconVideo, accent: "var(--mw-emerald)" },
  { key: "edit", label: "Edit", Icon: IconBrush, accent: "var(--mw-sunset)" },
  { key: "upscale", label: "Upscale", Icon: IconUpscale, accent: "var(--mw-sky)" },
  { key: "animate", label: "Animate", Icon: IconMagic, accent: "var(--mw-gold)" },
];

const SECONDARY: PrimaryItem[] = [
  { key: "community", label: "Community", Icon: IconCommunity },
  { key: "sparks", label: "Sparks", Icon: IconSparkle },
];

type Props = {
  activeTool: SidebarTool;
  onSelectTool: (next: SidebarTool) => void;
};

export function Sidebar({ activeTool, onSelectTool }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    setCollapsed((prev) => !prev);
  }

  return (
    <aside
      className={styles.sidebar}
      data-collapsed={collapsed}
      aria-label="Workspace navigation"
    >
      <div className={styles.brand}>
        <Link href="/my-way" className={styles.brandLink} aria-label="Tarum home">
          <span className={styles.brandMark} aria-hidden>
            <IconBrandMark />
          </span>
          <span className={styles.brandTag} aria-hidden>
            Tarum
          </span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          {PRIMARY.map(({ key, label, Icon, kbd }) => (
            <li key={key}>
              <button type="button" className={styles.item}>
                <span className={styles.iconWrap}>
                  <Icon />
                </span>
                <span className={styles.label}>{label}</span>
                {kbd && (
                  <span className={styles.kbd} aria-hidden>
                    {kbd}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.section}>
          <span className={styles.sectionLabel} aria-hidden>
            Tools
          </span>
          <ul className={styles.list}>
            {TOOLS.map(({ key, label, Icon, accent }) => {
              const active = key === activeTool;
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={styles.tool}
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                    onClick={() => onSelectTool(key)}
                    title={label}
                  >
                    <span className={styles.toolBadge} style={{ background: accent }}>
                      <Icon />
                    </span>
                    <span className={styles.label}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel} aria-hidden>
            More
          </span>
          <ul className={styles.list}>
            {SECONDARY.map(({ key, label, Icon }) => (
              <li key={key}>
                <button type="button" className={styles.item}>
                  <span className={styles.iconWrap}>
                    <Icon />
                  </span>
                  <span className={styles.label}>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.collapseToggle}
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconSidebarToggle />
        </button>
      </div>
    </aside>
  );
}
