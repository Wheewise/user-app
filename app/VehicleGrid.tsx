"use client";

import { useState } from "react";
import type { Vehicle } from "@wheewise/supabase";
import { VehicleCard } from "./VehicleCard";

const MOBILE_INITIAL = 12;

export function VehicleGrid({
  vehicles,
  mobile,
  isAuthenticated,
  wishlistedIds,
}: {
  vehicles: Vehicle[];
  mobile: boolean;
  isAuthenticated: boolean;
  wishlistedIds: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const wishlisted = new Set(wishlistedIds);
  const showLoadMore = mobile && !expanded && vehicles.length > MOBILE_INITIAL;
  const visible = mobile && !expanded ? vehicles.slice(0, MOBILE_INITIAL) : vehicles;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            wishlist={{ isAuthenticated, initialWishlisted: wishlisted.has(v.id) }}
          />
        ))}
        {vehicles.length === 0 ? <p className="text-sm text-zinc-500">No listings yet.</p> : null}
      </div>
      {showLoadMore ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mx-auto mt-6 block rounded-full border border-border-default px-6 py-2 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          Load more
        </button>
      ) : null}
    </>
  );
}
