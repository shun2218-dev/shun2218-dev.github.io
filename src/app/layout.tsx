import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/cursor/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { ogImage } from "@/lib/og/images";
import { site } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  // ラベルや番号にしか使わず、最初の描画を待たせるほどではないため先読みしない
  preload: false,
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ja_JP",
    url: "/",
    images: [{ url: "/og/home.png", ...ogImage, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
  icons: {
    icon: { url: "/icons/icon.png", type: "image/png", sizes: "64x64" },
    apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* 和文（globals.css の @font-face）。本文の 300 だけ先読みし、作品詳細の機能名にしか使わない 400 は待つ */}
        <link
          rel="preload"
          href="/fonts/generated/noto-sans-jp-300.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
