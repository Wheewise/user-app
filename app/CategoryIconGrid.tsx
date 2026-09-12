import Link from "next/link";
import { useTranslations } from "next-intl";

type Item = {
  labelKey: "cars" | "bikes" | "commercial" | "taxi" | "lease";
  href: string;
  image: string;
};

const ITEMS: Item[] = [
  { labelKey: "cars", href: "/browse?category=CAR", image: "/categories/car.webp" },
  { labelKey: "bikes", href: "/browse?category=BIKE", image: "/categories/bike.webp" },
  { labelKey: "commercial", href: "/browse?category=COMMERCIAL", image: "/categories/commercial.webp" },
  { labelKey: "taxi", href: "/browse?category=TAXI", image: "/categories/taxi.webp" },
  { labelKey: "lease", href: "/browse?category=LEASE", image: "/categories/lease.webp" },
];

// Only rendered on real phone devices (caller checks lib/device.ts) —
// desktop/tablet already have the category pill row + hover mega-menu in
// the header, this would just duplicate it there. No "All vehicles" tile —
// the hamburger menu already covers that.
export function CategoryIconGrid() {
  const t = useTranslations("categories");
  return (
    <div className="mb-6 grid grid-cols-5 gap-2">
      {ITEMS.map((item) => (
        <Link key={item.labelKey} href={item.href} className="flex flex-col items-center gap-1.5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" className="h-11 w-11 object-contain" />
          </span>
          <span className="text-[11px] leading-tight font-medium text-foreground">{t(item.labelKey)}</span>
        </Link>
      ))}
    </div>
  );
}
