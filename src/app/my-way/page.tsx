"use client";

import { useCallback, useEffect, useState } from "react";
import { Canvas } from "@/components/my-way/Canvas";
import { CommandMenu } from "@/components/my-way/CommandMenu";
import { Header } from "@/components/my-way/Header";
import type { ImageAction } from "@/components/my-way/ImageActionBar";
import {
  type FocusedImage,
  PromptBar,
  type SubmitPayload,
} from "@/components/my-way/PromptBar";
import { Sidebar, type SidebarTool } from "@/components/my-way/Sidebar";
import { addTurn, loadTurns, subscribeTurns, updateVariant } from "@/lib/my-way/store";
import type {
  MwImageVariant,
  MwMode,
  MwTurn,
  MwTurnKind,
  MwVariant,
  MwVideoVariant,
} from "@/lib/my-way/types";
import type { GenerationResponse, ScheduledItem } from "@/lib/types";
import styles from "./page.module.css";

function variantFromItem(item: ScheduledItem): MwVariant {
  if (item.kind === "video") {
    const v: MwVideoVariant = {
      id: item.id,
      kind: "video",
      status: "pending",
      url: item.url,
      poster: item.poster ?? "",
      width: item.width,
      height: item.height,
      alt: item.alt,
      startedAt: Date.now(),
      delay: item.delay,
    };
    return v;
  }
  const v: MwImageVariant = {
    id: item.id,
    kind: "image",
    status: "pending",
    url: item.url,
    width: item.width,
    height: item.height,
    alt: item.alt,
    startedAt: Date.now(),
    delay: item.delay,
  };
  return v;
}

function findVariant(turns: MwTurn[], turnId: string, variantId: string) {
  const turn = turns.find((t) => t.id === turnId);
  if (!turn) return null;
  const variant = turn.variants.find((v) => v.id === variantId);
  return variant ?? null;
}

export default function MyWayPage() {
  const [turns, setTurns] = useState<MwTurn[]>([]);
  const [focused, setFocused] = useState<FocusedImage>(null);
  const [activeTool, setActiveTool] = useState<SidebarTool>("image");
  const [commanderOpen, setCommanderOpen] = useState(false);

  useEffect(() => {
    setTurns(loadTurns());
    const unsub = subscribeTurns(setTurns);
    return unsub;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log(
      "%c FORGE %c sparks fly when you generate. %c⚡",
      "background:#c7ff69;color:#141414;font-weight:700;padding:4px 10px;border-radius:6px;font-family:'Bebas Neue',sans-serif;letter-spacing:0.06em;",
      "color:#fdf9f0;padding:4px 6px;font-weight:500;",
      "color:#c7ff69;font-size:14px;",
    );
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommanderOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = useCallback(async (payload: SubmitPayload) => {
    const turnKind: MwTurnKind = (() => {
      if (!payload.focusedImage) return "generate";
      switch (payload.focusedImage.intent) {
        case "edit":
          return "edit";
        case "animate":
          return "animate";
        case "context":
          return "vary";
      }
    })();

    const apiMode: "image" | "video" =
      payload.mode === "video" ? "video" : "image";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: payload.prompt,
          mode: apiMode,
          count: payload.mode === "inpaint" ? 1 : payload.variants,
          ratio: payload.ratio,
          model: payload.model,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = (await response.json()) as GenerationResponse;

      const startedAt = Date.now();
      const variants: MwVariant[] = data.items.map((item) =>
        variantFromItem({ ...item, delay: item.delay }),
      );

      const newTurn: MwTurn = {
        id: data.id,
        kind: turnKind,
        prompt: payload.prompt,
        mode: payload.mode,
        model: payload.model,
        ratio: payload.ratio,
        duration: payload.duration,
        motion: payload.motion,
        variants,
        refs: payload.refs,
        createdAt: startedAt,
        sourceVariantId: payload.focusedImage?.variantId,
      };

      addTurn(newTurn);

      // Schedule each variant flipping to ready
      for (const item of data.items) {
        const target = item.delay;
        window.setTimeout(() => {
          updateVariant(newTurn.id, item.id, {
            status: "ready",
            readyAt: Date.now(),
          } as Partial<MwVariant>);
        }, target);
      }

      // Clear focus after submission unless intent was "context" (then it persists is fine to drop too)
      setFocused(null);
    } catch (error) {
      console.error("Generation failed", error);
    }
  }, []);

  const handleAction = useCallback(
    (turnId: string, variantId: string, action: ImageAction) => {
      const variant = findVariant(turns, turnId, variantId);
      if (!variant || variant.status !== "ready") return;

      const sourceTurn = turns.find((t) => t.id === turnId);
      const prompt = sourceTurn?.prompt ?? "";

      switch (action) {
        case "edit":
          setFocused({
            variantId: variant.id,
            url: variant.kind === "image" ? variant.url : variant.poster,
            prompt,
            intent: "edit",
          });
          break;
        case "animate":
          setFocused({
            variantId: variant.id,
            url: variant.kind === "image" ? variant.url : variant.poster,
            prompt,
            intent: "animate",
          });
          break;
        case "ref":
          setFocused({
            variantId: variant.id,
            url: variant.kind === "image" ? variant.url : variant.poster,
            prompt,
            intent: "context",
          });
          break;
        case "vary": {
          // Re-submit silently using the same prompt with a "vary" intent
          if (!sourceTurn) return;
          void handleSubmit({
            prompt,
            mode: sourceTurn.mode,
            model: sourceTurn.model,
            ratio: sourceTurn.ratio,
            variants: (sourceTurn.variants.length as 1 | 2 | 4) ?? 2,
            duration: sourceTurn.duration,
            motion: sourceTurn.motion,
            refs: [],
            focusedImage: {
              variantId: variant.id,
              url: variant.kind === "image" ? variant.url : variant.poster,
              prompt,
              intent: "context",
            },
            firstFrame: null,
            lastFrame: null,
          });
          break;
        }
        case "revise":
          setFocused({
            variantId: variant.id,
            url: variant.kind === "image" ? variant.url : variant.poster,
            prompt,
            intent: "context",
          });
          break;
      }
    },
    [turns, handleSubmit],
  );

  const handleRetry = useCallback(
    (turnId: string, variantId: string) => {
      updateVariant(turnId, variantId, { status: "pending" } as Partial<MwVariant>);
      // Pretend retry succeeds after a short delay
      window.setTimeout(() => {
        updateVariant(turnId, variantId, {
          status: "ready",
          readyAt: Date.now(),
        } as Partial<MwVariant>);
      }, 2400);
    },
    [],
  );

  const handleSuggest = useCallback((prompt: string) => {
    // Pre-fill the prompt by triggering submit through the bar.
    // The bar manages its own prompt state, so we just submit directly.
    void handleSubmit({
      prompt,
      mode: "image" as MwMode,
      model: "flux-1-1-pro",
      ratio: "16:9",
      variants: 2,
      refs: [],
      focusedImage: null,
      firstFrame: null,
      lastFrame: null,
    });
  }, [handleSubmit]);

  return (
    <div className={styles.page}>
      <div className={styles.decoration} aria-hidden>
        <span className={`${styles.decorationBlob} ${styles.decorationBlobA}`} />
        <span className={`${styles.decorationBlob} ${styles.decorationBlobB}`} />
      </div>

      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />

      <div className={styles.main}>
        <Header onOpenCommander={() => setCommanderOpen(true)} />
        <main className={styles.body}>
          <Canvas
            turns={turns}
            focusedVariantId={focused?.variantId ?? null}
            onAction={handleAction}
            onRetry={handleRetry}
            onSuggest={handleSuggest}
          />
          <div className={styles.bottomFade} aria-hidden />
          <PromptBar
            focusedImage={focused}
            onClearFocus={() => setFocused(null)}
            onSubmit={handleSubmit}
            hasTurns={turns.length > 0}
          />
        </main>

        <CommandMenu open={commanderOpen} onClose={() => setCommanderOpen(false)} />
      </div>
    </div>
  );
}
