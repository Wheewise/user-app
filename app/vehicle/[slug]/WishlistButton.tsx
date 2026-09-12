"use client";

import { useState, useTransition } from "react";
import { HeartIcon } from "@wheewise/ui";
import { useLoginModal } from "../../LoginModalProvider";
import { toggleWishlist } from "./actions";

// Small circular button overlaid on the image gallery's corner.
export function WishlistButton({
  vehicleId,
  initialWishlisted,
  isAuthenticated,
}: {
  vehicleId: string;
  initialWishlisted: boolean;
  isAuthenticated: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();
  const { open } = useLoginModal();

  const toggle = () => {
    if (!isAuthenticated) {
      open();
      return;
    }
    const next = !wishlisted;
    setWishlisted(next);
    startTransition(() => toggleWishlist(vehicleId, wishlisted));
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={toggle}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow disabled:opacity-50"
    >
      <HeartIcon className={`h-5 w-5 ${wishlisted ? "fill-brand text-brand" : "text-zinc-700"}`} />
    </button>
  );
}
