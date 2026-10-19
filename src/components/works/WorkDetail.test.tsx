import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getWork } from "@/lib/works";
import { WorkDetail } from "./WorkDetail";

function renderWork(slug: string) {
  const found = getWork(slug);
  if (!found) throw new Error(`${slug} がない`);
  render(<WorkDetail work={found.work} next={found.next} />);
  return found;
}

describe("WorkDetail", () => {
  it("作品名・リード文・各セクションを表示する", () => {
    const { work } = renderWork("pdf-merge-app");
    expect(
      screen.getByRole("heading", { level: 1, name: work.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(work.lead)).toBeInTheDocument();
    for (const name of ["Stack", "Overview", "Features", "Highlights"]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("サイトとリポジトリを新しいタブで開くリンクにする", () => {
    renderWork("pdf-merge-app");
    const site = screen.getByRole("link", { name: /pdf-merge\.app/ });
    expect(site).toHaveAttribute("href", "https://pdf-merge.app");
    expect(site).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/shun2218-dev/pdf-merge-app",
    );
  });

  it("リンクがない作品は「なし」と表示する", () => {
    renderWork("ichirizuka");
    expect(screen.getAllByText("なし")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: /GitHub/ })).toBeNull();
  });

  it("一覧への戻りと次の作品へのリンクを置く", () => {
    const { next } = renderWork("pylabo");
    expect(screen.getByRole("link", { name: "Back to Works" })).toHaveAttribute(
      "href",
      "/#works",
    );
    expect(
      screen.getByRole("link", { name: new RegExp(next.title) }),
    ).toHaveAttribute("href", `/works/${next.slug}`);
  });
});
