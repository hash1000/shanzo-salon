export const dynamic = "force-dynamic";

import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/admin-session";

export default function LoginPage() {
  return (
    <div className="admin-login">
      <p className="about-label">Shanzo Salon · Owner access</p>
      <h1>Walk-in Hours Manager</h1>
      <p className="my-5">Sign in to update Hair and Nails walk-in availability.</p>
      {!adminConfigured() && <p className="admin-error" role="alert">Admin access needs server configuration. Set ADMIN_EMAIL, ADMIN_PASSWORD and a random SESSION_SECRET of at least 32 characters. Replace example values and restart the server.</p>}
      <LoginForm />
    </div>
  );
}
