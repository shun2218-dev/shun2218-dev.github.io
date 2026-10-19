import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothScroll } from "./SmoothScroll";

const scrollTo = vi.fn();

vi.mock("lenis", () => ({
  default: class {
    on = vi.fn();
    raf = vi.fn();
    destroy = vi.fn();
    scrollTo = scrollTo;
  },
}));

function setup(href: string) {
  document.body.innerHTML = `<header></header><a href="${href}">link</a><section id="about"></section>`;
  render(<SmoothScroll />);
  const link = document.querySelector("a") as HTMLAnchorElement;
  // SmoothScroll が止めたかを記録したうえで、jsdom のページ遷移（未実装）は起こさない
  let prevented = false;
  link.addEventListener("click", (event) => {
    prevented = event.defaultPrevented;
    event.preventDefault();
  });
  link.click();
  return prevented;
}

describe("SmoothScroll", () => {
  beforeEach(() => {
    scrollTo.mockClear();
  });

  it("同じページ内のアンカーは Lenis でスクロールする", () => {
    expect(setup("/#about")).toBe(true);
    expect(scrollTo).toHaveBeenCalledWith(document.getElementById("about"), {
      offset: -0,
    });
  });

  it("存在しないアンカーやほかのページへのリンクには関与しない", () => {
    expect(setup("/#missing")).toBe(false);
    expect(setup("/works/hibari/")).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
