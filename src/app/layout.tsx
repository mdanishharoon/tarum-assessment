import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const googleSansFlex = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "./fonts/google-sans-flex-latin.woff2",
      weight: "100 1000",
      style: "normal",
    },
    {
      path: "./fonts/google-sans-flex-latin-ext.woff2",
      weight: "100 1000",
      style: "normal",
    },
  ],
  declarations: [{ prop: "font-stretch", value: "25% 151%" }],
});

export const metadata: Metadata = {
  title: {
    default: "Tarum — AI Content Studio",
    template: "%s | Tarum",
  },
  description:
    "Generate images and videos from text prompts. A responsive AI content studio built with Next.js.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Tarum — AI Content Studio",
    description: "Generate images and videos from text prompts.",
    url: "/",
    siteName: "Tarum",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarum — AI Content Studio",
    description: "Generate images and videos from text prompts.",
  },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={googleSansFlex.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
