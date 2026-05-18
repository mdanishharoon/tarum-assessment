"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { HistoryStrip } from "@/components/HistoryStrip";
import {
  PromptPanel,
  type PromptPanelHandle,
} from "@/components/PromptPanel";
import { ResultsCanvas, type CanvasCell } from "@/components/ResultsCanvas";
import { MODELS } from "@/lib/ratios";
import { pushHistory, type HistoryEntry } from "@/lib/history-store";
import type {
  AspectRatio,
  GenerationItem,
  GenerationMode,
  GenerationRequest,
  GenerationResponse,
} from "@/lib/types";
import styles from "./page.module.css";

type CanvasState = {
  generationId: string;
  prompt: string;
  model: string;
  modelLabel: string;
  ratio: AspectRatio;
  mode: GenerationMode;
  cells: CanvasCell[];
  justCompleted: boolean;
};

const COMPLETION_PULSE_MS = 900;

function labelForModel(id: string): string {
  return MODELS.find((model) => model.id === id)?.label || "Model";
}

function thumbnailFor(item: GenerationItem): string {
  return item.kind === "video" ? item.poster ?? item.url : item.url;
}

function isCanvasLoading(canvas: CanvasState): boolean {
  return canvas.cells.some(
    (cell) => cell.state === "submitting" || cell.state === "pending",
  );
}

export default function Home() {
  const [canvases, setCanvases] = useState<CanvasState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const completionTimersRef = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());
  const controllersRef = useRef<Set<AbortController>>(new Set());
  const promptPanelRef = useRef<PromptPanelHandle>(null);
  const historyPushedRef = useRef<Set<string>>(new Set());
  const scrollTargetRef = useRef<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timers = timersRef.current;
    const completionTimers = completionTimersRef.current;
    const controllers = controllersRef.current;
    return () => {
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      for (const timer of completionTimers.values()) clearTimeout(timer);
      completionTimers.clear();
      for (const controller of controllers) controller.abort();
      controllers.clear();
    };
  }, []);

  useEffect(() => {
    const target = scrollTargetRef.current;
    if (!target) return;
    scrollTargetRef.current = null;
    requestAnimationFrame(() => {
      const el = document.getElementById(`generation-${target}`);
      const container = resultsRef.current;
      if (!el) return;
      if (container && container.scrollHeight > container.clientHeight) {
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const top = elRect.top - containerRect.top + container.scrollTop - 12;
        container.scrollTo({ top, behavior: "smooth" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [canvases.length]);

  async function handleGenerate(request: GenerationRequest) {
    setError(null);

    const generationId = `gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const submittedAt = Date.now();
    const submittingCells: CanvasCell[] = Array.from(
      { length: request.count },
      (_, index) => ({
        state: "submitting",
        index,
        placeholderId: `${generationId}-${index}`,
        kind: request.mode,
        startedAt: submittedAt,
      }),
    );

    const newCanvas: CanvasState = {
      generationId,
      prompt: request.prompt,
      model: request.model,
      modelLabel: labelForModel(request.model),
      ratio: request.ratio,
      mode: request.mode,
      cells: submittingCells,
      justCompleted: false,
    };

    scrollTargetRef.current = generationId;
    setCanvases((prev) => [...prev, newCanvas]);

    const controller = new AbortController();
    controllersRef.current.add(controller);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(payload.error || "Generation failed. Try again.");
      }
      const data = (await response.json()) as GenerationResponse;
      const startedAt = Date.now();
      const initialCells: CanvasCell[] = data.items.map((item) => ({
        state: "pending",
        item,
        startedAt,
      }));

      setCanvases((prev) =>
        prev.map((entry) =>
          entry.generationId === generationId
            ? {
                ...entry,
                prompt: data.prompt,
                model: data.model,
                modelLabel: labelForModel(data.model),
                ratio: data.ratio,
                mode: data.mode,
                cells: initialCells,
              }
            : entry,
        ),
      );

      data.items.forEach((item, index) => {
        const timer = setTimeout(() => {
          timersRef.current.delete(timer);
          setCanvases((prev) => {
            const idx = prev.findIndex(
              (entry) => entry.generationId === generationId,
            );
            if (idx === -1) return prev;
            const target = prev[idx];
            const nextCells = target.cells.slice();
            nextCells[index] = { state: "done", item };
            const allDone = nextCells.every((cell) => cell.state === "done");

            if (
              !historyPushedRef.current.has(generationId) &&
              nextCells.some((cell) => cell.state === "done")
            ) {
              historyPushedRef.current.add(generationId);
              const firstDone = nextCells.find(
                (cell): cell is Extract<CanvasCell, { state: "done" }> =>
                  cell.state === "done",
              );
              if (firstDone) {
                const entry: HistoryEntry = {
                  id: generationId,
                  prompt: target.prompt,
                  model: target.model,
                  ratio: target.ratio,
                  mode: target.mode,
                  thumbnailUrl: thumbnailFor(firstDone.item),
                  createdAt: Date.now(),
                };
                pushHistory(entry);
              }
            }

            let nextEntry: CanvasState = { ...target, cells: nextCells };

            if (allDone) {
              nextEntry = { ...nextEntry, justCompleted: true };
              const existingPulse = completionTimersRef.current.get(generationId);
              if (existingPulse) clearTimeout(existingPulse);
              const pulseTimer = setTimeout(() => {
                completionTimersRef.current.delete(generationId);
                setCanvases((curr) =>
                  curr.map((c) =>
                    c.generationId === generationId
                      ? { ...c, justCompleted: false }
                      : c,
                  ),
                );
              }, COMPLETION_PULSE_MS);
              completionTimersRef.current.set(generationId, pulseTimer);
            }

            const updated = prev.slice();
            updated[idx] = nextEntry;
            return updated;
          });
        }, item.delay);
        timersRef.current.add(timer);
      });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        return;
      }
      if (controller.signal.aborted) {
        return;
      }
      setError(cause instanceof Error ? cause.message : "Generation failed. Try again.");
      setCanvases((prev) =>
        prev.filter((entry) => entry.generationId !== generationId),
      );
    } finally {
      controllersRef.current.delete(controller);
    }
  }

  const handlePickHistory = useCallback((entry: HistoryEntry) => {
    promptPanelRef.current?.applyPreset({
      prompt: entry.prompt,
      mode: entry.mode,
      ratio: entry.ratio,
      model: entry.model,
    });
    if (typeof document !== "undefined") {
      const textarea = document.getElementById("forge-prompt");
      if (textarea instanceof HTMLTextAreaElement) textarea.focus();
    }
  }, []);

  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <HistoryStrip onPick={handlePickHistory} />
        <div className={styles.workspace}>
          <aside className={styles.sidebar}>
            <PromptPanel
              ref={promptPanelRef}
              onGenerate={handleGenerate}
            />
          </aside>
          <section
            ref={resultsRef}
            className={styles.results}
            aria-label="Generation results"
          >
            {error ? (
              <div role="alert" className={styles.error}>
                {error}
              </div>
            ) : null}
            {canvases.length === 0 ? (
              <EmptyState />
            ) : (
              canvases.map((canvas) => (
                <div
                  key={canvas.generationId}
                  id={`generation-${canvas.generationId}`}
                  className={styles.generationSlot}
                >
                  <ResultsCanvas
                    cells={canvas.cells}
                    generationId={canvas.generationId}
                    prompt={canvas.prompt}
                    modelLabel={canvas.modelLabel}
                    isLoading={isCanvasLoading(canvas)}
                    justCompleted={canvas.justCompleted}
                  />
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
