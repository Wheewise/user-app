import Link from "next/link";
import { useTranslations } from "next-intl";
import { MenuIcon, ChevronUpIcon } from "@wheewise/ui";

// Body-type sub-lists (Hatchback, Sedan, SUV, …) stay in English for now —
// these are widely used as-is in Malayalam/Hindi automotive contexts, and
// translating them accurately is its own pass, not bundled into this one.
const COLUMNS = [
  {
    category: "CAR",
    labelKey: "cars",
    image: "/categories/car.webp",
    bodyTypes: ["Hatchback", "Sedan", "SUV", "MUV/MPV", "Coupe", "Convertible"],
  },
  {
    category: "BIKE",
    labelKey: "bikes",
    image: "/categories/bike.webp",
    bodyTypes: ["Scooter", "Cruiser", "Sports", "Naked", "Solo"],
  },
  {
    category: "COMMERCIAL",
    labelKey: "commercial",
    image: "/categories/commercial.webp",
    bodyTypes: ["Pickup Truck", "Van", "Truck", "Mini Truck", "Tempo"],
  },
  {
    category: "TAXI",
    labelKey: "taxi",
    image: "/categories/taxi.webp",
    bodyTypes: [],
  },
  {
    category: "LEASE",
    labelKey: "lease",
    image: "/categories/lease.webp",
    bodyTypes: [],
  },
] as const;

// CSS-only hover dropdown (Tailwind's group/group-hover) — no client JS
// needed just to show/hide a menu on hover. Positioned relative to the
// <nav> it lives in (see Header.tsx), not this trigger, so the panel
// spans the full header width edge-to-edge, OLX mega-menu style.
export function AllCategoriesMenu() {
  const t = useTranslations("nav");
  const tCategories = useTranslations("categories");
  return (
    <div className="group shrink-0">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        <MenuIcon className="h-4 w-4" />
        {t("allCategories")}
      </button>

      <div className="invisible absolute inset-x-0 top-full z-20 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
        <div className="flex justify-center">
          <ChevronUpIcon className="h-4 w-4 -mb-px text-border-default" />
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-8 border-t border-border-default bg-background px-10 py-8 shadow-xl">
          {COLUMNS.map((col) => (
            <div key={col.category}>
              <Link
                href={`/browse?category=${col.category}`}
                className="mb-3 flex items-center gap-2 border-b border-border-default pb-2 text-base font-semibold hover:text-brand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={col.image} alt="" className="h-6 w-6 object-contain" />
                {tCategories(col.labelKey)}
              </Link>
              {col.bodyTypes.length > 0 ? (
                <ul className="space-y-2.5">
                  {col.bodyTypes.map((bt) => (
                    <li key={bt}>
                      <Link
                        href={`/browse?category=${col.category}&bodyType=${encodeURIComponent(bt)}`}
                        className="block text-sm text-zinc-600 hover:text-brand"
                      >
                        {bt}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
