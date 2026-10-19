import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Works } from "./Works";

describe("Works", () => {
  it("作品ごとに詳細ページへのリンクを作品名で表示する", () => {
    render(<Works />);
    const section = screen.getByRole("region", { name: "Works" });
    expect(section).toHaveAttribute("id", "works");

    const links = within(section).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/works/pdf-merge-app",
      "/works/hibari",
      "/works/ichirizuka",
      "/works/pylabo",
    ]);
    expect(
      within(section).getByRole("link", { name: "hibari" }),
    ).toBeInTheDocument();
    expect(within(section).getByText("4 PROJECTS")).toBeInTheDocument();
  });
});
