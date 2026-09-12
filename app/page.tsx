import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import type { Vehicle } from "@wheewise/supabase";
import { VehicleGrid } from "./VehicleGrid";
import { CategoryIconGrid } from "./CategoryIconGrid";
import { isMobileDevice } from "../lib/device";

const MAX_LISTINGS = 20;

export default async function HomePage() {
  const mobile = await isMobileDevice();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(MAX_LISTINGS)
    .returns<Vehicle[]>();

  const wishlistedIds = new Set(
    user
      ? (
          await supabase.from("wishlists").select("vehicle_id").eq("buyer_id", user.id)
        ).data?.map((w) => w.vehicle_id)
      : [],
  );

  const t = await getTranslations("home");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
      {mobile ? <CategoryIconGrid /> : null}
      <h1 className="mb-4 text-xl font-semibold">{t("newlyAdded")}</h1>
      <VehicleGrid
        vehicles={vehicles ?? []}
        mobile={mobile}
        isAuthenticated={!!user}
        wishlistedIds={[...wishlistedIds]}
      />
      <div className="mt-6 flex justify-center">
        <Link
          href="/browse"
          className="rounded-full border border-border-default px-6 py-2 text-sm font-semibold hover:border-brand hover:text-brand"
        >
          {t("exploreMore")}
        </Link>
      </div>
    </div>
  );
}
