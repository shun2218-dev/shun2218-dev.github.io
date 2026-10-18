import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("ハンドル名を見出しとして表示する", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: "shun2218" }),
    ).toBeInTheDocument();
  });
});
