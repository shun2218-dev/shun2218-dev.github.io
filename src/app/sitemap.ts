import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getWorks } from "@/lib/works";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    ...getWorks().map((work) => ({ url: `${site.url}/works/${work.slug}/` })),
  ];
}
