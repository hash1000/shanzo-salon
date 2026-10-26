import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="admin-login">
      <p className="about-label">Shanzo Salon · Owner access</p>
      <h1>Walk-in Hours Manager</h1>
      <p className="my-5">
        Sign in to update Hair and Nails walk-in availability.
      </p>

      <LoginForm />
    </div>
  );
}