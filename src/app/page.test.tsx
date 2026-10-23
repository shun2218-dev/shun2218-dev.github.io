import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

// jsdom には canvas の描画がないため球体は描かない
vi.mock("@/components/hero/AsciiSphere", () => ({ AsciiSphere: () => null }));

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
      screen.getByText("速さは AI と。確かさは、設計と仕組みで。"),
    ).toBeInTheDocument();
  });
});
