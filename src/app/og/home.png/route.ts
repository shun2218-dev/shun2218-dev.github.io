import { renderHomeImage } from "@/lib/og/images";

export const dynamic = "force-static";

export function GET() {
  return renderHomeImage();
}
