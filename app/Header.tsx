import Link from "next/link";
import { useTranslations } from "next-intl";
import { HeartIcon, SearchIcon, ChatIcon } from "@wheewise/ui";
import { LocationPicker } from "./LocationPicker";
import { AllCategoriesMenu } from "./AllCategoriesMenu";
import { LoginButton } from "./LoginButton";
import { AnimatedSearchPlaceholder } from "./AnimatedSearchPlaceholder";
import { AccountMenu } from "./AccountMenu";
import { NotificationsMenu } from "./NotificationsMenu";

const CATEGORIES = [
  { value: "CAR", labelKey: "cars" },
  { value: "BIKE", labelKey: "bikes" },
  { value: "COMMERCIAL", labelKey: "commercial" },
  { value: "TAXI", labelKey: "taxi" },
  { value: "LEASE", labelKey: "lease" },
] as const;

// Rendered for everything that isn't a real phone device (see
// lib/device.ts, used from layout.tsx) — tablets included, since they have
// the width for it. Not a CSS breakpoint: resizing a desktop browser
// window must never swap this out for CompactHeader.
export function Header({
  isAuthenticated,
  avatarUrl,
}: {
  isAuthenticated: boolean;
  avatarUrl: string | null;
}) {
  const t = useTranslations("nav");
  const tCategories = useTranslations("categories");
  return (
    <header className="border-b border-border-default">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-header.webp" alt="Wheewise" className="h-8 w-auto" />
        </Link>

        <LocationPicker />

        <form action="/browse" className="relative min-w-0 flex-1">
          <input
            type="search"
            name="q"
            placeholder=" "
            className="peer min-w-0 w-full rounded-full border border-border-default py-2.5 pr-12 pl-4 text-sm outline-none focus:border-brand"
          />
          <AnimatedSearchPlaceholder className="left-4" />
          <button
            type="submit"
            aria-label="Search"
            className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center justify-center rounded-full bg-brand p-2 text-white hover:bg-brand-dark"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link
                href="/wishlist"
                className="flex flex-col items-center gap-0.5 text-foreground hover:text-brand"
              >
                <HeartIcon className="h-5 w-5" />
                <span className="hidden text-xs font-medium sm:inline">{t("wishlist")}</span>
              </Link>
              <Link
                href="/enquiries"
                className="flex flex-col items-center gap-0.5 text-foreground hover:text-brand"
              >
                <ChatIcon className="h-5 w-5" />
                <span className="hidden text-xs font-medium sm:inline">{t("chat")}</span>
              </Link>
              <NotificationsMenu />
              <AccountMenu avatarUrl={avatarUrl} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex flex-col items-center gap-0.5 text-foreground hover:text-brand"
              >
                <HeartIcon className="h-5 w-5" />
                <span className="hidden text-xs font-medium sm:inline">{t("wishlist")}</span>
              </Link>
              <LoginButton />
            </>
          )}
        </div>
      </div>

      {/* relative so AllCategoriesMenu's mega-menu panel (inset-x-0) spans
          this nav's full width edge-to-edge, not just the trigger button —
          and stays outside the horizontally-scrollable pill strip, not
          clipped inside it. */}
      <nav className="relative flex items-center gap-2 border-t border-border-default px-4 py-2 sm:px-6">
        <AllCategoriesMenu />
        <div className="flex gap-2 overflow-x-auto">
          <Link
            href="/browse"
            className="shrink-0 rounded-full border border-border-default px-3 py-1 text-sm font-medium hover:bg-surface-muted"
          >
            {t("allVehicles")}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/browse?category=${c.value}`}
              className="shrink-0 rounded-full border border-border-default px-3 py-1 text-sm font-medium hover:bg-surface-muted"
            >
              {tCategories(c.labelKey)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
