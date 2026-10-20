import { expect, test } from "@playwright/test";
import { site } from "../src/lib/site";
import { getWorks } from "../src/lib/works";

const works = getWorks();

test.describe("メタ情報", () => {
  test("OGP 画像と favicon を PNG で配信する", async ({ request }) => {
    const paths = [
      "/og/home.png",
      ...works.map((work) => `/og/works/${work.slug}.png`),
      "/icons/icon.png",
      "/icons/apple-touch-icon.png",
    ];
    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toBe("image/png");
    }
  });

  test("作品詳細の og:image がその作品の画像を指す", async ({ page }) => {
    const [work] = works;
    await page.goto(`/works/${work.slug}/`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${site.url}/og/works/${work.slug}.png`,
    );
  });

  test("sitemap.xml に全ページ、robots.txt にその場所を載せる", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const work of works)
      expect(sitemap).toContain(`${site.url}/works/${work.slug}/`);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`${site.url}/sitemap.xml`);
  });
});
