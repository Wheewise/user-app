import { AuthLayout } from "../AuthLayout";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
