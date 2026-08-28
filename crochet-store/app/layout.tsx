import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Martian_Mono,
} from "next/font/google";
import "./globals.css";

/* Display. The variable width axis reads like yarn tension — used with restraint. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

/* Body. */
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

/* Data. Specs, counts, lead times. */
const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crochet Store — handmade pins, bows and amigurumi",
  description:
    "Handmade crochet, mostly made to order. Pins, bows and amigurumi toys, worked by hand in India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${martian.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
