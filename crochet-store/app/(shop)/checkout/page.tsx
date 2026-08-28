"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBag } from "@/lib/bag";
import { priceLabel } from "@/lib/products";

/**
 * Guest checkout. No account, ever, as a condition of buying.
 *
 * NOT WIRED: payment and shipping are stubs. Razorpay/UPI needs a key and an
 * order-creation route; Shiprocket needs a serviceability call against the
 * pincode. Both are marked at the point they belong.
 */
export default function CheckoutPage() {
  const { lines, totalInr } = useBag();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl sm:text-3xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        As a guest. Nothing here asks you to make an account.
      </p>

      {lines.length === 0 ? (
        <p className="mt-8 border border-gridline p-6 text-sm">
          The bag is empty.{" "}
          <Link
            href="/store"
            className="underline decoration-1 underline-offset-2"
          >
            Open the chart
          </Link>
          .
        </p>
      ) : (
        <form
          className="mt-8 grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <fieldset className="grid gap-3">
            <legend className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-muted-foreground">
              Where it goes
            </legend>
            {[
              { id: "name", label: "Name", type: "text", auto: "name" },
              { id: "phone", label: "Phone", type: "tel", auto: "tel" },
              {
                id: "address",
                label: "Address",
                type: "text",
                auto: "street-address",
              },
              {
                id: "pincode",
                label: "Pincode",
                type: "text",
                auto: "postal-code",
              },
            ].map((f) => (
              <label key={f.id} className="grid gap-1.5">
                <span className="text-sm">{f.label}</span>
                <input
                  id={f.id}
                  name={f.id}
                  type={f.type}
                  autoComplete={f.auto}
                  required
                  className="border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                />
              </label>
            ))}
            <p className="stitch-line">
              Shiprocket serviceability check not wired — pincode is collected
              but not yet validated.
            </p>
          </fieldset>

          <fieldset className="grid gap-2 border-t border-gridline pt-5">
            <legend className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-muted-foreground">
              How you pay
            </legend>
            <p className="text-sm text-muted-foreground">
              UPI and cards, through Razorpay.
            </p>
            <p className="stitch-line">
              Razorpay not wired — needs a key and an order route before this
              button can charge anything.
            </p>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gridline pt-5">
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.1em] uppercase text-muted-foreground">
                to pay
              </p>
              <p className="font-mono text-xl tabular-nums">
                {priceLabel(totalInr)}
              </p>
            </div>
            <Button size="lg" type="submit" disabled>
              Pay — not yet connected
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
