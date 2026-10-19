import { renderWorkImage } from "@/lib/og/images";
import { getWork, getWorks } from "@/lib/works";

export const dynamic = "force-static";
export const dynamicParams = false;

// 出力先を /og/works/<slug>.png にするため、拡張子まで含めてパラメータにする
export function generateStaticParams() {
  return getWorks().map((work) => ({ file: `${work.slug}.png` }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/og/works/[file]">,
) {
  const { file } = await params;
  const found = getWork(file.replace(/\.png$/, ""));
  if (!found) return new Response(null, { status: 404 });
  return renderWorkImage(found.work);
}
