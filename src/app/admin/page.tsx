import { requireAdmin } from "@/lib/admin-auth";
import { getHours } from "@/lib/hours-store";
import HoursManager from "@/components/admin/HoursManager";

export default async function AdminPage() {
  await requireAdmin();
  return <HoursManager initial={await getHours()} now={new Date().toISOString()} />;
}
