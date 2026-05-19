import type { AspectRatio } from "./types";

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9"];

export const IMAGE_COUNTS = [1, 2, 4, 6, 8] as const;

export const MODELS = [
  { id: "flux-1-1-pro", label: "Flux 1.1 Pro", short: "Flux" },
  { id: "stable-diffusion-3-5", label: "Stable Diffusion 3.5", short: "SD 3.5" },
  { id: "dall-e-3", label: "DALL·E 3", short: "DALL·E" },
] as const;

export function dimensionsFor(ratio: AspectRatio, base = 768): { width: number; height: number } {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return { width: base, height: base };
  if (w >= h) {
    return { width: base, height: Math.round((base * h) / w) };
  }
  return { width: Math.round((base * w) / h), height: base };
}
