// E2E 用に out/ を GitHub Pages と同じ振る舞いで配信する。
// ディレクトリは index.html を返し、末尾スラッシュのない URL はスラッシュ付きへ 301 で寄せ、
// 見つからないときは 404.html を 404 で返す
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve("out");
const port = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const isFile = (file) =>
  stat(file).then(
    (s) => s.isFile(),
    () => false,
  );

function send(res, status, file) {
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(res);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = path.join(root, decodeURIComponent(pathname));
  // out/ の外を読ませない
  if (!file.startsWith(root))
    return send(res, 404, path.join(root, "404.html"));

  if (pathname.endsWith("/")) {
    const index = path.join(file, "index.html");
    if (await isFile(index)) return send(res, 200, index);
  } else if (await isFile(file)) {
    return send(res, 200, file);
  } else if (await isFile(path.join(file, "index.html"))) {
    res.writeHead(301, { Location: `${pathname}/` });
    return res.end();
  }
  send(res, 404, path.join(root, "404.html"));
}).listen(port, () => console.log(`http://localhost:${port}/`));
