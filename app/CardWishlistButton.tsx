"use client";

import { useState, useTransition } from "react";
import { HeartIcon } from "@wheewise/ui";
import { useLoginModal } from "./LoginModalProvider";
import { toggleWishlist } from "./vehicle/[slug]/actions";

export function CardWishlistButton({
  vehicleId,
  isAuthenticated,
  initialWishlisted,
}: {
  vehicleId: string;
  isAuthenticated: boolean;
  initialWishlisted: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();
  const { open } = useLoginModal();

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      disabled={pending}
      // preventDefault/stopPropagation — the card itself is a <Link>, this
      // button sits on top of it and must not trigger a navigation.
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          open();
          return;
        }
        const next = !wishlisted;
        setWishlisted(next);
        startTransition(() => toggleWishlist(vehicleId, wishlisted));
      }}
      className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-50"
    >
      <HeartIcon className={`h-4 w-4 ${wishlisted ? "fill-brand text-brand" : "text-zinc-500"}`} />
    </button>
  );
}
