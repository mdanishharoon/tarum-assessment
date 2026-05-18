"use client";

import { useState, type FormEvent } from "react";
import { Accordion } from "./Accordion";
import { SparklesIcon } from "./Icons";
import { ModeTabs } from "./ModeTabs";
import { PillSelect } from "./PillSelect";
import styles from "./PromptPanel.module.css";
import { ASPECT_RATIOS, IMAGE_COUNTS, MODELS } from "@/lib/ratios";
import type { AspectRatio, GenerationMode, GenerationRequest } from "@/lib/types";

type PromptPanelProps = {
  onGenerate: (request: GenerationRequest) => void;
  isGenerating: boolean;
};

const STYLE_PRESETS = [
  "Photoreal",
  "Cinematic",
  "Watercolor",
  "3D Render",
  "Neon",
  "Vintage Film",
] as const;

export function PromptPanel({ onGenerate, isGenerating }: PromptPanelProps) {
  const [mode, setMode] = useState<GenerationMode>("image");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState<(typeof IMAGE_COUNTS)[number]>(4);
  const [ratio, setRatio] = useState<AspectRatio>("1:1");
  const [model, setModel] = useState<(typeof MODELS)[number]["id"]>(MODELS[0].id);
  const [style, setStyle] = useState<(typeof STYLE_PRESETS)[number]>("Photoreal");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;
    onGenerate({ prompt: trimmed, mode, count, ratio, model });
  }

  const placeholder =
    mode === "image"
      ? "Describe your imaginations to be converted to piece of art …"
      : "Describe a scene to render as a short video clip …";

  return (
    <form onSubmit={handleSubmit} className={styles.panel} aria-label="Prompt panel">
      <ModeTabs value={mode} onChange={setMode} />

      <div className={styles.inputCard}>
        <label htmlFor="forge-prompt" className={styles.srOnly}>
          Prompt
        </label>
        <textarea
          id="forge-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
          className={styles.textarea}
          rows={5}
        />
        <div className={styles.generateRow}>
          <button
            type="submit"
            className={styles.generate}
            disabled={!prompt.trim() || isGenerating}
            aria-label="Generate content"
          >
            <SparklesIcon className={styles.generateIcon} />
            <span>{isGenerating ? "Generating…" : "Generate"}</span>
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <PillSelect
          label="Number of images"
          hideLabel
          prefix="#"
          value={String(count) as `${(typeof IMAGE_COUNTS)[number]}`}
          options={IMAGE_COUNTS.map((value) => ({
            value: String(value) as `${(typeof IMAGE_COUNTS)[number]}`,
            label: `${value} ${value === 1 ? "Image" : "Images"}`,
          }))}
          onChange={(value) =>
            setCount(Number(value) as (typeof IMAGE_COUNTS)[number])
          }
        />
        <PillSelect
          label="Aspect ratio"
          hideLabel
          value={ratio}
          options={ASPECT_RATIOS.map((value) => ({ value, label: value }))}
          onChange={setRatio}
        />
        <PillSelect
          label="Model"
          hideLabel
          prefix="Model:"
          value={model}
          options={MODELS.map((option) => ({ value: option.id, label: option.label }))}
          onChange={(value) => setModel(value as (typeof MODELS)[number]["id"])}
        />
      </div>

      <Accordion title="Advance">
        <p className={styles.helper}>
          Fine-tune sampling steps, CFG scale and seed. (Mock controls — the dummy API ignores
          these.)
        </p>
        <div className={styles.advanceGrid}>
          <label className={styles.field}>
            <span>Steps</span>
            <input type="range" min={10} max={50} defaultValue={28} />
          </label>
          <label className={styles.field}>
            <span>Guidance</span>
            <input type="range" min={1} max={15} defaultValue={7} step={0.5} />
          </label>
          <label className={styles.field}>
            <span>Seed</span>
            <input type="text" placeholder="Random" />
          </label>
        </div>
      </Accordion>

      <Accordion title="Styles">
        <div className={styles.styles}>
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setStyle(preset)}
              className={style === preset ? styles.styleActive : styles.style}
              aria-pressed={style === preset}
            >
              {preset}
            </button>
          ))}
        </div>
      </Accordion>
    </form>
  );
}
