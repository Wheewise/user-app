"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";

export async function removeFromWishlist(vehicleId: string) {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);
  await supabase.from("wishlists").delete().eq("buyer_id", userId).eq("vehicle_id", vehicleId);
  revalidatePath("/wishlist");
}
