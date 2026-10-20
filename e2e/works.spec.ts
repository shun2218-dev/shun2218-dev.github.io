import { expect, test } from "@playwright/test";
import { getWorks } from "../src/lib/works";
import { expectImagesLoaded, scrollTo } from "./helpers";

const works = getWorks();

test.describe("作品詳細", () => {
  test("一覧から開け、スクリーンショットを読み込める", async ({ page }) => {
    const [first] = works;
    await page.goto("/");
    const card = page.locator(`#works a[href="/works/${first.slug}/"]`);
    await scrollTo(card);
    await card.click();

    await expect(page).toHaveURL(`/works/${first.slug}/`);
    await expect(
      page.getByRole("heading", { level: 1, name: first.title }),
    ).toBeVisible();
    await expectImagesLoaded(page, page.locator("main img"));
  });

  test("「次の作品」で順に進み、最後の作品の次は最初に戻る", async ({
    page,
  }) => {
    await page.goto(`/works/${works[0].slug}/`);
    for (const next of [...works.slice(1), works[0]]) {
      const link = page.getByRole("link", { name: /Next Project/ });
      await scrollTo(link);
      await link.click();
      await expect(page).toHaveURL(`/works/${next.slug}/`);
      await expect(
        page.getByRole("heading", { level: 1, name: next.title }),
      ).toBeVisible();
    }
  });

  test("末尾のスラッシュがない URL はスラッシュ付きへ移る", async ({
    page,
  }) => {
    await page.goto(`/works/${works[0].slug}`);
    await expect(page).toHaveURL(`/works/${works[0].slug}/`);
  });

  test("存在しない作品は 404 を返す", async ({ page }) => {
    const response = await page.goto("/works/missing/");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });
});
