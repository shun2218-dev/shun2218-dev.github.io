import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("GitHub へのリンクとコピーライトを表示する", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: "github.com/shun2218-dev ↗" }),
    ).toHaveAttribute("href", "https://github.com/shun2218-dev");
    expect(
      screen.getByText(`© ${new Date().getFullYear()} shun2218-dev`),
    ).toBeInTheDocument();
  });
});
