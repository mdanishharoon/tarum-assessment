import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9.5a.5.5 0 0 0 .5.5h4V14h5v6h4a.5.5 0 0 0 .5-.5V10" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m3.5 17 4.5-4.5 4 4 3.5-3 5 5" />
    </svg>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="13" height="12" rx="2.5" />
      <path d="m16 10 5-3v10l-5-3z" />
    </svg>
  );
}

export function WandIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m14 6 4 4-9 9-4 1 1-4z" />
      <path d="M19 3v3M22 4.5h-3M17 9v2M18 10h-2" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2.5h7.5A1.5 1.5 0 0 1 21 9v8.5A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
    </svg>
  );
}

export function GalleryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M4 17c2-3 5-3 8 0s6 1 8-1" />
      <circle cx="9" cy="9" r="1.5" />
    </svg>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2h-1v-6h1a8 8 0 0 0-15 0v6H3a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M19 4v3M20.5 5.5h-3M5 17v2M6 18H4" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function StackIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2.5" />
      <rect x="7.5" y="7.5" width="13" height="13" rx="2.5" />
    </svg>
  );
}

export function ModelIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 L21 12 L12 21 L3 12 Z" />
      <path d="M7.5 12 L12 7.5 L16.5 12 L12 16.5 Z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M7 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 7 5.5" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h3l4-3.5v12l-4-3.5H4z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </svg>
  );
}

export function MuteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h3l4-3.5v12l-4-3.5H4z" />
      <path d="M16 9.5l4 5M20 9.5l-4 5" />
    </svg>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
    </svg>
  );
}
