import type { MwTurn, MwVariant } from "./types";

const STORAGE_KEY = "my-way:v1";
const MAX_TURNS = 80;

type Listener = (turns: MwTurn[]) => void;
const listeners = new Set<Listener>();

let memory: MwTurn[] | null = null;

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPersisted(): MwTurn[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is MwTurn => {
      if (!entry || typeof entry !== "object") return false;
      const t = entry as Record<string, unknown>;
      return (
        typeof t.id === "string" &&
        typeof t.prompt === "string" &&
        Array.isArray(t.variants) &&
        typeof t.createdAt === "number"
      );
    });
  } catch {
    return [];
  }
}

function persist(turns: MwTurn[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(turns));
  } catch {
    // Quota / private mode — ignore, listeners still fire below.
  }
}

function notify(turns: MwTurn[]): void {
  for (const listener of listeners) listener(turns);
}

export function loadTurns(): MwTurn[] {
  if (memory) return memory;
  memory = readPersisted();
  return memory;
}

export function subscribeTurns(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addTurn(turn: MwTurn): MwTurn[] {
  const current = loadTurns();
  const next = [...current, turn].slice(-MAX_TURNS);
  memory = next;
  persist(next);
  notify(next);
  return next;
}

export function updateVariant(
  turnId: string,
  variantId: string,
  patch: Partial<MwVariant>,
): MwTurn[] {
  const current = loadTurns();
  let changed = false;
  const next = current.map((turn) => {
    if (turn.id !== turnId) return turn;
    const variants = turn.variants.map((variant) => {
      if (variant.id !== variantId) return variant;
      changed = true;
      return { ...variant, ...patch } as MwVariant;
    });
    return { ...turn, variants };
  });
  if (!changed) return current;
  memory = next;
  persist(next);
  notify(next);
  return next;
}

export function removeTurn(turnId: string): MwTurn[] {
  const current = loadTurns();
  const next = current.filter((turn) => turn.id !== turnId);
  if (next.length === current.length) return current;
  memory = next;
  persist(next);
  notify(next);
  return next;
}

export function clearTurns(): void {
  memory = [];
  persist([]);
  notify([]);
}
