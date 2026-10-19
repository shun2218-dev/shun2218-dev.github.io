import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";

describe("Reveal / Parallax", () => {
  it("子要素をそのまま表示する", () => {
    render(
      <>
        <Reveal>表示する</Reveal>
        <Parallax speed={1}>動かす</Parallax>
      </>,
    );
    expect(screen.getByText("表示する")).toBeVisible();
    expect(screen.getByText("動かす")).toBeVisible();
  });
});
