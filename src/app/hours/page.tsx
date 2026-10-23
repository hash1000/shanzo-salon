import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import HoursEntrance from "@/components/hours/HoursEntrance";
import { WALK_IN_BOOKING_URL, WALK_IN_PHONE } from "@/data/walk-in-hours";
import { SITE_NAME } from "@/lib/site";
import { getHours } from "@/lib/hours-store";
import HoursCards from "@/components/hours/HoursCards";
import "./hours.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: `Walk-in Hours | ${SITE_NAME}`,
  description: "Today's live Hair and Nails walk-in availability at Shanzo Salon, in Chicago local time.",
  robots: { index: false },
};

async function LiveHours() {
  const config = await getHours();
  const now = new Date().toISOString();
  const updated = new Intl.DateTimeFormat("en-US", {
    timeZone: config.timezone, dateStyle: "medium", timeStyle: "short",
  }).format(new Date(config.lastUpdated));

  return (
    <HoursEntrance>
      <header className="walk-heading">
        <p className="about-label">{SITE_NAME}</p>
        <h1>Walk-in Hours</h1>
        <p className="mt-4">Last updated: <time dateTime={config.lastUpdated}>{updated}</time></p>
        <p className="mt-1">All times are Chicago local time.</p>
      </header>
      {config.announcement?.trim() && <aside aria-label="Walk-in announcement" className="walk-announcement">{config.announcement}</aside>}
      <HoursCards config={config} now={now} />
      <div className="py-8 text-center">
        <p>Hours may change based on staff availability</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={WALK_IN_BOOKING_URL} className="about-button about-button-dark">Book online <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href={`tel:${WALK_IN_PHONE}`} className="about-button about-button-outline">Call us <Phone size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </HoursEntrance>
  );
}

export default function HoursPage() {
  return (
    <SiteShell>
      <div className="about-wrap walk-hours">
        <Suspense fallback={<p className="py-12" role="status">Loading current walk-in hours…</p>}>
          <LiveHours />
        </Suspense>
      </div>
    </SiteShell>
  );
}
