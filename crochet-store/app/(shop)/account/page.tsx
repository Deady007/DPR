import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign in — optional",
  description:
    "Signing in adds queue visibility, drop alerts, custom order threads and reorder. Browsing and checkout work without it.",
};

/**
 * Auth is a privilege, not a gate.
 *
 * This page never stands between someone and the catalogue or checkout. It
 * states the four things an account adds and offers phone OTP or Google.
 *
 * NOT WIRED: no provider yet. Phone OTP needs an SMS sender and a rate-limited
 * verify route; Google needs OAuth credentials and a callback.
 */
const UNLOCKS = [
  {
    title: "Your place in the queue",
    detail:
      "See where your piece sits and how the lead time is moving, rather than waiting for a message.",
  },
  {
    title: "Drop alerts on a colourway",
    detail:
      "A dye lot closes without warning. Get told when that colourway is wound again — if it ever is.",
  },
  {
    title: "Custom requests in one thread",
    detail:
      "Keep the back-and-forth about a commission together, with the chart and photos attached.",
  },
  {
    title: "Order history and reorder",
    detail:
      "Re-make something you already own, in the same lot if it is still going.",
  },
];

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl sm:text-3xl">Sign in, if it helps</h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
        You never need an account to look or to buy. It adds four things, and
        that is all it does.
      </p>

      <ul className="mt-8 grid gap-px bg-gridline">
        {UNLOCKS.map((u, i) => (
          <li key={u.title} className="bg-background p-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[0.625rem] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-base">{u.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {u.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-3 border-t border-gridline pt-6">
        <label className="grid gap-1.5">
          <span className="text-sm">Phone number</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+91"
            className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        </label>
        <Button size="lg" disabled>
          Send code — not yet connected
        </Button>
        <Button size="lg" variant="outline" disabled>
          Continue with Google — not yet connected
        </Button>
        <p className="stitch-line">
          No auth provider wired. Phone OTP needs an SMS sender and a
          rate-limited verify route; Google needs OAuth credentials.
        </p>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Would rather not?{" "}
        <Link
          href="/store"
          className="underline decoration-1 underline-offset-2"
        >
          Carry on to the chart
        </Link>
        .
      </p>
    </main>
  );
}
