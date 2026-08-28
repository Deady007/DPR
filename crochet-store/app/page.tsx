import Link from "next/link";
import { CraftMarquee } from "@/components/craft-marquee";
import { CursorRing } from "@/components/cursor-ring";
import { HeroDoor } from "@/components/hero-door";
import { RowReveal } from "@/components/row-reveal";
import { ShelfRow } from "@/components/shelf-row";
import { SmoothScroll } from "@/components/smooth-scroll";
import { UnravelSection } from "@/components/unravel-section";
import { YarnCanvas } from "@/components/yarn-canvas";
import { makers, materials, shelf } from "@/lib/products";

/**
 * The landing page.
 *
 * The strand is the spine: it is visible in the hero and again through the
 * unravel section, and veiled behind the sections you actually read. Sections
 * still enter in alternating directions, the way rows are worked.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <CursorRing />
      <YarnCanvas />

      <main className="relative z-10 grain">
        <HeroDoor />

        {/* ── read block one ─────────────────────────────────────────────── */}
        <div className="relative">
          {/* the handoff from open canvas to reading surface */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[22vh] h-[22vh]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--background))",
            }}
          />

          <div className="bg-background">
            <CraftMarquee />

            <RowReveal row={0}>
              <section className="px-5 py-28 sm:px-10">
                <header className="mb-14 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="label">the shelf</p>
                    <h2 className="display mt-4 text-4xl sm:text-6xl">
                      Four finished
                      <br />
                      pieces.
                    </h2>
                  </div>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Not a catalogue. Hover one and the strand takes its
                    colourway.
                  </p>
                </header>

                <div>
                  {shelf.map((p, i) => (
                    <ShelfRow key={p.slug} product={p} index={i} />
                  ))}
                </div>
              </section>
            </RowReveal>
          </div>
        </div>

        {/* ── the strand returns ─────────────────────────────────────────── */}
        <UnravelSection />

        {/* ── read block two ─────────────────────────────────────────────── */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[22vh] h-[22vh]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--background))",
            }}
          />

          <div className="bg-background">
            <RowReveal row={1}>
              <section className="border-t border-gridline px-5 py-28 sm:px-10">
                <p className="label">the makers</p>
                <h2 className="display mt-4 mb-14 text-4xl sm:text-6xl">
                  Three pairs
                  <br />
                  of hands.
                </h2>

                <ul>
                  {makers.map((m, i) => (
                    <li
                      key={m.name}
                      className="group border-b border-gridline py-7"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                        <span className="label w-8 shrink-0 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="flex-1 text-3xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-4xl">
                          {m.name}
                        </h3>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {m.hookMm.toFixed(1)}mm ·{" "}
                          {m.hoursLogged.toLocaleString("en-IN")}h
                        </span>
                      </div>
                      <div className="grid grid-rows-[0fr] pl-14 transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                            Specialises in {m.specialises}.
                          </p>
                          <p className="stitch-line pt-2">{m.atWork}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="stitch-line mt-6">
                  photographs of hands at work pending
                </p>
              </section>
            </RowReveal>

            <RowReveal row={0}>
              <section className="border-t border-gridline px-5 py-28 sm:px-10">
                <p className="label">materials</p>
                <h2 className="display mt-4 mb-14 text-4xl sm:text-6xl">
                  Three fibres,
                  <br />
                  small lots.
                </h2>

                <dl className="grid gap-px bg-gridline sm:grid-cols-3">
                  {materials.map((m) => (
                    <div key={m.fibre} className="bg-background p-6">
                      <dt className="text-2xl">{m.fibre}</dt>
                      <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {m.detail}
                      </dd>
                      <dd className="stitch-line mt-5">{m.sourcing}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </RowReveal>

            {/* ── the door, again ───────────────────────────────────────── */}
            <section className="border-t border-gridline px-5 py-32 text-center sm:px-10">
              <p className="label">the chart is open</p>
              <h2 className="display mx-auto mt-5 max-w-3xl text-4xl sm:text-6xl">
                Twelve pieces,
                <br />
                every one counted.
              </h2>

              <Link
                href="/store"
                className="group relative mt-10 inline-block overflow-hidden border border-border px-8 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="relative font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-300 group-hover:text-void group-focus-visible:text-void">
                  Enter the workroom
                </span>
              </Link>

              <p className="label mt-6">guest checkout · made to order</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
