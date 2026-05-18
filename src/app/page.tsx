"use client";

import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { HistoryStrip } from "@/components/HistoryStrip";
import { PromptPanel } from "@/components/PromptPanel";
import { ResultsCanvas, type CanvasCell } from "@/components/ResultsCanvas";
import { MODELS } from "@/lib/ratios";
import type { GenerationRequest, GenerationResponse } from "@/lib/types";
import styles from "./page.module.css";

type CanvasState = {
  prompt: string;
  modelLabel: string;
  cells: CanvasCell[];
};

function labelForModel(id: string): string {
  return MODELS.find((model) => model.id === id)?.label || "Model";
}

export default function Home() {
  const [canvas, setCanvas] = useState<CanvasState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current) clearTimeout(timer);
    };
  }, []);

  function clearScheduled() {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
  }

  const isGenerating = canvas?.cells.some((cell) => cell.state === "pending") ?? false;

  async function handleGenerate(request: GenerationRequest) {
    setError(null);
    clearScheduled();
    setCanvas({
      prompt: request.prompt,
      modelLabel: labelForModel(request.model),
      cells: [],
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Generation failed. Try again.");
      }
      const data = (await response.json()) as GenerationResponse;
      const startedAt = Date.now();
      const initialCells: CanvasCell[] = data.items.map((item) => ({
        state: "pending",
        item,
        startedAt,
      }));
      setCanvas({
        prompt: data.prompt,
        modelLabel: labelForModel(data.model),
        cells: initialCells,
      });

      data.items.forEach((item, index) => {
        const timer = setTimeout(() => {
          setCanvas((prev) => {
            if (!prev) return prev;
            const next = prev.cells.slice();
            next[index] = { state: "done", item };
            return { ...prev, cells: next };
          });
        }, item.delay);
        timersRef.current.push(timer);
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Generation failed. Try again.");
      setCanvas(null);
    }
  }

  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <HistoryStrip />
        <div className={styles.workspace}>
          <aside className={styles.sidebar}>
            <PromptPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
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
                prompt={canvas.prompt}
                modelLabel={canvas.modelLabel}
                isLoading={isGenerating}
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
