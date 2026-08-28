import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

/** The store surface: a working chart. Chrome on, gridlines visible. */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
