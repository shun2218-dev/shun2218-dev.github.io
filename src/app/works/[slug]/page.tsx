import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/works/WorkDetail";
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
  return { title: found.work.title, description: found.work.lead };
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const found = getWork(slug);
  if (!found) notFound();
  return <WorkDetail work={found.work} next={found.next} />;
}
