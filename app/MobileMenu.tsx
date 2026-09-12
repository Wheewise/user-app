"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  CloseIcon,
  MenuIcon,
  SearchIcon,
  HeartIcon,
  ChatIcon,
  UserIcon,
  StoreIcon,
  HelpIcon,
  BellIcon,
  GlobeIcon,
  SettingsIcon,
} from "@wheewise/ui";
import { HeaderSignOut } from "./HeaderSignOut";
import { LanguageModal } from "./LanguageModal";
import { useLoginModal } from "./LoginModalProvider";

const LINKS = [
  { labelKey: "browse", href: "/browse", icon: SearchIcon, gated: false },
  { labelKey: "wishlist", href: "/wishlist", icon: HeartIcon, gated: true },
  // "Chat" — messaging happens inside an enquiry thread, so this is the
  // same feature as "My enquiries" was, just under the name the reference
  // design uses.
  { labelKey: "chat", href: "/enquiries", icon: ChatIcon, gated: true },
] as const;

const SUPPORT_LINKS = [{ labelKey: "help", href: "/help", icon: HelpIcon }] as const;

// Account-specific, so only worth showing once signed in — a logged-out
// visitor gets neither a real destination (these need an account) nor a
// "Soon" row for something they can't use yet either way.
const ACCOUNT_LINKS = [
  { labelKey: "notifications", href: "/notifications", icon: BellIcon },
  { labelKey: "settings", href: "/settings", icon: SettingsIcon },
] as const;

// The hamburger opens a full-screen panel (not a small dropdown) — account
// and app-level actions, mobile/tablet only. Category browsing already has
// two homes (the homepage icon grid, the desktop hover mega-menu) so this
// doesn't repeat it, matching how the reference app splits the two.
export function MobileMenu({
  isAuthenticated,
  avatarUrl,
  name,
}: {
  isAuthenticated: boolean;
  avatarUrl: string | null;
  name: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { open: openLogin } = useLoginModal();
  const close = () => setOpen(false);
  const t = useTranslations("nav");

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu"
        className="flex items-center justify-center text-foreground"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
            <button type="button" onClick={close} aria-label="Close" className="text-foreground">
              <CloseIcon className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-header.webp" alt="Wheewise" className="h-7 w-auto" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isAuthenticated ? (
              <div className="px-4 py-5">
                <p className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">My account</p>
                <div className="flex items-center gap-3 rounded-lg border border-border-default px-3 py-3">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Google-hosted URL, not a local asset next/image can optimize
                    <img src={avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-zinc-400">
                      <UserIcon className="h-5 w-5" />
                    </span>
                  )}
                  <p className="min-w-0 flex-1 truncate font-semibold">{name ?? "Wheewise user"}</p>
                  <Link
                    href="/settings/profile"
                    onClick={close}
                    className="shrink-0 text-xs font-medium text-brand hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-zinc-400">
                    <UserIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-semibold">Welcome to Wheewise!</p>
                    <p className="text-sm text-zinc-500">Find your next car, bike, or commercial vehicle.</p>
                  </div>
                </div>
                <div className="px-4 pb-5">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      openLogin();
                    }}
                    className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    {t("login")}
                  </button>
                </div>
              </>
            )}

            <div className="border-t border-border-default">
              {LINKS.map((l) => (
                <Link
                  key={l.labelKey}
                  href={l.gated && !isAuthenticated ? "/login" : l.href}
                  onClick={close}
                  className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
                >
                  <l.icon className="h-5 w-5 text-zinc-500" />
                  {t(l.labelKey)}
                </Link>
              ))}
              {/* Dealer signup/storefront creation lives entirely in the
                  separate dealer.wheewise.com app — plain cross-origin link,
                  not a Next <Link>, matching the Footer's external-link
                  precedent. */}
              <a
                href="https://dealer.wheewise.com/signup"
                className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
              >
                <StoreIcon className="h-5 w-5 text-zinc-500" />
                {t("becomeDealer")}
              </a>
            </div>

            <div className="border-t border-border-default">
              {SUPPORT_LINKS.map((l) => (
                <Link
                  key={l.labelKey}
                  href={l.href}
                  onClick={close}
                  className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
                >
                  <l.icon className="h-5 w-5 text-zinc-500" />
                  {t(l.labelKey)}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setLanguageOpen(true)}
                className="flex w-full items-center gap-3 border-b border-border-default px-4 py-3.5 text-left text-sm font-medium hover:bg-surface-muted"
              >
                <GlobeIcon className="h-5 w-5 text-zinc-500" />
                {t("selectLanguage")}
              </button>
              {isAuthenticated
                ? ACCOUNT_LINKS.map((l) => (
                    <Link
                      key={l.labelKey}
                      href={l.href}
                      onClick={close}
                      className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium hover:bg-surface-muted"
                    >
                      <l.icon className="h-5 w-5 text-zinc-500" />
                      {t(l.labelKey)}
                    </Link>
                  ))
                : null}
              {isAuthenticated ? (
                <div className="px-4 py-3.5">
                  <HeaderSignOut className="text-sm font-medium text-zinc-500 hover:text-brand disabled:opacity-50" />
                </div>
              ) : null}
            </div>
          </div>

          <a href="#get-app" onClick={close} className="flex items-center gap-3 bg-surface-muted px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-mark.webp" alt="" className="h-8 w-8 shrink-0" />
            <span className="min-w-0 flex-1 text-sm font-medium">
              For a better buying and selling experience
            </span>
            <span className="shrink-0 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white">
              View app
            </span>
          </a>
        </div>
      ) : null}
      <LanguageModal open={languageOpen} onClose={() => setLanguageOpen(false)} />
    </div>
  );
}
