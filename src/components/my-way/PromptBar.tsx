"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Segmented } from "./Segmented";
import { SettingsPill } from "./SettingsPill";
import { VideoControls } from "./VideoControls";
import {
  IconArrowReturn,
  IconBrush,
  IconClose,
  IconImage,
  IconPlus,
  IconVideo,
} from "./Icons";
import styles from "./PromptBar.module.css";
import { MODELS } from "@/lib/ratios";
import type {
  MwDuration,
  MwMode,
  MwMotion,
  MwRatio,
  MwRef,
  MwVariantCount,
} from "@/lib/my-way/types";

export type FocusIntent = "edit" | "context" | "animate";

export type FocusedImage = {
  variantId: string;
  url: string;
  prompt: string;
  intent: FocusIntent;
} | null;

const PLACEHOLDERS = [
  "Describe what you want to make.",
  "Type. We'll do the rest.",
  "Pictures aren't going to make themselves.",
  "Sentence in, image out.",
];

const MODE_OPTIONS = [
  {
    value: "image" as MwMode,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <IconImage />
        Image
      </span>
    ),
    ariaLabel: "Image mode",
  },
  {
    value: "video" as MwMode,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <IconVideo />
        Video
      </span>
    ),
    ariaLabel: "Video mode",
  },
];

const VARIANT_OPTIONS = [
  { value: 1 as MwVariantCount, label: "1" },
  { value: 2 as MwVariantCount, label: "2" },
  { value: 4 as MwVariantCount, label: "4" },
];

export type SubmitPayload = {
  prompt: string;
  mode: MwMode;
  model: string;
  ratio: MwRatio;
  variants: MwVariantCount;
  duration?: MwDuration;
  motion?: MwMotion;
  refs: MwRef[];
  focusedImage: FocusedImage;
  firstFrame: string | null;
  lastFrame: string | null;
};

type Props = {
  focusedImage: FocusedImage;
  onClearFocus: () => void;
  onSubmit: (payload: SubmitPayload) => void;
  hasTurns: boolean;
};

export function PromptBar({ focusedImage, onClearFocus, onSubmit, hasTurns }: Props) {
  const formId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const attachInputRef = useRef<HTMLInputElement | null>(null);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<MwMode>("image");
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [ratio, setRatio] = useState<MwRatio>("16:9");
  const [variants, setVariants] = useState<MwVariantCount>(1);
  const [duration, setDuration] = useState<MwDuration>(6);
  const [motion, setMotion] = useState<MwMotion>("still");
  const [refs, setRefs] = useState<MwRef[]>([]);
  const [firstFrame, setFirstFrame] = useState<string | null>(null);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const barRef = useRef<HTMLFormElement | null>(null);
  const [hidden, setHidden] = useState(false);

  // Hide the dock on downward scroll, reveal on upward scroll. Phone only.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const scroller = document.querySelector<HTMLElement>("[data-mw-scroll]");
    if (!scroller) return;

    let lastY = scroller.scrollTop;
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      if (!mq.matches) {
        setHidden(false);
        return;
      }
      // Keep visible while the input is focused — typing reveals intent to engage.
      if (
        document.activeElement === textareaRef.current ||
        barRef.current?.contains(document.activeElement)
      ) {
        setHidden(false);
        return;
      }
      const y = scroller.scrollTop;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) < 6) return;
      if (y < 80) {
        setHidden(false);
      } else if (delta > 0) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(measure);
    };
    const onMqChange = () => {
      if (!mq.matches) setHidden(false);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onMqChange);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMqChange);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Inpaint mode is implicit: triggered when focusedImage came from an Edit action.
  const inpaintActive = focusedImage?.intent === "edit";
  const effectiveMode: MwMode = inpaintActive ? "inpaint" : mode;

  const placeholder = useMemo(() => {
    if (effectiveMode === "inpaint") return "What should go there?";
    if (effectiveMode === "video") return "Describe the motion or scene.";
    return PLACEHOLDERS[0];
  }, [effectiveMode]);

  // Auto-grow textarea
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [prompt]);

  const submit = useCallback(
    (event?: FormEvent) => {
      event?.preventDefault();
      const trimmed = prompt.trim();
      if (!trimmed) {
        const bar = barRef.current;
        if (bar) {
          bar.classList.remove("is-shaking");
          void bar.offsetWidth;
          bar.classList.add("is-shaking");
          window.setTimeout(() => {
            bar.classList.remove("is-shaking");
          }, 320);
        }
        return;
      }
      onSubmit({
        prompt: trimmed,
        mode: effectiveMode,
        model,
        ratio,
        variants,
        duration: effectiveMode === "video" ? duration : undefined,
        motion: effectiveMode === "video" ? motion : undefined,
        refs,
        focusedImage,
        firstFrame,
        lastFrame,
      });
      setPrompt("");
      setRefs([]);
      setFirstFrame(null);
      setLastFrame(null);
      if (inpaintActive) onClearFocus();
    },
    [
      prompt,
      effectiveMode,
      model,
      ratio,
      variants,
      duration,
      motion,
      refs,
      focusedImage,
      firstFrame,
      lastFrame,
      inpaintActive,
      onClearFocus,
      onSubmit,
    ],
  );

  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
    if (event.key === "Escape" && focusedImage) {
      event.preventDefault();
      onClearFocus();
    }
  }

  function handleAttach(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRefs((prev) => [...prev, { id: `ref-${Date.now()}`, url, label: file.name }]);
  }

  return (
    <div className={styles.dock} data-hidden={hidden}>
      <div className={styles.barWrap}>
        <span
          className={styles.caption}
          data-hidden={hasTurns || prompt.length > 0}
          aria-hidden
        >
          anything you can describe
        </span>

        <form
          id={formId}
          ref={barRef}
          className={`${styles.bar} t-input`}
          data-mode={effectiveMode}
          onSubmit={submit}
        >
          {inpaintActive && focusedImage && (
            <div className={styles.inpaintBanner}>
              <IconBrush />
              Inpainting · describe the replacement
              <button
                type="button"
                className={styles.exit}
                onClick={onClearFocus}
              >
                Exit
              </button>
            </div>
          )}

          {(focusedImage || refs.length > 0) && (
            <div className={styles.contextRow}>
              {focusedImage && !inpaintActive && (
                <span className={styles.contextChip} data-kind="focus">
                  <span className={styles.contextThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={focusedImage.url} alt="" />
                  </span>
                  <span className={styles.contextLabel}>
                    {focusedImage.intent === "animate" ? "Animating" : "Editing this"}
                  </span>
                  <button
                    type="button"
                    aria-label="Remove context"
                    className={styles.contextRemove}
                    onClick={onClearFocus}
                  >
                    <IconClose />
                  </button>
                </span>
              )}
              {refs.map((ref) => (
                <span key={ref.id} className={styles.contextChip}>
                  <span className={styles.contextThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ref.url} alt="" />
                  </span>
                  <span className={styles.contextLabel}>Reference</span>
                  <button
                    type="button"
                    aria-label="Remove reference"
                    className={styles.contextRemove}
                    onClick={() =>
                      setRefs((prev) => prev.filter((r) => r.id !== ref.id))
                    }
                  >
                    <IconClose />
                  </button>
                </span>
              ))}
            </div>
          )}

          {effectiveMode === "video" && (
            <VideoControls
              firstFrame={firstFrame ? { url: firstFrame } : null}
              lastFrame={lastFrame ? { url: lastFrame } : null}
              onSetFirstFrame={setFirstFrame}
              onSetLastFrame={setLastFrame}
            />
          )}

          <div className={styles.inputZone}>
            <textarea
              ref={textareaRef}
              className={styles.input}
              placeholder={placeholder}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={handleKey}
              rows={1}
              aria-label="Prompt"
            />
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                type="button"
                className={styles.attachButton}
                aria-label="Attach reference"
                onClick={() => attachInputRef.current?.click()}
              >
                <IconPlus />
              </button>
              <input
                ref={attachInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  handleAttach(file);
                  event.target.value = "";
                }}
              />

              <Segmented
                label="Mode"
                value={mode}
                onChange={setMode}
                options={MODE_OPTIONS}
              />

              <span className={styles.divider} aria-hidden />

              <SettingsPill
                model={model}
                onModel={setModel}
                ratio={ratio}
                onRatio={setRatio}
                duration={duration}
                onDuration={setDuration}
                showDuration={effectiveMode === "video"}
              />

              {effectiveMode !== "inpaint" && (
                <Segmented
                  label="Variants"
                  value={variants}
                  onChange={setVariants}
                  options={VARIANT_OPTIONS}
                />
              )}
            </div>

            <div className={styles.toolbarRight}>
              <button
                type="submit"
                className={styles.generate}
                data-disabled={prompt.trim().length === 0}
              >
                {effectiveMode === "inpaint" ? "Apply" : "Generate"}
                <span className={styles.generateHint} aria-hidden>
                  <IconArrowReturn width={9} height={9} />
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
