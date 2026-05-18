export type HistoryItem = {
  id: string;
  alt: string;
  src: string;
};

const seeds = [
  "library-portrait",
  "alpine-road",
  "misty-forest",
  "mirror-reflection",
  "fractal-bloom",
  "crystal-face",
  "studio-portrait",
  "floral-mask",
  "paris-clouds",
  "lantern-walk",
  "neon-city",
  "hello-world-cat",
  "soft-silhouette",
  "underwater-figure",
  "northern-lights",
];

export const historyItems: HistoryItem[] = seeds.map((seed, index) => ({
  id: seed,
  alt: `Past generation ${index + 1}`,
  src: `https://picsum.photos/seed/${seed}/240/240`,
}));
