import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/works/WorkDetail";
import { ogImage } from "@/lib/og/images";
import { getWork, getWorks } from "@/lib/works";

// static export のため、作品ファイルから生成したページ以外は 404 にする
export const dynamicParams = false;

export function generateStaticParams() {
  return getWorks().map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getWork(slug);
  if (!found) return {};
  const { work } = found;
  const image = `/og/works/${work.slug}.png`;
  return {
    title: work.title,
    description: work.lead,
    openGraph: {
      type: "article",
      title: work.title,
      description: work.lead,
      url: `/works/${work.slug}/`,
      images: [{ url: image, ...ogImage, alt: work.title }],
    },
    // openGraph と同じく、layout の画像を引き継がないよう作品の画像で上書きする
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const found = getWork(slug);
  if (!found) notFound();
  return <WorkDetail work={found.work} next={found.next} />;
}
