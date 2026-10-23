import { describe, expect, it } from "vitest";
import { createAsciiSphere, type FrameParams, RAMP } from "./ascii-sphere";

const COLS = 96;
const ROWS = 48;
const settled: FrameParams = {
  time: 0,
  light: { x: 0, y: 0 },
  intro: 1,
  scale: 1,
};

const at = (c: number, r: number) => r * COLS + c;

describe("createAsciiSphere", () => {
  it("中心に陰影の文字を描き、四隅は空ける", () => {
    const { glyphs } = createAsciiSphere({ cols: COLS, rows: ROWS })(settled);
    expect(RAMP).toContain(glyphs[at(COLS / 2, ROWS / 2)]);
    expect(glyphs[at(0, 0)]).toBe(" ");
    expect(glyphs[at(COLS - 1, ROWS - 1)]).toBe(" ");
  });

  it("光の当たる側ほど濃い文字にする", () => {
    const frame = createAsciiSphere({ cols: COLS, rows: ROWS });
    // 既定の光は左上から当たる
    const { glyphs } = frame(settled);
    const lit = RAMP.indexOf(glyphs[at(36, 18)]);
    const shade = RAMP.indexOf(glyphs[at(60, 30)]);
    expect(lit).toBeGreaterThan(shade);

    // マウスを右下に置くと、光も右下から当たる
    const moved = frame({ ...settled, light: { x: 1, y: 1 } }).glyphs;
    expect(RAMP.indexOf(moved[at(60, 30)])).toBeGreaterThan(
      RAMP.indexOf(moved[at(36, 18)]),
    );
  });

  it("登場の途中は文字が乱れ、時間で入れ替わる", () => {
    const frame = createAsciiSphere({ cols: COLS, rows: ROWS });
    const start = frame({ ...settled, intro: 0 }).glyphs.join("");
    const next = frame({ ...settled, intro: 0, time: 0.1 }).glyphs.join("");
    expect(start).not.toBe(frame(settled).glyphs.join(""));
    expect(start).not.toBe(next);
  });

  it("同じ入力なら同じ文字を返す", () => {
    const a = createAsciiSphere({ cols: COLS, rows: ROWS })({
      ...settled,
      time: 3.2,
    });
    const b = createAsciiSphere({ cols: COLS, rows: ROWS })({
      ...settled,
      time: 3.2,
    });
    expect(a.glyphs).toEqual(b.glyphs);
    expect(a.tones).toEqual(b.tones);
  });

  it("スクロールで小さくすると、描くマスが減る", () => {
    const frame = createAsciiSphere({ cols: COLS, rows: ROWS });
    const count = (scale: number) =>
      frame({ ...settled, scale }).glyphs.filter((g) => g !== " ").length;
    expect(count(0.7)).toBeLessThan(count(1));
  });
});
