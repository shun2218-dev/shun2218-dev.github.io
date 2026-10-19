import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

// 作品は content/works/<slug>.md の frontmatter で管理する。追加はファイルを置くだけで済む
const WORKS_DIR = path.join(process.cwd(), "content/works");

export type Feature = {
  title: string;
  body: string;
};

export type Work = {
  slug: string;
  /** 一覧での番号（01, 02, ...）。order の昇順に振る */
  no: string;
  title: string;
  /** 一覧に出す 1〜2 文の概要 */
  summary: string;
  tags: string[];
  site?: string;
  repository?: string;
  /** ここから下は作品詳細で使う */
  lead: string;
  type: string;
  role: string;
  stack: string[];
  overview: string[];
  features: Feature[];
  highlights: string[];
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function fail(file: string, message: string): never {
  throw new Error(`content/works/${file}: ${message}`);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item !== "")
  );
}

export function parseWork(file: string, source: string) {
  const match = FRONTMATTER.exec(source);
  if (!match) fail(file, "先頭に --- で囲んだ frontmatter が必要です");

  const data: unknown = parse(match[1]);
  if (typeof data !== "object" || data === null)
    fail(file, "frontmatter が空です");
  const record = data as Record<string, unknown>;

  const string = (key: string) => {
    const value = record[key];
    if (typeof value !== "string" || value === "")
      fail(file, `${key} は空でない文字列にしてください`);
    return value;
  };
  const optionalString = (key: string) =>
    record[key] === undefined ? undefined : string(key);
  const strings = (key: string) => {
    const value = record[key];
    if (!isStringArray(value))
      fail(file, `${key} は空でない文字列の配列にしてください`);
    return value;
  };

  const { order, features } = record;
  if (typeof order !== "number") fail(file, "order は数値にしてください");
  if (
    !Array.isArray(features) ||
    features.length === 0 ||
    !features.every(
      (feature) =>
        typeof feature?.title === "string" && typeof feature?.body === "string",
    )
  )
    fail(file, "features は title と body を持つ項目の配列にしてください");

  return {
    slug: file.replace(/\.md$/, ""),
    order,
    title: string("title"),
    summary: string("summary"),
    tags: strings("tags"),
    site: optionalString("site"),
    repository: optionalString("repository"),
    lead: string("lead"),
    type: string("type"),
    role: string("role"),
    stack: strings("stack"),
    overview: strings("overview"),
    features: features.map(({ title, body }: Feature) => ({ title, body })),
    highlights: strings("highlights"),
  };
}

export function getWorks(): Work[] {
  return readdirSync(WORKS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) =>
      parseWork(file, readFileSync(path.join(WORKS_DIR, file), "utf8")),
    )
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...work }, index) => ({
      ...work,
      no: String(index + 1).padStart(2, "0"),
    }));
}

export function getWork(slug: string) {
  const works = getWorks();
  const index = works.findIndex((work) => work.slug === slug);
  if (index === -1) return undefined;
  // 最後の作品の次は最初に戻る
  return { work: works[index], next: works[(index + 1) % works.length] };
}
