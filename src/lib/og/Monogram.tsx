import { og } from "@/lib/og/fonts";

// favicon とホーム画面のアイコン。ロゴの「s」と金の点を、暗い角丸の中に置く
export function Monogram({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: og.background,
        borderRadius: size * 0.22,
        color: og.foreground,
        fontFamily: "Cormorant",
        fontWeight: 500,
        fontSize: size * 0.82,
        lineHeight: 1,
      }}
    >
      <span style={{ marginTop: -size * 0.12 }}>s</span>
      <span style={{ color: og.accent, marginTop: -size * 0.12 }}>.</span>
    </div>
  );
}
