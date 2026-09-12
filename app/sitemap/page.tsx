import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sitemap" };

const CATEGORIES = [
  { label: "Cars", href: "/browse?category=CAR" },
  { label: "Bikes", href: "/browse?category=BIKE" },
  { label: "Commercial", href: "/browse?category=COMMERCIAL" },
  { label: "Taxi", href: "/browse?category=TAXI" },
  { label: "Lease", href: "/browse?category=LEASE" },
];

const CITIES = [
  "Kozhikode", "Kochi", "Thiruvananthapuram", "Thrissur",
  "Kannur", "Kollam", "Kottayam", "Malappuram",
];

const ACCOUNT_LINKS = [
  { label: "Wishlist", href: "/wishlist" },
  { label: "My enquiries", href: "/enquiries" },
  { label: "Sign up", href: "/signup" },
];

const COMPANY_LINKS = [
  { label: "Help & support", href: "/help" },
  { label: "Legal & Privacy information", href: "/legal" },
  { label: "Vulnerability Disclosure Program", href: "/security" },
];

function SitemapSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function SitemapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-zinc-700 hover:text-brand hover:underline">
        {children}
      </Link>
    </li>
  );
}

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Sitemap</h1>
      <p className="mt-2 text-sm text-zinc-500">Every page on Wheewise, in one place.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <SitemapSection title="Browse">
          <SitemapLink href="/">Home</SitemapLink>
          <SitemapLink href="/browse">All listings</SitemapLink>
          {CATEGORIES.map((c) => (
            <SitemapLink key={c.href} href={c.href}>
              {c.label}
            </SitemapLink>
          ))}
        </SitemapSection>

        <SitemapSection title="Cities">
          {CITIES.map((c) => (
            <SitemapLink key={c} href={`/browse?city=${encodeURIComponent(c)}`}>
              {c}
            </SitemapLink>
          ))}
        </SitemapSection>

        <SitemapSection title="Your account">
          {ACCOUNT_LINKS.map((l) => (
            <SitemapLink key={l.href} href={l.href}>
              {l.label}
            </SitemapLink>
          ))}
        </SitemapSection>

        <SitemapSection title="Company">
          {COMPANY_LINKS.map((l) => (
            <SitemapLink key={l.href} href={l.href}>
              {l.label}
            </SitemapLink>
          ))}
        </SitemapSection>
      </div>
    </div>
  );
}
