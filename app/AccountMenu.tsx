"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UserIcon } from "@wheewise/ui";
import { useClickOutside } from "./useClickOutside";
import { LanguageModal } from "./LanguageModal";

export function AccountMenu({ avatarUrl }: { avatarUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useClickOutside(ref, open, close);
  const t = useTranslations("nav");

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Account menu">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Google-hosted URL, not a local asset next/image can optimize
          <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-zinc-400">
            <UserIcon className="h-4 w-4" />
          </span>
        )}
      </button>

      {open ? (
        <div className="absolute top-full right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border-default bg-background py-1.5 shadow-lg">
          <Link
            href="/settings/profile"
            onClick={close}
            className="block px-4 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            {t("editProfile")}
          </Link>
          <Link href="/help" onClick={close} className="block px-4 py-2 text-sm font-medium hover:bg-surface-muted">
            {t("help")}
          </Link>
          <button
            type="button"
            onClick={() => {
              close();
              setLanguageOpen(true);
            }}
            className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted"
          >
            {t("selectLanguage")}
          </button>
          <a
            href="#get-app"
            onClick={close}
            className="block px-4 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            {t("installApp")}
          </a>
        </div>
      ) : null}
      <LanguageModal open={languageOpen} onClose={() => setLanguageOpen(false)} />
    </div>
  );
}
