"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@wheewise/ui";
import { useLoginModal } from "./LoginModalProvider";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const { close } = useLoginModal();

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-mark.webp" alt="" className="h-14 w-auto" />
      </div>
      <p className="text-center text-sm text-zinc-500">
        Sign in to enquire, save listings, and message dealers
      </p>

      <GoogleSignInButton callbackUrl="/" />

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <div className="h-px flex-1 bg-border-default" />
        OR
        <div className="h-px flex-1 bg-border-default" />
      </div>

      <Link
        href="/login"
        onClick={close}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-brand hover:underline"
      >
        Login with Email
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>

      <p className="text-center text-xs text-zinc-400">
        By continuing, you agree to Wheewise&apos;s Terms and Privacy Policy.
      </p>

      <p className="text-center text-sm text-zinc-500">
        New here?{" "}
        <Link href="/signup" onClick={close} className="font-medium text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
