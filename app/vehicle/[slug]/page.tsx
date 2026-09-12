import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { VerifiedBadgeIcon, UserIcon } from "@wheewise/ui";
import type { Vehicle } from "@wheewise/supabase";
import { Breadcrumb } from "../../Breadcrumb";
import { EnquireButton } from "./EnquireButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { ChatButton } from "./ChatButton";
import { CompareButton } from "./CompareButton";
import { WishlistButton } from "./WishlistButton";
import { ShareButton } from "./ShareButton";
import { ImageGallery } from "./ImageGallery";
import { VehicleCard } from "../../VehicleCard";
import { isMobileDevice } from "../../../lib/device";
import { geocodeAddress } from "../../../lib/geolocation";
import { safeJsonLd } from "../../../lib/jsonld";

// Old links (shared before slugs existed, or search-indexed) still resolve
// by UUID — this only checks the shape, doesn't hit the DB, so a normal
// slug never risks a Postgres "invalid input syntax for type uuid" error
// from being compared against the id column.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(d: string): string {
  const date = new Date(d);
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

function titleCase(s: string): string {
  return s[0] + s.slice(1).toLowerCase();
}

const CATEGORY_LABELS: Record<string, string> = {
  CAR: "Cars",
  BIKE: "Bikes",
  COMMERCIAL: "Commercial vehicles",
  TAXI: "Taxis",
  LEASE: "Lease",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const column = UUID_RE.test(slug) ? "id" : "slug";
  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("make, model, year, city, asking_price, photo_urls")
    .eq(column, slug)
    .eq("status", "ACTIVE")
    .single();

  if (!vehicle) return { title: "Listing not found" };

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.city}`;
  const description = `₹${vehicle.asking_price.toLocaleString("en-IN")} · ${vehicle.year} ${vehicle.make} ${vehicle.model}, ${vehicle.city}. Verified dealer, view photos and contact on Wheewise.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.photo_urls[0] ? [vehicle.photo_urls[0]] : undefined,
    },
  };
}

// Public page, deliberately no requireAuthContext — content is visible to
// anonymous visitors and search engines; only the action buttons below
// (enquire, wishlist) are gated, and that's enforced by the server actions
// they call, not by hiding this page.
export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: slugParam } = await params;
  const mobile = await isMobileDevice();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLegacyId = UUID_RE.test(slugParam);
  const { data: vehicle } = await supabase
    .from("vehicles")
    .select(
      "*, dealers(id, business_name, status, profile_id, slug, address, city, map_link, logo_url, created_at)",
    )
    .eq(isLegacyId ? "id" : "slug", slugParam)
    .eq("status", "ACTIVE")
    .single();

  if (!vehicle) notFound();

  // A UUID link still works, but the address bar should show the readable
  // URL — redirect once, at the source, rather than leaving both live.
  if (isLegacyId && vehicle.slug) redirect(`/vehicle/${vehicle.slug}`);

  const dealer = vehicle.dealers as unknown as {
    id: string;
    business_name: string;
    status: string;
    profile_id: string;
    slug: string | null;
    address: string | null;
    city: string;
    map_link: string | null;
    logo_url: string | null;
    created_at: string;
  };

  const { data: dealerProfile } = await supabase
    .from("profiles")
    .select("whatsapp")
    .eq("id", dealer.profile_id)
    .single();

  const wishlistRow = user
    ? (
        await supabase
          .from("wishlists")
          .select("buyer_id")
          .eq("buyer_id", user.id)
          .eq("vehicle_id", vehicle.id)
          .maybeSingle()
      ).data
    : null;

  const { data: similar } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "ACTIVE")
    .eq("category", vehicle.category)
    .neq("id", vehicle.id)
    .order("created_at", { ascending: false })
    .limit(mobile ? 6 : 21)
    .returns<Vehicle[]>();

  const similarWishlistedIds = new Set(
    user && similar?.length
      ? (
          await supabase
            .from("wishlists")
            .select("vehicle_id")
            .eq("buyer_id", user.id)
            .in("vehicle_id", similar.map((v) => v.id))
        ).data?.map((w) => w.vehicle_id)
      : [],
  );

  const vehicleUrl = `${process.env.APP_URL ?? ""}/vehicle/${vehicle.slug}`;
  // Kept for JSON-LD, share text, and the WhatsApp message — the year
  // still disambiguates there. The on-page heading and breadcrumb use
  // displayTitle instead, since the year already shows separately as its
  // own badge next to the price.
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const displayTitle = `${vehicle.make} ${vehicle.model}`;

  // Every vehicle from the same dealer must show the same shop location —
  // geocode off the dealer's own address/city, never the vehicle's city
  // (a dealer lists vehicles from all over, so that varied per listing).
  // Falls back to a city-level pin when the exact address doesn't geocode
  // (free-text dealer addresses are often too messy to resolve precisely).
  const coords = dealer.address
    ? (await geocodeAddress(`${dealer.address}, ${dealer.city}`).catch(() => null)) ??
      (await geocodeAddress(dealer.city).catch(() => null))
    : null;
  const mapHref =
    dealer.map_link ??
    (coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.address}, ${dealer.city}`)}`);
  const mapEmbedSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.01}%2C${coords.lat - 0.008}%2C${coords.lon + 0.01}%2C${coords.lat + 0.008}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`
    : null;

  // Only real fields — no fabricated "1st owner" style stat, that isn't
  // tracked anywhere in the schema.
  const highlights: [string, string][] = [
    ["Fuel", titleCase(vehicle.fuel_type)],
    ...(vehicle.transmission ? ([["Transmission", vehicle.transmission]] as [string, string][]) : []),
    ["Odometer", `${vehicle.odometer_km.toLocaleString("en-IN")} km`],
    ["Year", String(vehicle.year)],
  ];

  // Desktop has empty space below the (shorter) gallery column once the
  // details column grows tall — Key Highlights fills that gap there.
  // Mobile stays a single stack, so it keeps its original spot below both
  // columns. A real per-device split (like ImageGallery's), not a CSS
  // breakpoint, since it's a structural reorder, not a resize.
  const keyHighlightsSection = (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Key Highlights</h2>
      <div className="grid grid-cols-2 gap-3">
        {highlights.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border-default p-3 text-center">
            <div className="text-sm font-semibold">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Same reasoning as keyHighlightsSection above — a single shared element
  // rendered in a different spot on mobile vs. desktop.
  const shopProfileCard = (
    <div className="rounded-lg border border-border-default p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-zinc-400">
          {dealer.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dealer.logo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-6 w-6" />
          )}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1 font-semibold">
            <span className="truncate">{dealer.business_name}</span>
            {dealer.status === "ACTIVE" ? (
              <VerifiedBadgeIcon className="h-4 w-4 shrink-0 text-success" />
            ) : null}
          </div>
          <p className="text-xs text-zinc-500">Member since {formatDate(dealer.created_at)}</p>
        </div>
      </div>

      {dealer.slug ? (
        <Link
          href={`/store/${dealer.slug}`}
          className="mt-3 block rounded-md border border-border-default py-2 text-center text-sm font-medium hover:bg-surface-muted"
        >
          View seller profile
        </Link>
      ) : null}

      {dealer.address ? (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Location</p>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-2 block h-40 overflow-hidden rounded-lg border border-border-default bg-surface-muted"
          >
            {mapEmbedSrc ? (
              <iframe
                src={mapEmbedSrc}
                className="pointer-events-none h-full w-full border-0"
                loading="lazy"
                title={`${dealer.business_name} location`}
              />
            ) : null}
            <span className="absolute right-2 bottom-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand shadow">
              Open in Google Maps
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );

  const specs: [string, string | number | null][] = [
    ["Vehicle class", vehicle.vehicle_class],
    ["Color", vehicle.color],
    ["Body type", vehicle.body_type],
    ["Fuel type", titleCase(vehicle.fuel_type)],
    ["Transmission", vehicle.transmission],
    ["Odometer", `${vehicle.odometer_km.toLocaleString("en-IN")} km`],
    ["Registration no.", vehicle.reg_number],
    [
      "Manufactured",
      vehicle.mfg_month ? `${MONTHS[vehicle.mfg_month - 1]} ${vehicle.year}` : String(vehicle.year),
    ],
    ["Cubic capacity", vehicle.cubic_capacity_cc ? `${vehicle.cubic_capacity_cc} cc` : null],
    ["Horsepower", vehicle.horsepower_bhp ? `${vehicle.horsepower_bhp} bhp` : null],
    ["Cylinders", vehicle.cylinders],
    ["Seating capacity", vehicle.seating_capacity],
    ["Unladen weight", vehicle.unladen_weight_kg ? `${vehicle.unladen_weight_kg} kg` : null],
    ["Wheelbase", vehicle.wheelbase_mm ? `${vehicle.wheelbase_mm} mm` : null],
    ["Emission norms", vehicle.emission_norms],
  ].filter(([, value]) => value != null && value !== "") as [string, string | number][];

  const categoryLabel = CATEGORY_LABELS[vehicle.category] ?? titleCase(vehicle.category);
  const breadcrumb: [string, string | null][] = [
    ["Home", "/"],
    [categoryLabel, `/browse?category=${vehicle.category}`],
    [vehicle.city, `/browse?city=${encodeURIComponent(vehicle.city)}`],
    [displayTitle, null],
  ];

  const siteUrl = process.env.APP_URL ?? "https://wheewise.com";

  // Product/Offer, not a dedicated "Car" type — Google's rich-result
  // support for classifieds listings keys off Product+Offer, and it's
  // what every other marketplace's listing markup already targets.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: vehicle.description || `${title} for sale in ${vehicle.city} on Wheewise.`,
    image: vehicle.photo_urls,
    brand: { "@type": "Brand", name: vehicle.make },
    offers: {
      "@type": "Offer",
      url: vehicleUrl,
      priceCurrency: "INR",
      price: vehicle.asking_price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "Organization", name: dealer.business_name },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map(([label, href], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      item: `${siteUrl}${href ?? `/vehicle/${vehicle.slug}`}`,
    })),
  };

  return (
    <>
    <script
      type="application/ld+json"
      // Dealer-entered text (description, business name) flows into this —
      // plain JSON.stringify doesn't escape "</script>", which a browser's
      // HTML parser would treat as closing this tag early. Escaping "<"
      // stays valid JSON (search engines/JSON.parse read < as "<")
      // while making that injection impossible.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }}
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
    <div className="mx-auto max-w-4xl px-4 pt-4 pb-8">
      <Breadcrumb items={breadcrumb} />

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative">
          <ImageGallery photos={vehicle.photo_urls} title={title} mobile={mobile} />
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton
              vehicleId={vehicle.id}
              initialWishlisted={!!wishlistRow}
              isAuthenticated={!!user}
            />
          </div>
          {!mobile ? <div className="mt-6">{keyHighlightsSection}</div> : null}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{displayTitle}</h1>
            <ShareButton title={title} url={vehicleUrl} />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
            {dealer.status === "ACTIVE" ? (
              <VerifiedBadgeIcon className="h-4 w-4 text-success" />
            ) : null}
            {dealer.slug ? (
              <Link href={`/store/${dealer.slug}`} className="font-medium hover:text-brand hover:underline">
                {dealer.business_name}
              </Link>
            ) : (
              dealer.business_name
            )}
            {" · "}
            {vehicle.city}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-brand">
              ₹{vehicle.asking_price.toLocaleString("en-IN")}
            </span>
            <span className="rounded-full border border-border-default px-3 py-1 text-sm font-medium text-zinc-600">
              {vehicle.year}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <EnquireButton vehicleId={vehicle.id} isAuthenticated={!!user} />
            <div className="flex gap-2">
              <ChatButton isAuthenticated={!!user} />
              <CompareButton isAuthenticated={!!user} />
            </div>
            {dealerProfile?.whatsapp ? (
              <WhatsAppButton
                dealerWhatsapp={dealerProfile.whatsapp}
                vehicleUrl={vehicleUrl}
                vehicleTitle={title}
              />
            ) : null}
          </div>

          {/* Desktop keeps the shop card here, right under the actions.
              Mobile moves it below Product Details instead (see below) —
              a structural reorder, so it's gated on the device check
              rather than a CSS breakpoint, same as Key Highlights above. */}
          {!mobile ? <div className="mt-6">{shopProfileCard}</div> : null}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Product Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt className="text-zinc-500">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {mobile ? <div className="mt-10">{shopProfileCard}</div> : null}

      {vehicle.description ? (
        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-line text-sm text-zinc-700">{vehicle.description}</p>
        </div>
      ) : null}

    </div>

    {(similar ?? []).length > 0 ? (
      <div className="mx-auto mt-12 max-w-7xl px-4">
        <h2 className="mb-4 text-lg font-semibold">Similar listings</h2>
        {mobile ? (
          <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(similar ?? []).map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                className="w-36 shrink-0"
                wishlist={{ isAuthenticated: !!user, initialWishlisted: similarWishlistedIds.has(v.id) }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {(similar ?? []).map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                wishlist={{ isAuthenticated: !!user, initialWishlisted: similarWishlistedIds.has(v.id) }}
              />
            ))}
          </div>
        )}
      </div>
    ) : null}
    </>
  );
}
