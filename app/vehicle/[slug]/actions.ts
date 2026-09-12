"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";

export async function startEnquiry(vehicleId: string) {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("id, dealer_id")
    .eq("id", vehicleId)
    .single();
  if (!vehicle) throw new Error("Listing not found");

  const { data: existing } = await supabase
    .from("enquiries")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .eq("buyer_id", userId)
    .maybeSingle();

  const enquiryId =
    existing?.id ??
    (
      await supabase
        .from("enquiries")
        .insert({ vehicle_id: vehicleId, buyer_id: userId, dealer_id: vehicle.dealer_id })
        .select("id")
        .single()
    ).data?.id;

  redirect(`/enquiries/${enquiryId}`);
}

export async function toggleWishlist(vehicleId: string, wishlisted: boolean) {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  if (wishlisted) {
    await supabase.from("wishlists").delete().eq("buyer_id", userId).eq("vehicle_id", vehicleId);
  } else {
    await supabase.from("wishlists").insert({ buyer_id: userId, vehicle_id: vehicleId });
  }
}
