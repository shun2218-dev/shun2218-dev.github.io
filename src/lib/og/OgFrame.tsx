import type { ReactNode } from "react";
import { og } from "@/lib/og/fonts";
import { site } from "@/lib/site";

// OGP 画像の共通の枠。背景の縦グリッド線、右に球、左下にロゴと URL を置く
export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: og.background,
        color: og.foreground,
        fontFamily: "Cormorant",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: (og.size.width / 6) * i,
            width: 1,
            background: og.gridLine,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: 75,
          width: 480,
          height: 480,
          borderRadius: 9999,
          backgroundImage:
            "radial-gradient(circle at 38% 34%, #2A2620 0%, #121110 55%, #0A0A0A 100%)",
          border: "1px solid rgba(201,169,110,0.3)",
          boxShadow: "0 0 120px rgba(201,169,110,0.12)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", fontSize: 36, fontWeight: 500 }}>
            {site.name}
            <span style={{ color: og.accent }}>.</span>
          </div>
          <div
            style={{
              fontFamily: "Mono",
              fontSize: 20,
              letterSpacing: "0.08em",
              color: og.muted,
            }}
          >
            {new URL(site.url).host}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OgEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Mono",
        fontSize: 22,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: og.accent,
      }}
    >
      {children}
    </div>
  );
}
