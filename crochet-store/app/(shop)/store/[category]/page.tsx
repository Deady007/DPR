import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreGrid } from "@/components/store-grid";
import { CATEGORIES, byCategory, type Category } from "@/lib/products";

type Params = { category: string };

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

function parse(value: string): Category | null {
  return (CATEGORIES as string[]).includes(value) ? (value as Category) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = parse(category);
  if (!c) return {};
  return {
    title: `${c[0].toUpperCase()}${c.slice(1)} — handmade to order`,
    description: `Crochet ${c}, each with its hook size, fibre, stitch count and hours logged.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const c = parse(category);
  if (!c) notFound();

  const items = byCategory(c);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gridline pb-4">
        <h1 className="text-2xl capitalize sm:text-3xl">{c}</h1>
        <p className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase tabular-nums text-muted-foreground">
          {items.length} pieces
        </p>
      </header>

      <StoreGrid products={items} />
    </main>
  );
}
