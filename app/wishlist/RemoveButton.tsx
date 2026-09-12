"use client";

import { useTransition } from "react";
import { removeFromWishlist } from "./actions";

export function RemoveButton({ vehicleId }: { vehicleId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => removeFromWishlist(vehicleId))}
      className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-danger shadow-sm hover:bg-white disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
