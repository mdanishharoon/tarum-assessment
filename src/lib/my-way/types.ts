export type MwMode = "image" | "video" | "inpaint";

export type MwRatio = "1:1" | "4:3" | "3:4" | "16:9";

export type MwVariantCount = 1 | 2 | 4;

export type MwDuration = 4 | 6 | 8;

export type MwMotion = "still" | "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "orbit";

export type MwVariantStatus = "pending" | "ready" | "error";

export type MwImageVariant = {
  id: string;
  kind: "image";
  status: MwVariantStatus;
  url: string;
  width: number;
  height: number;
  alt: string;
  startedAt: number;
  readyAt?: number;
  /** Server-reported delay, used to drive deterministic loading progress. */
  delay: number;
};

export type MwVideoVariant = {
  id: string;
  kind: "video";
  status: MwVariantStatus;
  url: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
  startedAt: number;
  readyAt?: number;
  delay: number;
};

export type MwVariant = MwImageVariant | MwVideoVariant;

export type MwRef = {
  id: string;
  url: string;
  label?: string;
};

export type MwTurnKind = "generate" | "edit" | "vary" | "animate";

export type MwTurn = {
  id: string;
  kind: MwTurnKind;
  prompt: string;
  mode: MwMode;
  model: string;
  ratio: MwRatio;
  duration?: MwDuration;
  motion?: MwMotion;
  variants: MwVariant[];
  refs: MwRef[];
  /** When this turn was created (used to sort). */
  createdAt: number;
  /** Optional source variant id when this turn was forked from a past image. */
  sourceVariantId?: string;
};
