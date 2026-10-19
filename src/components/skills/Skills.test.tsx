import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import { Skills } from "./Skills";

describe("Skills", () => {
  it("カテゴリごとに見出しと項目の一覧を表示する", () => {
    render(<Skills />);
    const section = screen.getByRole("region", { name: "Skills" });
    expect(section).toHaveAttribute("id", "skills");

    const lists = within(section).getAllByRole("list");
    expect(lists).toHaveLength(site.skills.groups.length);
    site.skills.groups.forEach((group, index) => {
      expect(
        within(section).getByRole("heading", { level: 3, name: group.label }),
      ).toBeInTheDocument();
      expect(
        within(lists[index])
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(group.items);
    });
  });
});
