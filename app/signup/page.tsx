import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthLayout } from "../AuthLayout";
import { GoogleSignInButton } from "../GoogleSignInButton";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  const t = useTranslations("auth");
  return (
    <AuthLayout
      title={t("createAccount")}
      subtitle={t("signupSubtitle")}
      footer={
        <p className="text-center text-sm text-zinc-500">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        {/* Google skips straight to a real account — Supabase treats a new
            Google identity as signed-up and already-verified. It just
            never collects a phone number, so CompletePhoneModal asks for
            one right after, once the visitor lands back on the site. */}
        <GoogleSignInButton callbackUrl="/" />
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="h-px flex-1 bg-border-default" />
          {t("or")}
          <div className="h-px flex-1 bg-border-default" />
        </div>
        <SignupForm />
      </div>
    </AuthLayout>
  );
}
