"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/products";
import { useBag } from "@/lib/bag";
import { cn } from "@/lib/utils";

/**
 * Store chrome. Deliberately absent from the landing page, which carries no
 * cart, no filters and no search.
 *
 * "Sign in" sits beside the bag rather than in front of it — the catalogue and
 * checkout both work without an account.
 */
export function SiteHeader() {
  const { count } = useBag();
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gridline bg-background/95 backdrop-blur-[2px]">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          ← the front
        </Link>

        <nav className="flex items-center gap-3 border-l border-gridline pl-4">
          <Link
            href="/store"
            className={cn(
              "font-mono text-[0.6875rem] tracking-[0.1em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              path === "/store" ? "underline decoration-1 underline-offset-4" : "text-muted-foreground",
            )}
          >
            all
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/store/${c}`}
              className={cn(
                "font-mono text-[0.6875rem] tracking-[0.1em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                path === `/store/${c}`
                  ? "underline decoration-1 underline-offset-4"
                  : "text-muted-foreground",
              )}
            >
              {c}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/custom"
            className="hidden font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline"
          >
            custom
          </Link>
          <Link
            href="/account"
            className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            sign in
          </Link>
          <Link
            href="/bag"
            className="border border-gridline px-2 py-1 font-mono text-[0.6875rem] tracking-[0.1em] uppercase tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            bag {count}
          </Link>
        </div>
      </div>
    </header>
  );
}
