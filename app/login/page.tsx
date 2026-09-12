import { Suspense } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AuthLayout } from "../AuthLayout";
import { LoginPageForm } from "./LoginPageForm";

export default function LoginPage() {
  const t = useTranslations("auth");
  return (
    <AuthLayout
      footer={
        <p className="text-center text-sm text-zinc-400">
          {t("newHere")}{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            {t("createAccount")}
          </Link>
        </p>
      }
    >
      <Suspense>
        <LoginPageForm />
      </Suspense>
    </AuthLayout>
  );
}
