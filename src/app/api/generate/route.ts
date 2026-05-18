import { NextResponse } from "next/server";
import { dimensionsFor } from "@/lib/ratios";
import type {
  AspectRatio,
  GenerationMode,
  GenerationResponse,
  ScheduledItem,
} from "@/lib/types";

const SAMPLE_VIDEOS = [
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://picsum.photos/seed/bbb-poster/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://picsum.photos/seed/eled-poster/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://picsum.photos/seed/forge-blaze/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://picsum.photos/seed/forge-escape/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://picsum.photos/seed/forge-fun/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://picsum.photos/seed/forge-joy/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    poster: "https://picsum.photos/seed/forge-melt/960/540",
  },
  {
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://picsum.photos/seed/sintel/960/540",
  },
];

const MIN_DELAY_MS = 5000;
const MAX_DELAY_MS = 10000;

function seedFromPrompt(prompt: string, salt: number): string {
  const base = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32) || "forge";
  return `${base}-${salt}-${Date.now().toString(36)}`;
}

function clampCount(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(8, Math.round(n)));
}

function asRatio(value: unknown): AspectRatio {
  const allowed: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];
  return allowed.includes(value as AspectRatio) ? (value as AspectRatio) : "1:1";
}

function asMode(value: unknown): GenerationMode {
  return value === "video" ? "video" : "image";
}

function buildItem(
  prompt: string,
  mode: GenerationMode,
  ratio: AspectRatio,
  index: number,
): ScheduledItem {
  const { width, height } = dimensionsFor(ratio);
  const seed = seedFromPrompt(prompt, index + 1);
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  if (mode === "video") {
    const sample = SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length];
    return {
      id: `${seed}-video`,
      kind: "video",
      url: sample.url,
      poster: sample.poster,
      width: 16,
      height: 9,
      alt: `${prompt} — generated video ${index + 1}`,
      delay,
    };
  }
  return {
    id: `${seed}-image`,
    kind: "image",
    url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`,
    width,
    height,
    alt: `${prompt} — generated image ${index + 1}`,
    delay,
  };
}

export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    // Malformed body — fall through to defaults below.
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  const mode = asMode(payload.mode);
  const count = clampCount(payload.count, 4);
  const ratio = asRatio(payload.ratio);
  const model = typeof payload.model === "string" && payload.model ? payload.model : "forge-v3";

  if (!prompt) {
    return NextResponse.json(
      { error: "A prompt is required to generate content." },
      { status: 400 },
    );
  }

  const items = Array.from({ length: count }, (_, index) =>
    buildItem(prompt, mode, ratio, index),
  );

  const response: GenerationResponse = {
    id: `gen-${Date.now()}`,
    prompt,
    model,
    ratio,
    mode,
    items,
  };

  return NextResponse.json(response);
}

export async function GET() {
  return NextResponse.json(
    { error: "POST a prompt to /api/generate." },
    { status: 405 },
  );
}
