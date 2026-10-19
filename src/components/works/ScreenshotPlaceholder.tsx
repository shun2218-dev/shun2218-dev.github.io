type Props = {
  label?: string;
  className?: string;
};

// スクリーンショットの仮置き（斜めストライプ）。差し替えるまでの装飾なので読み上げない
export function ScreenshotPlaceholder({
  label = "[SCREENSHOT]",
  className = "",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-[repeating-linear-gradient(135deg,#121212_0_10px,#151515_10px_20px)] font-mono text-[10px] tracking-nav text-text-placeholder md:bg-[repeating-linear-gradient(135deg,#121212_0_12px,#151515_12px_24px)] md:text-[11px] ${className}`}
    >
      {label}
    </div>
  );
}
