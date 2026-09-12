import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { VerifiedBadgeIcon } from "@wheewise/ui";
import type { Vehicle } from "@wheewise/supabase";
import { Breadcrumb } from "../../Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: dealer } = await supabase
    .from("dealers")
    .select("business_name, bio, city, logo_url")
    .eq("slug", slug)
    .single();

  if (!dealer) return { title: "Store not found" };

  const title = `${dealer.business_name} — Pre-owned vehicles in ${dealer.city}`;
  const description = dealer.bio || `Browse verified pre-owned vehicles from ${dealer.business_name} on Wheewise.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: dealer.logo_url ? [dealer.logo_url] : undefined,
    },
  };
}

// Deliberately public — no requireAuthContext here. Storefronts are meant
// to be shareable links; RLS ("dealers/vehicles: public read active")
// already scopes what an anonymous visitor can see, so this is safe
// without an app-level auth check on top.
export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // No status filter here beyond what RLS already enforces ("dealers:
  // public read non-suspended") — this used to also require status =
  // 'ACTIVE', which 404'd every storefront, since GST verification is
  // disabled project-wide and no dealer can currently reach ACTIVE.
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, business_name, status, logo_url, cover_photo_url, address, map_link, bio, city")
    .eq("slug", slug)
    .single();

  if (!dealer) notFound();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("dealer_id", dealer.id)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .returns<Vehicle[]>();

  const breadcrumb: [string, string | null][] = [
    ["Home", "/"],
    [dealer.business_name, null],
  ];

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="px-4 pt-4">
        <Breadcrumb items={breadcrumb} />
      </div>
      <div className="aspect-[3/1] w-full bg-surface-muted">
        {dealer.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dealer.cover_photo_url} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="px-4">
        <div className="-mt-12 flex items-end gap-4">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-background bg-surface-muted">
            {dealer.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dealer.logo_url} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <h1 className="text-xl font-bold">{dealer.business_name}</h1>
          {dealer.status === "ACTIVE" ? (
            <VerifiedBadgeIcon className="h-5 w-5 text-success" />
          ) : null}
        </div>

        <div className="mt-3 flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{vehicles?.length ?? 0}</span>{" "}
            <span className="text-zinc-500">listings</span>
          </div>
          <div className="text-zinc-500">{dealer.city}</div>
        </div>

        {dealer.bio ? <p className="mt-3 text-sm whitespace-pre-line">{dealer.bio}</p> : null}

        {dealer.address ? (
          <p className="mt-2 text-sm text-zinc-500">
            {dealer.address}
            {dealer.map_link ? (
              <>
                {" · "}
                <a
                  href={dealer.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  View on map
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-0.5 px-0.5">
        {(vehicles ?? []).map((v) => (
          <Link
            key={v.id}
            href={`/vehicle/${v.slug}`}
            className="group relative aspect-square overflow-hidden bg-surface-muted"
          >
            {v.photo_urls[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.photo_urls[0]}
                alt={`${v.make} ${v.model}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : null}
            <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-1.5 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              ₹{v.asking_price.toLocaleString("en-IN")}
            </div>
          </Link>
        ))}
        {(vehicles ?? []).length === 0 ? (
          <p className="col-span-3 py-10 text-center text-sm text-zinc-500">
            No listings yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
