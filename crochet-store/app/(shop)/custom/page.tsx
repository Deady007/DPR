import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORIES, materials } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ask for something specific",
  description:
    "Commission a crochet piece to your own colourway, size or chart. No account needed to ask.",
};

/**
 * Custom order request.
 *
 * Asking is public. The message thread that follows is one of the four things
 * signing in unlocks, so the form says so rather than blocking the form.
 *
 * NOT WIRED: submission has no destination yet.
 */
export default function CustomPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl sm:text-3xl">Ask for something specific</h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
        A different colourway, a size that isn&apos;t listed, or a chart of your
        own. Tell us what you want made and we&apos;ll come back with a lead
        time and a price.
      </p>

      <form className="mt-8 grid gap-6">
        <label className="grid gap-1.5">
          <span className="text-sm">What kind of piece</span>
          <select
            name="category"
            className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="other">something else</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm">Fibre you&apos;d prefer</span>
          <select
            name="fibre"
            className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {materials.map((m) => (
              <option key={m.fibre} value={m.fibre.toLowerCase()}>
                {m.fibre}
              </option>
            ))}
            <option value="unsure">not sure — advise me</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm">When you need it</span>
          <input
            type="date"
            name="needBy"
            className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
          <span className="stitch-line">
            Made-to-order runs 4 to 26 days depending on the piece.
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm">What you have in mind</span>
          <textarea
            name="brief"
            rows={5}
            className="border border-input bg-background px-3 py-2 text-sm leading-relaxed focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            placeholder="Colours, size, who it's for, anything you've seen that's close."
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm">Phone or email to reply to</span>
          <input
            type="text"
            name="contact"
            autoComplete="tel"
            className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        </label>

        <div className="border-t border-gridline pt-5">
          <Button size="lg" type="submit" disabled>
            Send the request — not yet connected
          </Button>
          <p className="stitch-line mt-3">
            Submission has no destination yet.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            You can ask without an account.{" "}
            <Link
              href="/account"
              className="underline decoration-1 underline-offset-2"
            >
              Signing in
            </Link>{" "}
            keeps the back-and-forth in one thread instead of over text.
          </p>
        </div>
      </form>
    </main>
  );
}
