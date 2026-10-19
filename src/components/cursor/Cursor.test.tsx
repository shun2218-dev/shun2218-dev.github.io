import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Cursor } from "./Cursor";

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

function setup() {
  const { container, unmount } = render(
    <>
      <Cursor />
      <a href="/works">link</a>
      <p>text</p>
    </>,
  );
  const cursor = container.querySelector("[aria-hidden='true']") as HTMLElement;
  return { cursor, unmount };
}

describe("Cursor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("マウスで動かすと表示し、リンクの上では広がる", () => {
    mockMatchMedia(true);
    const { cursor, unmount } = setup();
    expect(document.documentElement).toHaveClass("custom-cursor");

    fireEvent.pointerMove(window, {
      pointerType: "mouse",
      clientX: 10,
      clientY: 20,
    });
    expect(cursor.dataset.visible).toBe("true");

    fireEvent.pointerOver(document.querySelector("a") as HTMLElement);
    expect(cursor.dataset.hover).toBe("true");
    fireEvent.pointerOver(document.querySelector("p") as HTMLElement);
    expect(cursor.dataset.hover).toBe("false");

    unmount();
    expect(document.documentElement).not.toHaveClass("custom-cursor");
  });

  it("タッチやモーション軽減の環境では OS のカーソルのままにする", () => {
    mockMatchMedia(false);
    const { cursor } = setup();
    expect(document.documentElement).not.toHaveClass("custom-cursor");
    fireEvent.pointerMove(window, {
      pointerType: "mouse",
      clientX: 10,
      clientY: 20,
    });
    expect(cursor.dataset.visible).toBe("false");
  });
});
