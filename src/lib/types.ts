export type GenerationMode = "image" | "video";

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9";

export type GenerationItem = {
  id: string;
  kind: GenerationMode;
  url: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
};

export type ScheduledItem = GenerationItem & {
  delay: number;
};

export type GenerationRequest = {
  prompt: string;
  mode: GenerationMode;
  count: number;
  ratio: AspectRatio;
  model: string;
};

export type GenerationResponse = {
  id: string;
  prompt: string;
  model: string;
  ratio: AspectRatio;
  mode: GenerationMode;
  items: ScheduledItem[];
};
