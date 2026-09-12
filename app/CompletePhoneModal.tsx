"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CloseIcon } from "@wheewise/ui";
import { savePhone } from "./profile-actions";

// Google sign-in never collects a phone number — /auth/callback flags that
// with ?needsPhone=1 on redirect, and this asks for it once, right after.
// Dismissible, not forced: skipping just means asking again next time
// needsPhone comes back true (e.g. their next Google sign-in redirect).
export function CompletePhoneModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (searchParams.get("needsPhone") === "1") setOpen(true);
  }, [searchParams]);

  const dismiss = useCallback(() => {
    setOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete("needsPhone");
    router.replace(params.size ? `${pathname}?${params}` : pathname);
  }, [router, pathname, searchParams]);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setPending(true);
      setError("");
      const result = await savePhone(phone);
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      dismiss();
      router.refresh();
    },
    [phone, dismiss, router],
  );

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-background px-6 pt-6 pb-8">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="self-end text-foreground hover:text-zinc-500"
      >
        <CloseIcon className="h-6 w-6" />
      </button>

      <h2 className="mt-6 text-3xl leading-tight font-bold text-foreground">What&apos;s your phone number?</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Dealers use this to reach you about your enquiries — we&apos;ll never share it without your say-so.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-1 flex-col">
        <div className="flex items-center rounded-lg border border-border-default focus-within:border-brand">
          <span className="shrink-0 border-r border-border-default px-3 py-3 text-sm text-zinc-400">+91</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            autoComplete="tel"
            required
            autoFocus
            className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
          />
        </div>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-auto w-full rounded-md bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
