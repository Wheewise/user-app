"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "./locale-actions";
import { locales, type Locale } from "../i18n/locales";

export function LanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  const choose = (next: Locale) => {
    onClose();
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="mb-0 w-full max-w-sm rounded-t-2xl border border-border-default bg-background p-5 pb-8 shadow-xl sm:mb-auto sm:rounded-2xl sm:pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t("chooseLanguage")}</h2>
        <div className="space-y-1">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => choose(l)}
              disabled={pending}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                l === locale ? "bg-brand/10 text-brand" : "text-foreground hover:bg-surface-muted"
              }`}
            >
              {t(l)}
              {l === locale ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
