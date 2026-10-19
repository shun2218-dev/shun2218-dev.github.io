import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("セクションへのアンカーと GitHub へのリンクを表示する", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "メイン" });
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/#about",
    );
    expect(within(nav).getByRole("link", { name: "Skills" })).toHaveAttribute(
      "href",
      "/#skills",
    );
    expect(within(nav).getByRole("link", { name: "Works" })).toHaveAttribute(
      "href",
      "/#works",
    );
    expect(within(nav).getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/shun2218-dev",
    );
  });

  it("閉じているメニューは支援技術から隠れる", () => {
    render(<Header />);
    expect(
      screen.queryByRole("navigation", { name: "メニュー" }),
    ).not.toBeInTheDocument();
  });

  it("メニューボタンで開き、リンクを押すと閉じる", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "メニューを開く" }));
    expect(
      screen.getByRole("button", { name: "メニューを閉じる" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    const menu = screen.getByRole("navigation", { name: "メニュー" });
    await user.click(within(menu).getByRole("link", { name: /About/ }));
    expect(
      screen.getByRole("button", { name: "メニューを開く" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("Esc キーで閉じる", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "メニューを開く" }));
    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: "メニューを開く" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
