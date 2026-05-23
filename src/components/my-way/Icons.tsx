import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  width: 16,
  height: 16,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function IconArrowReturn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function IconImage(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function IconVideo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

export function IconBrush(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.06 11.9 8 13l-4 4 4 4 4-4 1.1-1.06" />
      <path d="m20.8 4.94-7.07 7.07a1 1 0 0 0 0 1.41l1.41 1.41a1 1 0 0 0 1.41 0l7.07-7.07-2.82-2.82Z" />
    </svg>
  );
}

export function IconLibrary(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 14 9l7 2-7 2-2 9-2-9-7-2 7-2 2-7z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15A9 9 0 1 1 19.42 5.93" />
    </svg>
  );
}

export function IconMagic(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 20 11.5-11.5" />
      <path d="m17.5 6.5 2-2 2 2-2 2-2-2z" fill="currentColor" />
      <path d="M3 8h2M9 3v2M9 13v2M3 18h2" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function IconUndo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15A9 9 0 1 0 6 5.3L1 10" />
    </svg>
  );
}

export function IconRevise(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v4l4 4-4 4v4l-8-8 8-8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 11 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function IconSidebarToggle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
      <path d="M5.5 9h1.5M5.5 12h1.5M5.5 15h1.5" />
    </svg>
  );
}

export function IconUpscale(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="14 4 20 4 20 10" />
      <polyline points="10 20 4 20 4 14" />
      <line x1="20" y1="4" x2="13" y2="11" />
      <line x1="4" y1="20" x2="11" y2="13" />
    </svg>
  );
}

export function IconCommunity(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="9" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M14.5 20a4.5 4.5 0 0 1 7-3.75" />
    </svg>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.5c0 1.5-2.4 2-2.4 3.5" />
      <line x1="12" y1="17" x2="12" y2="17.5" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconKeyboard(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="10" x2="6" y2="10" />
      <line x1="10" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="14" y2="10" />
      <line x1="18" y1="10" x2="18" y2="10" />
      <line x1="7" y1="14" x2="17" y2="14" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

export function IconBrandMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="none"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="2"
        y="7"
        width="21"
        height="21"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <rect x="9" y="2" width="21" height="21" rx="5" fill="currentColor" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 4H5a1 1 0 0 0-1 1v11" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

export function IconMore(props: IconProps) {
  return (
    <svg {...base} {...props} strokeWidth={0} fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconChip(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <line x1="6" y1="9" x2="4" y2="9" />
      <line x1="6" y1="12" x2="4" y2="12" />
      <line x1="6" y1="15" x2="4" y2="15" />
      <line x1="18" y1="9" x2="20" y2="9" />
      <line x1="18" y1="12" x2="20" y2="12" />
      <line x1="18" y1="15" x2="20" y2="15" />
      <line x1="9" y1="6" x2="9" y2="4" />
      <line x1="12" y1="6" x2="12" y2="4" />
      <line x1="15" y1="6" x2="15" y2="4" />
      <line x1="9" y1="18" x2="9" y2="20" />
      <line x1="12" y1="18" x2="12" y2="20" />
      <line x1="15" y1="18" x2="15" y2="20" />
    </svg>
  );
}

export function IconAspect(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
    </svg>
  );
}

export function IconSliders(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="14" cy="7" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="2.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
