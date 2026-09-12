import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import type { Vehicle } from "@wheewise/supabase";
import { VehicleCard } from "../VehicleCard";
import { Breadcrumb } from "../Breadcrumb";

const CATEGORIES = ["CAR", "BIKE", "COMMERCIAL", "TAXI", "LEASE"] as const;
const FUEL_TYPES = ["PETROL", "DIESEL", "CNG", "ELECTRIC", "HYBRID"] as const;
const TRANSMISSIONS = ["Manual", "Automatic", "CVT", "AMT", "DCT", "Semi-Automatic"];
const PAGE_SIZE = 24;

const CATEGORY_LABELS: Record<string, string> = {
  CAR: "Cars",
  BIKE: "Bikes",
  COMMERCIAL: "Commercial Vehicles",
  TAXI: "Taxis",
  LEASE: "Lease Vehicles",
};

type SearchParams = {
  q?: string;
  category?: string;
  bodyType?: string;
  city?: string;
  fuelType?: string | string[];
  transmission?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sort?: string;
  page?: string;
};

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// Builds the browse URL for a filter form, keeping every current param and
// only changing the one(s) the caller passes — used for sort links, "clear
// filter" links, and pagination, without needing client-side JS.
function hrefWith(current: SearchParams, changes: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  const merged = { ...current, ...changes };
  for (const [key, value] of Object.entries(merged)) {
    if (!value) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else params.set(key, value);
  }
  if (!("page" in changes)) params.delete("page");
  const qs = params.toString();
  return qs ? `/browse?${qs}` : "/browse";
}

// Generic filters (fuel, price, year…) aren't worth their own indexed
// title/description — only category and city meaningfully change what a
// searcher is looking for, so only those two drive the copy here.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { category, city } = await searchParams;
  const categoryLabel = category ? (CATEGORY_LABELS[category] ?? "Vehicles") : "Vehicles";
  const title = city ? `${categoryLabel} for Sale in ${city}` : `${categoryLabel} for Sale`;
  const description = `Browse ${categoryLabel.toLowerCase()}${
    city ? ` in ${city}` : ""
  } from GST-verified dealers on Wheewise.`;

  const canonicalParams = new URLSearchParams();
  if (category) canonicalParams.set("category", category);
  if (city) canonicalParams.set("city", city);
  const qs = canonicalParams.toString();

  return {
    title,
    description,
    alternates: { canonical: qs ? `/browse?${qs}` : "/browse" },
  };
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { q, category, bodyType, city } = sp;
  const fuelTypes = toArray(sp.fuelType);
  const transmissions = toArray(sp.transmission);
  const sort = sp.sort || "newest";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const supabase = await createServerSupabaseClient();
  let query = supabase.from("vehicles").select("*", { count: "exact" }).eq("status", "ACTIVE");

  if (q) {
    // .textSearch() only matched the single column given to it ("make"),
    // so a model-name search like "pulsar" (make: Bajaj, model: Pulsar
    // NS200) could never match anything — search make/model/city together.
    // Backslash must be escaped BEFORE the quote — escaping only `"` lets
    // a search string ending in `\` flip the escaping parity (the `\`
    // pairs with the backslash this code adds) and close the quoted value
    // early, injecting raw PostgREST filter syntax into the rest of the
    // .or() group.
    const escaped = q.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const like = `%${escaped}%`;
    query = query.or(`make.ilike."${like}",model.ilike."${like}",city.ilike."${like}"`);
  }
  if (category && (CATEGORIES as readonly string[]).includes(category)) {
    query = query.eq("category", category);
  }
  if (bodyType) query = query.eq("body_type", bodyType);
  if (city) query = query.ilike("city", `%${city}%`);
  if (fuelTypes.length) query = query.in("fuel_type", fuelTypes);
  if (transmissions.length) query = query.in("transmission", transmissions);
  if (sp.minPrice) query = query.gte("asking_price", Number(sp.minPrice));
  if (sp.maxPrice) query = query.lte("asking_price", Number(sp.maxPrice));
  if (sp.minYear) query = query.gte("year", Number(sp.minYear));
  if (sp.maxYear) query = query.lte("year", Number(sp.maxYear));

  if (sort === "price_asc") query = query.order("asking_price", { ascending: true });
  else if (sort === "price_desc") query = query.order("asking_price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: vehicles, count } = await query.returns<Vehicle[]>();
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistedIds = new Set(
    user
      ? (
          await supabase.from("wishlists").select("vehicle_id").eq("buyer_id", user.id)
        ).data?.map((w) => w.vehicle_id)
      : [],
  );

  const breadcrumb: [string, string | null][] = [["Home", "/"]];
  if (category && (CATEGORIES as readonly string[]).includes(category)) {
    breadcrumb.push([CATEGORY_LABELS[category] ?? category, city ? `/browse?category=${category}` : null]);
  }
  if (city) breadcrumb.push([city, null]);
  if (breadcrumb.length === 1) breadcrumb.push(["All Vehicles", null]);

  return (
    <div className="px-4 pt-4 pb-8 sm:px-6">
      <Breadcrumb items={breadcrumb} />
      <div className="grid gap-3 lg:grid-cols-[240px_1fr] lg:gap-6">
        <aside>
          {/* Checkbox-driven toggle, collapsed by default so mobile shows
              results first, not a screen of filters — plain hidden/block
              utilities rather than native <details>, since that relies on
              the browser's own closed-state display:none, which a same-
              specificity author class doesn't reliably win against in
              every browser. Kept viewport-based on purpose (unlike the
              header/footer/etc, which are device-based): this is about
              whether a 240px sidebar physically fits next to the grid,
              which a narrow desktop window genuinely doesn't have room
              for either. */}
          <input type="checkbox" id="filters-toggle" className="peer hidden" />
          <label
            htmlFor="filters-toggle"
            className="mb-4 flex cursor-pointer items-center justify-between rounded-md border border-border-default px-4 py-2.5 text-sm font-semibold select-none lg:hidden [&>span]:transition-transform peer-checked:[&>span]:rotate-180"
          >
            Filters
            <span className="text-zinc-400">▾</span>
          </label>
          <form action="/browse" method="get" className="hidden space-y-6 peer-checked:block lg:block">
            {q ? <input type="hidden" name="q" value={q} /> : null}
            {bodyType ? <input type="hidden" name="bodyType" value={bodyType} /> : null}

            <div>
              <p className="mb-2 text-sm font-semibold">Category</p>
              <div className="space-y-1 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="category" value="" defaultChecked={!category} />
                  All
                </label>
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2">
                    <input type="radio" name="category" value={c} defaultChecked={category === c} />
                    {c[0] + c.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">City</p>
              <input
                name="city"
                defaultValue={city}
                placeholder="e.g. Kozhikode"
                className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Price range (₹)</p>
              <div className="flex items-center gap-2">
                <input
                  name="minPrice"
                  type="number"
                  defaultValue={sp.minPrice}
                  placeholder="Min"
                  className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <span className="text-zinc-400">–</span>
                <input
                  name="maxPrice"
                  type="number"
                  defaultValue={sp.maxPrice}
                  placeholder="Max"
                  className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Year</p>
              <div className="flex items-center gap-2">
                <input
                  name="minYear"
                  type="number"
                  defaultValue={sp.minYear}
                  placeholder="From"
                  className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <span className="text-zinc-400">–</span>
                <input
                  name="maxYear"
                  type="number"
                  defaultValue={sp.maxYear}
                  placeholder="To"
                  className="w-full rounded-md border border-border-default px-2 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Fuel type</p>
              <div className="space-y-1 text-sm">
                {FUEL_TYPES.map((f) => (
                  <label key={f} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="fuelType"
                      value={f}
                      defaultChecked={fuelTypes.includes(f)}
                    />
                    {f[0] + f.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Transmission</p>
              <div className="space-y-1 text-sm">
                {TRANSMISSIONS.map((t) => (
                  <label key={t} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="transmission"
                      value={t}
                      defaultChecked={transmissions.includes(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Apply filters
            </button>
            {(category || bodyType || city || fuelTypes.length || transmissions.length || sp.minPrice || sp.maxPrice || sp.minYear || sp.maxYear) ? (
              <a
                href={hrefWith({ q }, {})}
                className="block text-center text-sm font-medium text-brand hover:underline"
              >
                Clear filters
              </a>
            ) : null}
            </form>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">{count ?? 0} listings found</p>
          </div>

          <div className="mb-4 flex gap-2 text-sm">
            <a
              href={hrefWith(sp, { sort: undefined, page: undefined })}
              className={`rounded-full border px-3 py-1 ${sort === "newest" ? "border-brand text-brand" : "border-border-default"}`}
            >
              Newest
            </a>
            <a
              href={hrefWith(sp, { sort: "price_asc", page: undefined })}
              className={`rounded-full border px-3 py-1 ${sort === "price_asc" ? "border-brand text-brand" : "border-border-default"}`}
            >
              Price: Low to High
            </a>
            <a
              href={hrefWith(sp, { sort: "price_desc", page: undefined })}
              className={`rounded-full border px-3 py-1 ${sort === "price_desc" ? "border-brand text-brand" : "border-border-default"}`}
            >
              Price: High to Low
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(vehicles ?? []).map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                wishlist={{ isAuthenticated: !!user, initialWishlisted: wishlistedIds.has(v.id) }}
              />
            ))}
            {(vehicles ?? []).length === 0 ? (
              <p className="text-sm text-zinc-500">No listings found.</p>
            ) : null}
          </div>

          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              {page > 1 ? (
                <a href={hrefWith(sp, { page: String(page - 1) })} className="rounded-md border border-border-default px-3 py-1.5 hover:border-brand">
                  Previous
                </a>
              ) : null}
              <span className="px-2 text-zinc-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <a href={hrefWith(sp, { page: String(page + 1) })} className="rounded-md border border-border-default px-3 py-1.5 hover:border-brand">
                  Next
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
