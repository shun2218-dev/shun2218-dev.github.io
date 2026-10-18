import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages で配信するため、静的な HTML として書き出す
  output: "export",
  // GitHub Pages は /works/foo を /works/foo/index.html に解決するため
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        // next/font が生成する CSS（Next.js 内部扱い）まで通すと dev でフォントの URL が壊れるため、自前の CSS だけに限る
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
