import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./tokens.css";
import "./my-way.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forge — AI Content Studio",
  description: "A dense, opinionated AI image and video studio. Generate, edit, animate, fork.",
};

export default function MyWayLayout({ children }: { children: React.ReactNode }) {
  return <div className={`myway ${bebas.variable}`}>{children}</div>;
}
