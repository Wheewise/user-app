import Link from "next/link";
import type { Vehicle } from "@wheewise/supabase";
import { CardWishlistButton } from "./CardWishlistButton";

export function VehicleCard({
  vehicle: v,
  className = "",
  wishlist,
}: {
  vehicle: Vehicle;
  className?: string;
  /** Omit entirely on pages that already show their own save/remove control
   * (e.g. the wishlist page itself) so two overlapping controls don't stack. */
  wishlist?: { isAuthenticated: boolean; initialWishlisted: boolean };
}) {
  return (
    <Link
      href={`/vehicle/${v.slug}`}
      className={`block overflow-hidden rounded-lg border border-border-default transition-colors hover:border-brand ${className}`}
    >
      <div className="relative aspect-square bg-surface-muted">
        {v.photo_urls[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={v.photo_urls[0]}
            alt={`${v.make} ${v.model}`}
            className="h-full w-full object-cover"
          />
        ) : null}
        {wishlist ? (
          <CardWishlistButton
            vehicleId={v.id}
            isAuthenticated={wishlist.isAuthenticated}
            initialWishlisted={wishlist.initialWishlisted}
          />
        ) : null}
      </div>
      <div className="border-l-4 border-brand px-3 py-2.5">
        <div className="text-lg font-bold text-foreground">
          ₹{v.asking_price.toLocaleString("en-IN")}
        </div>
        <div className="truncate text-sm text-foreground">
          {v.make} {v.model}
        </div>
        <div className="mt-1 text-xs tracking-wide text-zinc-500 uppercase">{v.city}</div>
      </div>
    </Link>
  );
}
