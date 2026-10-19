import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroCanvas } from "./HeroCanvas";

const scene = vi.hoisted(() => ({ fail: false }));

// next/dynamic を通さず、すぐに描画するか失敗させる
vi.mock("next/dynamic", () => ({
  default: () =>
    function HeroScene() {
      if (scene.fail) throw new Error("WebGL コンテキストを作れない");
      return <div data-testid="hero-scene" />;
    },
}));

function mockWebGL(supported: boolean) {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    supported ? ({} as RenderingContext) : null,
  );
}

describe("HeroCanvas", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    scene.fail = false;
  });

  it("WebGL が使えれば 3D を描く", async () => {
    mockWebGL(true);
    render(<HeroCanvas />);
    expect(await screen.findByTestId("hero-scene")).toBeInTheDocument();
  });

  it("WebGL が使えなければ静的な表示に切り替える", async () => {
    mockWebGL(false);
    render(<HeroCanvas />);
    expect(await screen.findByTestId("hero-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-scene")).toBeNull();
  });

  it("3D の描画に失敗したときも静的な表示に切り替える", async () => {
    mockWebGL(true);
    scene.fail = true;
    // React がエラーを console に出すため、テストの出力からは隠す
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<HeroCanvas />);
    expect(await screen.findByTestId("hero-fallback")).toBeInTheDocument();
  });
});
