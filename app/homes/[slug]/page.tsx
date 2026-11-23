import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "@/components/listing/ListingDetail";
import { brand, getListing, listings } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

// Only the listed homes exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return {};
  return {
    title: `${l.name}, ${l.area} — ${brand.name}`,
    description: `${l.summary} ${l.beds} bedrooms, ${l.size}, ${l.price}.`,
    openGraph: { images: [l.image] },
  };
}

export default async function HomePage({ params }: Props) {
  const { slug } = await params;
  const i = listings.findIndex((l) => l.slug === slug);
  if (i < 0) notFound();
  const next = listings[(i + 1) % listings.length];
  return <ListingDetail listing={listings[i]} next={next} />;
}
