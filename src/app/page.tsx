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
};

const COMPLETION_PULSE_MS = 900;

function labelForModel(id: string): string {
  return MODELS.find((model) => model.id === id)?.label || "Model";
}

function thumbnailFor(item: GenerationItem): string {
  return item.kind === "video" ? item.poster ?? item.url : item.url;
}

export default function Home() {
  const [canvas, setCanvas] = useState<CanvasState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptPanelRef = useRef<PromptPanelHandle>(null);
  const historyPushedRef = useRef<Set<string>>(new Set());
  const activeRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current) clearTimeout(timer);
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
      activeRequestRef.current?.abort();
    };
  }, []);

  function clearScheduled() {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
  }

  const isGenerating =
    canvas?.cells.some(
      (cell) => cell.state === "submitting" || cell.state === "pending",
    ) ?? false;

  async function handleGenerate(request: GenerationRequest) {
    setError(null);
    setJustCompleted(false);
    clearScheduled();

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

    setCanvas({
      generationId,
      prompt: request.prompt,
      model: request.model,
      modelLabel: labelForModel(request.model),
      ratio: request.ratio,
      mode: request.mode,
      cells: submittingCells,
    });

    const controller = new AbortController();
    activeRequestRef.current = controller;

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
      setCanvas((prev) => ({
        generationId: prev?.generationId ?? generationId,
        prompt: data.prompt,
        model: data.model,
        modelLabel: labelForModel(data.model),
        ratio: data.ratio,
        mode: data.mode,
        cells: initialCells,
      }));

      data.items.forEach((item, index) => {
        const timer = setTimeout(() => {
          setCanvas((prev) => {
            if (!prev) return prev;
            const next = prev.cells.slice();
            next[index] = { state: "done", item };
            const allDone = next.every((cell) => cell.state === "done");

            if (
              !historyPushedRef.current.has(prev.generationId) &&
              next.some((cell) => cell.state === "done")
            ) {
              historyPushedRef.current.add(prev.generationId);
              const firstDone = next.find(
                (cell): cell is Extract<CanvasCell, { state: "done" }> =>
                  cell.state === "done",
              );
              if (firstDone) {
                const entry: HistoryEntry = {
                  id: prev.generationId,
                  prompt: prev.prompt,
                  model: prev.model,
                  ratio: prev.ratio,
                  mode: prev.mode,
                  thumbnailUrl: thumbnailFor(firstDone.item),
                  createdAt: Date.now(),
                };
                pushHistory(entry);
              }
            }

            if (allDone) {
              setJustCompleted(true);
              if (completionTimerRef.current) {
                clearTimeout(completionTimerRef.current);
              }
              completionTimerRef.current = setTimeout(() => {
                setJustCompleted(false);
                completionTimerRef.current = null;
              }, COMPLETION_PULSE_MS);
            }

            return { ...prev, cells: next };
          });
        }, item.delay);
        timersRef.current.push(timer);
      });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        return;
      }
      if (controller.signal.aborted) {
        return;
      }
      setError(cause instanceof Error ? cause.message : "Generation failed. Try again.");
      setCanvas(null);
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
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
              isGenerating={isGenerating}
            />
          </aside>
          <section className={styles.results} aria-label="Generation results">
            {error ? (
              <div role="alert" className={styles.error}>
                {error}
              </div>
            ) : null}
            {canvas ? (
              <ResultsCanvas
                cells={canvas.cells}
                generationId={canvas.generationId}
                prompt={canvas.prompt}
                modelLabel={canvas.modelLabel}
                isLoading={isGenerating}
                justCompleted={justCompleted}
              />
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
