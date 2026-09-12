"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "@wheewise/ui";
import { LocationPicker } from "./LocationPicker";
import { MobileMenu } from "./MobileMenu";
import { WishlistNavButton } from "./WishlistNavButton";
import { AnimatedSearchPlaceholder } from "./AnimatedSearchPlaceholder";

// Rendered only for real phone devices (see lib/device.ts, used from
// layout.tsx) — a hamburger drawer stands in for the desktop hover
// mega-menu (AllCategoriesMenu), which needs a pointer that hovers. Not a
// CSS breakpoint: resizing a desktop browser window must never swap this
// in, only an actual phone's User-Agent does.
export function CompactHeader({
  isAuthenticated,
  avatarUrl,
  name,
}: {
  isAuthenticated: boolean;
  avatarUrl: string | null;
  name: string | null;
}) {
  // Search/location/wishlist are the homepage's job — every other mobile
  // page (vehicle, browse, store, account pages…) has its own focused
  // layout where a repeated search bar and city picker are just clutter,
  // not something that page itself needs to offer.
  const isHomePage = usePathname() === "/";

  return (
    <header className="border-b border-border-default">
      <div className="flex items-center gap-3 px-4 py-3">
        <MobileMenu isAuthenticated={isAuthenticated} avatarUrl={avatarUrl} name={name} />
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-header.webp" alt="Wheewise" className="h-7 w-auto" />
        </Link>
        {isHomePage ? (
          <div className="ml-auto">
            <LocationPicker className="w-36" mobile />
          </div>
        ) : null}
      </div>

      {isHomePage ? (
        <div className="flex items-center gap-2 px-4 pb-3">
          <form action="/browse" className="relative min-w-0 flex-1">
            <button
              type="submit"
              aria-label="Search"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
            <input
              type="search"
              name="q"
              placeholder=" "
              className="peer w-full rounded-full border border-border-default py-2.5 pr-4 pl-9 text-sm outline-none focus:border-brand"
            />
            <AnimatedSearchPlaceholder className="left-9" />
          </form>
          <WishlistNavButton isAuthenticated={isAuthenticated} />
        </div>
      ) : null}
    </header>
  );
}
