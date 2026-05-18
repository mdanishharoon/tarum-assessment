import { cn } from "@/lib/cn";
import styles from "./PromptCard.module.css";

type PromptCardProps = {
  prompt: string;
  modelLabel: string;
  isLoading?: boolean;
  justCompleted?: boolean;
};

export function PromptCard({
  prompt,
  modelLabel,
  isLoading = false,
  justCompleted = false,
}: PromptCardProps) {
  const state = isLoading
    ? "loading"
    : justCompleted
      ? "just-completed"
      : "idle";

  return (
    <article
      key={prompt}
      className={cn(styles.card, isLoading && styles.cardLoading)}
      data-state={state}
      aria-busy={isLoading || undefined}
    >
      <p className={styles.text}>{prompt}</p>
      <span className={cn(styles.tag, isLoading && styles.tagLoading)}>
        {isLoading ? "Generating…" : modelLabel}
      </span>
    </article>
  );
}
