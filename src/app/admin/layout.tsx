import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../hours/hours.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Walk-in Hours Manager | Shanzo Salon",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="about-luxury admin-shell"><div className="about-wrap admin-wrap">{children}</div></main>;
}
