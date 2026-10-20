import { expect, type Locator, type Page } from "@playwright/test";

// スクロールで現れる要素（Reveal）は画面に入るまで visibility: hidden のため、
// Playwright の自動スクロールに任せず、利用者と同じように画面まで送る
export async function scrollTo(target: Locator) {
  await target.evaluate((el) => el.scrollIntoView({ block: "center" }));
}

// 遅延読み込みの画像も含め、すべて読み込めている（壊れた画像がない）ことを確かめる
export async function expectImagesLoaded(page: Page, images: Locator) {
  const count = await images.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const image = images.nth(i);
    await scrollTo(image);
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  // 先頭に戻しておく
  await page.evaluate(() => window.scrollTo(0, 0));
}
