import type { AspectRatio } from "./types";

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];

export const IMAGE_COUNTS = [1, 2, 4, 6, 8] as const;

export const MODELS = [
  { id: "forge-v3", label: "Forge v3", short: "v3" },
  { id: "forge-turbo", label: "Forge Turbo", short: "Turbo" },
  { id: "forge-portrait", label: "Forge Portrait", short: "Portrait" },
  { id: "forge-cinema", label: "Forge Cinema", short: "Cinema" },
] as const;

export function dimensionsFor(ratio: AspectRatio, base = 768): { width: number; height: number } {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return { width: base, height: base };
  if (w >= h) {
    return { width: base, height: Math.round((base * h) / w) };
  }
  return { width: Math.round((base * w) / h), height: base };
}
