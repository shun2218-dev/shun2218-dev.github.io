import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shun2218",
  description: "shun2218 のポートフォリオサイト",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
