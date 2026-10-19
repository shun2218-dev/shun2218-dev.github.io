import { describe, expect, it } from "vitest";
import { getWork, getWorks, parseWork } from "./works";

const sample = `---
title: sample
order: 1
summary: 概要
tags: [Go]
lead: リード文
type: Web アプリケーション
role: 設計・実装
stack: [Go, Redis]
overview:
  - 段落 1
features:
  - title: 機能
    body: 説明
highlights:
  - 工夫 1
  - 工夫 2
---
`;

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

describe("getWork", () => {
  it("次の作品を返し、最後の作品の次は最初に戻る", () => {
    expect(getWork("hibari")?.next.slug).toBe("ichirizuka");
    expect(getWork("pylabo")?.next.slug).toBe("pdf-merge-app");
    expect(getWork("missing")).toBeUndefined();
  });
});

describe("parseWork", () => {
  it("frontmatter を読む", () => {
    expect(parseWork("sample.md", sample)).toMatchObject({
      slug: "sample",
      stack: ["Go", "Redis"],
      features: [{ title: "機能", body: "説明" }],
      highlights: ["工夫 1", "工夫 2"],
    });
  });

  it("必須項目が欠けていればファイル名つきで失敗する", () => {
    expect(() =>
      parseWork("broken.md", sample.replace("summary: 概要\n", "")),
    ).toThrow("content/works/broken.md: summary");
    expect(() =>
      parseWork("broken.md", sample.replace(/features:\n.*\n.*\n/, "")),
    ).toThrow("features");
    expect(() => parseWork("none.md", "本文だけ")).toThrow("frontmatter");
  });
});
