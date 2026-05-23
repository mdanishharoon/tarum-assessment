import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tarum — AI Content Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #fbf6ed 0%, #f5e7d5 55%, #f0cdb3 100%)",
          color: "#2b1f17",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "999px",
              background: "#e8866b",
              color: "#fbf6ed",
              fontSize: "40px",
              fontWeight: 700,
              fontFamily: "Georgia, serif",
            }}
          >
            T
          </div>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#6b4f3a",
            }}
          >
            Tarum
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "104px",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: "920px",
            }}
          >
            Generate images and video from a single prompt.
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#6b4f3a",
              maxWidth: "780px",
              lineHeight: 1.35,
            }}
          >
            A responsive AI content studio. Pick a model, choose a ratio, ship.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "22px",
            color: "#8a6a51",
          }}
        >
          <span>Flux 1.1 Pro · Stable Diffusion 3.5 · DALL·E 3</span>
          <span style={{ color: "#e8866b", fontWeight: 600 }}>tarum.ai</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
