import Link from "next/link";
import { HeroDoor } from "@/components/hero-door";
import { ProofOfSlowness } from "@/components/proof-of-slowness";
import { RowReveal } from "@/components/row-reveal";
import { ShelfPiece } from "@/components/shelf-piece";
import { buttonVariants } from "@/components/ui/button";
import { makers, materials, shelf } from "@/lib/products";

/**
 * The landing page. Editorial: no cart, no filters, no search.
 *
 * Sections reveal in alternating directions, the way rows are worked.
 */
export default function Home() {
  return (
    <main className="flex-1">
      {/* 1 — hero, self-building bow, one line of copy, the door */}
      <HeroDoor />

      {/* 2 — the shelf: four pieces, not a catalogue */}
      <RowReveal row={0}>
        <section className="mx-auto w-full max-w-6xl border-t border-gridline px-4 py-20 sm:px-6">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl">On the shelf</h2>
            <p className="max-w-xs font-mono text-[0.6875rem] leading-relaxed tracking-[0.08em] uppercase text-muted-foreground">
              four pieces, finished
            </p>
          </header>

          <div className="grid gap-px bg-gridline sm:grid-cols-2 lg:grid-cols-4">
            {shelf.map((p) => (
              <ShelfPiece key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </RowReveal>

      {/* 3 — the makers */}
      <RowReveal row={1}>
        <section className="mx-auto w-full max-w-6xl border-t border-gridline px-4 py-20 sm:px-6">
          <header className="mb-8">
            <h2 className="text-2xl sm:text-3xl">Three pairs of hands</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Every piece is made by one person from first chain to last. Their
              hook size is a preference, not an assignment.
            </p>
          </header>

          <ul className="grid gap-px bg-gridline sm:grid-cols-3">
            {makers.map((m) => (
              <li key={m.name} className="bg-background p-5">
                <h3 className="text-xl">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Specialises in {m.specialises}.
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-px border border-gridline bg-gridline font-mono text-[0.6875rem]">
                  <div className="bg-background p-2">
                    <dt className="text-muted-foreground">Hook</dt>
                    <dd className="tabular-nums">{m.hookMm.toFixed(1)}mm</dd>
                  </div>
                  <div className="bg-background p-2">
                    <dt className="text-muted-foreground">Hours</dt>
                    <dd className="tabular-nums">
                      {m.hoursLogged.toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>
                <p className="stitch-line mt-3">{m.atWork}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[0.625rem] text-muted-foreground">
            Photographs of hands at work pending — the lines above describe the
            frames to be shot.
          </p>
        </section>
      </RowReveal>

      {/* 4 — proof of slowness */}
      <ProofOfSlowness />

      {/* 5 — materials */}
      <RowReveal row={1}>
        <section className="mx-auto w-full max-w-6xl border-t border-gridline px-4 py-20 sm:px-6">
          <header className="mb-8">
            <h2 className="text-2xl sm:text-3xl">What it is made of</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Three fibres, bought in small lots. When a lot is finished, the
              colourway it made closes.
            </p>
          </header>

          <ul className="grid gap-px bg-gridline sm:grid-cols-3">
            {materials.map((m) => (
              <li key={m.fibre} className="bg-background p-5">
                <h3 className="text-lg">{m.fibre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.detail}
                </p>
                <p className="stitch-line mt-4">{m.sourcing}</p>
              </li>
            ))}
          </ul>
        </section>
      </RowReveal>

      {/* 6 — the door again */}
      <section className="mx-auto w-full max-w-6xl border-t border-gridline px-4 py-24 text-center sm:px-6">
        <h2 className="text-2xl sm:text-3xl">The chart is open</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Twelve pieces, each with its hook, fibre, stitch count and the hours it
          took. Checkout works without an account.
        </p>
        <Link
          href="/store"
          className={`${buttonVariants({ size: "lg" })} mt-8 px-4`}
        >
          Enter the workroom
        </Link>
      </section>
    </main>
  );
}
