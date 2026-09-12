import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import type { Vehicle } from "@wheewise/supabase";
import { VehicleCard } from "../VehicleCard";
import { Breadcrumb } from "../Breadcrumb";
import { RemoveButton } from "./RemoveButton";

// Signed-in-only, one buyer's own data — nothing here is ever the same
// page twice, so there's nothing worth a search engine indexing.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function WishlistPage() {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  const { data: rows } = await supabase
    .from("wishlists")
    .select("vehicles(*)")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  const vehicles = (rows ?? []).map((r) => r.vehicles).filter(Boolean) as unknown as Vehicle[];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
      <Breadcrumb items={[["Home", "/"], ["Wishlist", null]]} />
      <h1 className="mb-6 text-xl font-semibold">Your wishlist</h1>
      {vehicles.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing saved yet — tap the heart on a listing to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((v) => (
            <div key={v.id} className="relative">
              <VehicleCard vehicle={v} />
              <RemoveButton vehicleId={v.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
