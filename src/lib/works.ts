import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

// 作品は content/works/<slug>.md に frontmatter 付き Markdown で置く。追加はファイルを置くだけで済む
const WORKS_DIR = path.join(process.cwd(), "content/works");

export type Work = {
  slug: string;
  /** 一覧での番号（01, 02, ...）。order の昇順に振る */
  no: string;
  title: string;
  summary: string;
  tags: string[];
  site?: string;
  repository?: string;
  /** frontmatter を除いた本文（作品詳細で使う） */
  body: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function fail(file: string, message: string): never {
  throw new Error(`content/works/${file}: ${message}`);
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  file: string,
) {
  const value = data[key];
  if (typeof value !== "string" || value === "")
    fail(file, `${key} は空でない文字列にしてください`);
  return value;
}

function optionalString(
  data: Record<string, unknown>,
  key: string,
  file: string,
) {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") fail(file, `${key} は文字列にしてください`);
  return value;
}

export function parseWork(file: string, source: string) {
  const match = FRONTMATTER.exec(source);
  if (!match) fail(file, "先頭に --- で囲んだ frontmatter が必要です");

  const data: unknown = parse(match[1]);
  if (typeof data !== "object" || data === null)
    fail(file, "frontmatter が空です");
  const record = data as Record<string, unknown>;

  const { order, tags } = record;
  if (typeof order !== "number") fail(file, "order は数値にしてください");
  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
    fail(file, "tags は文字列の配列にしてください");

  return {
    slug: file.replace(/\.md$/, ""),
    order,
    title: requireString(record, "title", file),
    summary: requireString(record, "summary", file),
    tags,
    site: optionalString(record, "site", file),
    repository: optionalString(record, "repository", file),
    body: match[2].trim(),
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
