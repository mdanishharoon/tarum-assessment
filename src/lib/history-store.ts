import type { AspectRatio, GenerationMode } from "./types";

export type HistoryEntry = {
  id: string;
  prompt: string;
  model: string;
  ratio: AspectRatio;
  mode: GenerationMode;
  thumbnailUrl: string;
  createdAt: number;
};

const STORAGE_KEY = "forge.history.v1";
const MAX_ENTRIES = 8;

type Listener = (entries: HistoryEntry[]) => void;
const listeners = new Set<Listener>();

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(): unknown {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isValidEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.prompt === "string" &&
    typeof entry.model === "string" &&
    typeof entry.ratio === "string" &&
    typeof entry.mode === "string" &&
    typeof entry.thumbnailUrl === "string" &&
    typeof entry.createdAt === "number"
  );
}

export function loadHistory(): HistoryEntry[] {
  const raw = readRaw();
  if (!Array.isArray(raw)) return [];
  return raw.filter(isValidEntry).slice(0, MAX_ENTRIES);
}

function notify(entries: HistoryEntry[]): void {
  for (const listener of listeners) listener(entries);
}

export function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  if (!hasStorage()) return [];
  const current = loadHistory().filter((existing) => existing.id !== entry.id);
  const next = [entry, ...current].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-mode failures fall through silently. Listeners still fire with the
    // in-memory next list so the UI reflects the attempted change.
  }
  notify(next);
  return next;
}

export function subscribeToHistory(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
