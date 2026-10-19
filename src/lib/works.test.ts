import { describe, expect, it } from "vitest";
import { getWorks, parseWork } from "./works";

describe("getWorks", () => {
  it("content/works の作品を order 順に読み、番号を振る", () => {
    const works = getWorks();
    expect(works.map((work) => [work.no, work.slug])).toEqual([
      ["01", "pdf-merge-app"],
      ["02", "hibari"],
      ["03", "ichirizuka"],
      ["04", "pylabo"],
    ]);
  });

  it("ichirizuka にはサイトもリポジトリも載せない", () => {
    const ichirizuka = getWorks().find((work) => work.slug === "ichirizuka");
    expect(ichirizuka?.site).toBeUndefined();
    expect(ichirizuka?.repository).toBeUndefined();
  });
});

describe("parseWork", () => {
  it("frontmatter と本文を分けて読む", () => {
    const work = parseWork(
      "sample.md",
      "---\ntitle: sample\norder: 1\nsummary: 概要\ntags: [Go]\n---\n\n本文\n",
    );
    expect(work).toMatchObject({
      slug: "sample",
      title: "sample",
      tags: ["Go"],
      body: "本文",
    });
  });

  it("必須項目が欠けていればファイル名つきで失敗する", () => {
    expect(() =>
      parseWork("broken.md", "---\ntitle: broken\norder: 1\ntags: []\n---\n"),
    ).toThrow("content/works/broken.md: summary");
    expect(() => parseWork("none.md", "本文だけ")).toThrow("frontmatter");
  });
});
