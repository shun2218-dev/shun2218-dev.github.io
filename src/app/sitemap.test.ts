import { describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap / robots", () => {
  it("トップと全作品の詳細ページを絶対 URL で載せる", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://shun2218-dev.github.io/",
      "https://shun2218-dev.github.io/works/pdf-merge-app/",
      "https://shun2218-dev.github.io/works/hibari/",
      "https://shun2218-dev.github.io/works/ichirizuka/",
      "https://shun2218-dev.github.io/works/pylabo/",
    ]);
  });

  it("robots.txt からサイトマップを案内する", () => {
    expect(robots().sitemap).toBe("https://shun2218-dev.github.io/sitemap.xml");
  });
});
