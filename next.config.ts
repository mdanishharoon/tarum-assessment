import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DO NOT add ignoreBuildErrors or ignoreDuringBuilds - fix errors instead
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
