// WebGL が使えないときの代わり。デザインの静止画と同じく、暗い球にゴールドの縁を重ねる
export function HeroFallback() {
  return (
    <div
      data-testid="hero-fallback"
      className="flex size-full items-center justify-center"
    >
      <div className="aspect-square w-[66%] rounded-full bg-[radial-gradient(circle_at_38%_34%,#2a2620_0%,#121110_55%,#0a0a0a_100%)] shadow-[inset_0_0_0_1px_rgb(201_169_110/0.25),0_0_80px_-20px_rgb(201_169_110/0.25)]" />
    </div>
  );
}
