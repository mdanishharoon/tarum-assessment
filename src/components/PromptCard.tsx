import { cn } from "@/lib/cn";
import styles from "./PromptCard.module.css";

type PromptCardProps = {
  prompt: string;
  modelLabel: string;
  isLoading?: boolean;
};

export function PromptCard({ prompt, modelLabel, isLoading = false }: PromptCardProps) {
  return (
    <article
      key={prompt}
      className={cn(styles.card, isLoading && styles.cardLoading)}
      aria-busy={isLoading || undefined}
    >
      <p className={styles.text}>{prompt}</p>
      <span className={cn(styles.tag, isLoading && styles.tagLoading)}>
        {isLoading ? "Generating…" : modelLabel}
      </span>
    </article>
  );
}
