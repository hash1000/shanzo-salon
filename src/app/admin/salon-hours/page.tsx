import type { Metadata } from "next";
import "./salon-admin.css";
import { requireAdmin } from "@/lib/admin-auth";
import { getSalonHours } from "@/lib/salon-hours-store";
import SalonHoursManager from "@/components/admin/SalonHoursManager";

export const metadata: Metadata = {
  title: "Salon Opening Hours | Shanzo Salon",
};
export default async function SalonHoursAdminPage() {
  await requireAdmin();
  return (
    <SalonHoursManager
      initial={await getSalonHours()}
      now={new Date().toISOString()}
    />
  );
}
