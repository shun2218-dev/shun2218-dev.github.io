import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

// jsdom には WebGL がないため 3D は描画しない
vi.mock("@/components/hero/HeroCanvas", () => ({ HeroCanvas: () => null }));

describe("Home", () => {
  it("ハンドル名を見出しとして表示する", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: "shun2218" }),
    ).toBeInTheDocument();
  });

  it("肩書きとキャッチコピーを表示する", () => {
    render(<Home />);
    expect(
      screen.getByText("Frontend Engineer — Portfolio"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("確かな設計と、手触りのいいインターフェースを。"),
    ).toBeInTheDocument();
  });
});
