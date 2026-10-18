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
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
