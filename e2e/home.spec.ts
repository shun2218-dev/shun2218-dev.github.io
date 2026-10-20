import { expect, test } from "@playwright/test";
import { site } from "../src/lib/site";
import { getWorks } from "../src/lib/works";
import { expectImagesLoaded, scrollTo } from "./helpers";

test.describe("トップ", () => {
  test("見出しと各セクションを表示する", async ({ page }) => {
    await page.goto("/");
    await expect(
      // 「shun」と「2218」のあいだで改行している
      page.getByRole("heading", { level: 1, name: /^shun\s*2218$/ }),
    ).toBeVisible();
    for (const section of [site.about, site.skills, site.works]) {
      const heading = page.getByRole("heading", {
        level: 2,
        name: section.title,
        // 画面に入るまでは Reveal で隠れている
        includeHidden: true,
      });
      await scrollTo(heading);
      await expect(heading).toBeVisible();
    }
  });

  test("ナビゲーションから Works へ移動できる", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("button", { name: site.labels.openMenu }).click();
      await page
        .getByRole("navigation", { name: site.labels.mobileNav })
        .getByRole("link", { name: "Works" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: site.labels.mainNav })
        .getByRole("link", { name: "Works" })
        .click();
    }
    await expect(page).toHaveURL(/#works$/);
    await expect(
      page.getByRole("heading", { level: 2, name: site.works.title }),
    ).toBeInViewport();
  });

  test("Works に全作品を並べ、スクリーンショットを読み込める", async ({
    page,
  }) => {
    await page.goto("/");
    const works = page.locator("#works");
    for (const work of getWorks()) {
      await expect(
        works.locator(`a[href="/works/${work.slug}/"]`),
      ).toBeAttached();
    }
    await expectImagesLoaded(page, works.locator("img"));
  });
});
