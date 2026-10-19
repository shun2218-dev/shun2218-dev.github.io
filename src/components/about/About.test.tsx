import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import { About } from "./About";

describe("About", () => {
  it("見出しでラベル付けされたセクションに自己紹介を表示する", () => {
    render(<About />);
    const section = screen.getByRole("region", { name: "About" });
    expect(section).toHaveAttribute("id", "about");
    expect(screen.getByText(site.about.lead)).toBeInTheDocument();
    expect(screen.getByText(site.about.body)).toBeInTheDocument();
  });
});
