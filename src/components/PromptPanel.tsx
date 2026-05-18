"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Accordion } from "./Accordion";
import { ModelIcon, StackIcon } from "./Icons";
import SparklesIcon from "./icons/sparkles-icon";
import type { AnimatedIconHandle } from "./icons/types";
import { ModeTabs } from "./ModeTabs";
import { RatioGlyph } from "./SegmentedControl";
import { SettingChip } from "./SettingChip";
import styles from "./PromptPanel.module.css";
import { ASPECT_RATIOS, IMAGE_COUNTS, MODELS } from "@/lib/ratios";
import type { AspectRatio, GenerationMode, GenerationRequest } from "@/lib/types";

type PromptPanelProps = {
  onGenerate: (request: GenerationRequest) => void;
};

export type PromptPanelHandle = {
  applyPreset: (preset: {
    prompt: string;
    mode: GenerationMode;
    ratio: AspectRatio;
    model: string;
  }) => void;
};

const STYLE_PRESETS = [
  "Photoreal",
  "Cinematic",
  "Watercolor",
  "3D Render",
  "Neon",
  "Vintage Film",
] as const;

type ModelId = (typeof MODELS)[number]["id"];
type CountValue = (typeof IMAGE_COUNTS)[number];

const COUNT_OPTIONS = IMAGE_COUNTS.map((value) => ({
  value: String(value) as `${CountValue}`,
  label: String(value),
}));

const RATIO_OPTIONS = ASPECT_RATIOS.map((value) => ({
  value,
  label: value,
  icon: <RatioGlyph ratio={value} />,
}));

const MODEL_OPTIONS = MODELS.map((option) => ({
  value: option.id,
  label: option.short,
  hint: option.label,
}));

function isModelId(value: string): value is ModelId {
  return MODELS.some((option) => option.id === value);
}

export const PromptPanel = forwardRef<PromptPanelHandle, PromptPanelProps>(
  function PromptPanel({ onGenerate }, ref) {
    const [mode, setMode] = useState<GenerationMode>("image");
    const [prompt, setPrompt] = useState("");
    const [count, setCount] = useState<CountValue>(4);
    const [ratio, setRatio] = useState<AspectRatio>("1:1");
    const [model, setModel] = useState<ModelId>(MODELS[0].id);
    const [style, setStyle] = useState<(typeof STYLE_PRESETS)[number]>("Photoreal");
    const sparkleRef = useRef<AnimatedIconHandle>(null);

    useImperativeHandle(
      ref,
      () => ({
        applyPreset({ prompt: nextPrompt, mode: nextMode, ratio: nextRatio, model: nextModel }) {
          setPrompt(nextPrompt);
          setMode(nextMode);
          setRatio(nextRatio);
          if (isModelId(nextModel)) setModel(nextModel);
        },
      }),
      [],
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const trimmed = prompt.trim();
      if (!trimmed) return;
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
              disabled={!prompt.trim()}
              aria-label="Generate content"
              onMouseEnter={() => sparkleRef.current?.startAnimation()}
              onMouseLeave={() => sparkleRef.current?.stopAnimation()}
              onFocus={() => sparkleRef.current?.startAnimation()}
              onBlur={() => sparkleRef.current?.stopAnimation()}
            >
              <SparklesIcon
                ref={sparkleRef}
                size={20}
                strokeWidth={2}
                className={styles.generateIcon}
              />
              <span>Generate</span>
            </button>
          </div>
        </div>

        <div className={styles.chipsRow}>
          <SettingChip
            ariaLabel="Number of images"
            popoverHeading="Count"
            displayValue={String(count)}
            displayIcon={<StackIcon />}
            value={String(count) as `${CountValue}`}
            options={COUNT_OPTIONS}
            onChange={(value) => setCount(Number(value) as CountValue)}
          />
          <SettingChip
            ariaLabel="Aspect ratio"
            popoverHeading="Aspect ratio"
            displayValue={ratio}
            displayIcon={<RatioGlyph ratio={ratio} />}
            value={ratio}
            options={RATIO_OPTIONS}
            onChange={setRatio}
          />
          <SettingChip
            ariaLabel="Model"
            popoverHeading="Model"
            displayValue={MODELS.find((m) => m.id === model)?.short ?? "Model"}
            displayIcon={<ModelIcon />}
            value={model}
            options={MODEL_OPTIONS}
            onChange={(value) => setModel(value as ModelId)}
          />
        </div>

        <Accordion title="Advance">
          <p className={styles.helper}>
            Fine-tune sampling steps, CFG scale and seed. (Mock controls, the dummy API ignores
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
  },
);
