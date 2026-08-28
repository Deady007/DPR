@AGENTS.md

# Crochet Store — Project Brief

Handmade crochet e-commerce. Pins, bows, amigurumi toys. Small own-brand,
India, Instagram-led traffic, mostly made-to-order.

Read this before writing any UI. Also read
`/mnt/skills/public/frontend-design/SKILL.md` and run the frontend-master
preflight before installing components.

---

## Architecture: two surfaces, one door

**Surface 1 — Landing (`/`).** Editorial. Makes a stranger want in. No cart,
no filters, no search.

**The door.** Labelled "Enter the workroom". Public — no login required.
Guest checkout stays available everywhere.

**Surface 2 — Store (`/store` and below).** Working chart. Tight grid,
visible hairline gridlines, mono-heavy.

### Login is a privilege, not a gate

Do NOT put auth in front of the catalogue. It kills Instagram traffic and
hides every product from search. Login unlocks only:

- Made-to-order queue slots and lead-time visibility
- Restock / drop alerts on a colourway
- Custom order requests with a message thread
- Order history and reorder

Auth: phone OTP (India) + Google. Guest checkout always available.

---

## Design tokens

### Colour — exactly these five, no others

| Token | Hex | Name | Use |
|---|---|---|---|
| `--ground` | `#F1EFF4` | Blocking Mat | background, cool grey-lilac |
| `--ink` | `#221C2A` | Deep Skein | all text |
| `--primary` | `#1F7A6B` | Merino Teal | primary actions |
| `--accent` | `#E8548A` | Bubblegum Acrylic | accent, category code |
| `--data` | `#F0B429` | Mustard 4-ply | data and utility only |

Accents code the three categories. No gradients anywhere.

**Explicitly rejected:** cream `#F4F1EA` grounds, serif display faces, and
terracotta/clay accents near `#D97757`. That combination is the default
AI-generated craft-store look. Do not drift back toward it.

### Type

- Display: **Bricolage Grotesque** — use the variable width axis, it reads
  like yarn tension. Used with restraint.
- Body: **Instrument Sans**
- Data: **Martian Mono** — all specs, counts, lead times

### Signature: the stitch line

Every product carries real craft data in mono:

```
4.0mm hook · cotton 8-ply · 2,140 sts · 6h 40m · 1 of 3
```

Hero is a bow drawn as a graphgan pixel grid that crochets itself in on
load, one row at a time. This is the one bold element. Everything around it
stays quiet.

### Motion concept

Crochet works in rows that alternate direction, so section reveals enter
left-to-right, then right-to-left. Layout is a square stitch grid,
pixel-snapped. No soft floaty cards.

**The door transition is the signature moment.** Clicking the door zooms the
hero's stitch grid; each cell expands into a product tile, so the catalogue
emerges from the fabric of the hero. One shared-element layout animation.
Transform and opacity only. Under `prefers-reduced-motion`, skip the
animation and just route.

---

## Landing page sections, in order

1. **Hero** — self-building pixel bow, one line of copy, the door
2. **The shelf** — 4 premium pieces only, large, full stitch line, price.
   Not a catalogue.
3. **The makers** — real names, hands at work not headshots, preferred hook
   size, hours logged, what each specialises in
4. **Proof of slowness** — one piece built row by row, `2,140 sts · 6h 40m`
5. **Materials** — yarn, fibre, sourcing
6. **The door again**

---

## Stack

- Next.js App Router + Tailwind
- Primitives: `@shadcn` only. One source, never two dialog implementations.
- Blocks: **none.** The pixel-grid direction is more than 60% off-brief for
  every block registry. Hand-build the sections.
- Motion: motion.dev. Transform and opacity only, 60fps budget,
  `prefers-reduced-motion` honoured.
- Commerce: headless Shopify Storefront API, Razorpay/UPI, Shiprocket

### Routes

```
/                    landing
/store               all products
/store/[category]    pins | bows | toys
/product/[slug]      PDP
/bag                 cart (call it "Project bag")
/checkout
/custom              custom order request
/account
```

Vernacular: cart is a **project bag**, shop entry is **enter the workroom**.

---

## Three domain rules that shape the data model

1. **One-of-one breaks normal inventory.** Needs a lead-time badge and a
   queue count, not "In stock".
2. **Variant = colourway,** tied to yarn physically in hand. A variant goes
   out of stock when the dye lot does.
3. **Toys need a safety line on the PDP:** small parts, under-3, safety eyes
   vs embroidered. Non-negotiable.

---

## Build ladder

Do these in order. Stop after each one.

1. `npx create-next-app@latest crochet-store` — accept every default
2. Run the frontend-master preflight:
   `bash scripts/setup-frontend-stack.sh` then
   `bash scripts/verify-registries.sh`
3. Put the 5 colours and 3 fonts into `globals.css` as tokens
4. Build ONE product card, real data, one real bow
5. Duplicate to a 12-cell grid
6. Add the row-by-row reveal
7. Wire the PDP for that one bow
8. Landing page sections
9. The door transition
10. Commerce and auth last

## Quality floor

Responsive to mobile. Visible keyboard focus. Reduced motion respected.
Real content, never lorem. Every colour and size derived from the tokens
above, never ad-hoc.
