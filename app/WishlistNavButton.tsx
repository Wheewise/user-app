"use client";

import Link from "next/link";
import { HeartIcon } from "@wheewise/ui";
import { useLoginModal } from "./LoginModalProvider";

const CLASSES =
  "flex shrink-0 items-center justify-center rounded-full border border-border-default p-2.5 text-foreground hover:border-brand hover:text-brand";

export function WishlistNavButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { open } = useLoginModal();

  if (isAuthenticated) {
    return (
      <Link href="/wishlist" aria-label="Wishlist" className={CLASSES}>
        <HeartIcon className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => open()} aria-label="Wishlist" className={CLASSES}>
      <HeartIcon className="h-5 w-5" />
    </button>
  );
}
