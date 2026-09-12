import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  WhatsAppIcon,
  LinkedInIcon,
  RedditIcon,
  MailIcon,
} from "@wheewise/ui";
import { FooterSignInLink } from "./FooterSignInLink";

// X and WhatsApp aren't real accounts yet — those two still render
// greyed-out and unclickable rather than link to nothing/wrong accounts.
// Fill in a URL once an account exists.
const SOCIAL_LINKS = [
  { label: "Facebook", icon: FacebookIcon, href: "https://www.facebook.com/share/18sksdFW2J/?mibextid=wwXIfr" },
  { label: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/wheewise" },
  { label: "YouTube", icon: YouTubeIcon, href: "https://www.youtube.com/@wheewise" },
  { label: "X", icon: XIcon, href: null },
  { label: "WhatsApp", icon: WhatsAppIcon, href: null },
  { label: "LinkedIn", icon: LinkedInIcon, href: "https://www.linkedin.com/company/wheewise/" },
  { label: "Reddit", icon: RedditIcon, href: "https://www.reddit.com/user/Wheewise/" },
  { label: "Email", icon: MailIcon, href: "mailto:wheewise@gmail.com" },
];

const POPULAR_CITIES = ["Kozhikode", "Kochi", "Thiruvananthapuram", "Thrissur"];
const MORE_CITIES = ["Kannur", "Kollam", "Kottayam", "Malappuram"];

const CATEGORY_LINKS = [
  { labelKey: "allVehicles" as const, ns: "nav" as const, href: "/browse" },
  { labelKey: "cars" as const, ns: "categories" as const, href: "/browse?category=CAR" },
  { labelKey: "bikes" as const, ns: "categories" as const, href: "/browse?category=BIKE" },
  { labelKey: "commercial" as const, ns: "categories" as const, href: "/browse?category=COMMERCIAL" },
  { labelKey: "taxi" as const, ns: "categories" as const, href: "/browse?category=TAXI" },
  { labelKey: "lease" as const, ns: "categories" as const, href: "/browse?category=LEASE" },
];

const QUICK_LINKS = [
  { labelKey: "browse" as const, href: "/browse" },
  { labelKey: "wishlist" as const, href: "/wishlist" },
  { labelKey: "chat" as const, href: "/enquiries" },
];

const WHEEWISE_LINKS = [
  { label: "Help", href: "/help" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Legal & Privacy information", href: "/legal" },
  { label: "Vulnerability Disclosure Program", href: "/security" },
];

export function Footer({ mobile }: { mobile: boolean }) {
  const t = useTranslations("nav");
  const tCategories = useTranslations("categories");
  const tFooter = useTranslations("footer");
  const categoryLabel = (l: (typeof CATEGORY_LINKS)[number]) =>
    l.ns === "categories" ? tCategories(l.labelKey) : t(l.labelKey);

  return (
    <footer id="get-app" className="mt-16 scroll-mt-4 border-t border-border-default">
      <div className="border-b border-border-default bg-surface-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-6">
          <div>
            <p className="text-lg font-bold tracking-tight">Try the Wheewise app</p>
            <p className="mt-1 text-sm text-zinc-500">
              Buy and sell cars, bikes, and commercial vehicles on the go.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              Get your app today
            </p>
            <div className="flex flex-wrap gap-3">
              <AppStoreBadge />
              <PlayStoreBadge />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/tablet: always-expanded grid. */}
      {!mobile ? (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <FooterColumn title={tFooter("popularCities")}>
            {POPULAR_CITIES.map((c) => (
              <FooterLink key={c} href={`/browse?city=${encodeURIComponent(c)}`}>
                {c}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title={tFooter("moreCities")}>
            {MORE_CITIES.map((c) => (
              <FooterLink key={c} href={`/browse?city=${encodeURIComponent(c)}`}>
                {c}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title={tFooter("categories")}>
            {CATEGORY_LINKS.map((l) => (
              <FooterLink key={l.labelKey} href={l.href}>
                {categoryLabel(l)}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title={tFooter("quickLinks")}>
            {QUICK_LINKS.map((l) => (
              <FooterLink key={l.labelKey} href={l.href}>
                {t(l.labelKey)}
              </FooterLink>
            ))}
            <FooterSignInLink />
          </FooterColumn>
          <FooterColumn title="Wheewise">
            {WHEEWISE_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{tFooter("followUs")}</p>
            <SocialRow />
          </div>
        </div>
      </div>
      ) : (
      /* Mobile: collapsible accordion sections, closed by default. */
      <div>
        <FooterAccordion title={tFooter("categories")}>
          {CATEGORY_LINKS.map((l) => (
            <FooterLink key={l.labelKey} href={l.href}>
              {categoryLabel(l)}
            </FooterLink>
          ))}
        </FooterAccordion>
        <FooterAccordion title={tFooter("popularCities")}>
          {POPULAR_CITIES.map((c) => (
            <FooterLink key={c} href={`/browse?city=${encodeURIComponent(c)}`}>
              {c}
            </FooterLink>
          ))}
        </FooterAccordion>
        <FooterAccordion title={tFooter("moreCities")}>
          {MORE_CITIES.map((c) => (
            <FooterLink key={c} href={`/browse?city=${encodeURIComponent(c)}`}>
              {c}
            </FooterLink>
          ))}
        </FooterAccordion>
        <FooterAccordion title={tFooter("quickLinks")}>
          {QUICK_LINKS.map((l) => (
            <FooterLink key={l.labelKey} href={l.href}>
              {t(l.labelKey)}
            </FooterLink>
          ))}
          <FooterSignInLink />
        </FooterAccordion>
        <FooterAccordion title="Wheewise">
          {WHEEWISE_LINKS.map((l) => (
            <FooterLink key={l.label} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterAccordion>

        <div className="border-b border-border-default px-4 py-5 text-center">
          <p className="mb-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{tFooter("followUs")}</p>
          <div className="flex justify-center">
            <SocialRow />
          </div>
        </div>
      </div>
      )}

      <div className="bg-zinc-900 py-5 text-zinc-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs sm:flex-row sm:px-6">
          <p>
            <span className="font-semibold text-white">Wheewise</span> | Tomatrix Technologies Pvt Ltd
            {" · "}
            <a
              href="https://foxly.marketingfox.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              Foxly Digital Marketing Solutions
            </a>
          </p>
          <p>All rights reserved © {new Date().getFullYear()} Wheewise</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-zinc-600 hover:text-brand">
        {children}
      </Link>
    </li>
  );
}

// Collapsed by default, native <details> — same zero-JS pattern as the
// browse-page filters toggle.
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border-default">
      <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-sm font-medium select-none">
        {title}
        <span className="text-zinc-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <ul className="space-y-3 px-4 pb-4">{children}</ul>
    </details>
  );
}

function SocialRow() {
  return (
    <div className="flex flex-wrap gap-2">
      {SOCIAL_LINKS.map(({ label, icon: SocialIcon, href }) =>
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default text-zinc-600 hover:border-brand hover:text-brand"
          >
            <SocialIcon className="h-4 w-4" />
          </a>
        ) : (
          <span
            key={label}
            aria-label={`${label} (coming soon)`}
            title="Coming soon"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-border-default text-zinc-300"
          >
            <SocialIcon className="h-4 w-4" />
          </span>
        ),
      )}
    </div>
  );
}

function AppStoreBadge() {
  return (
    <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-4 text-white opacity-60">
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M17.05 12.536c-.03-2.79 2.28-4.13 2.38-4.19-1.3-1.9-3.32-2.16-4.04-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.21-.99-3.64-.96-1.87.03-3.6 1.09-4.56 2.75-1.95 3.38-.5 8.38 1.4 11.12.93 1.34 2.03 2.85 3.48 2.79 1.4-.06 1.93-.9 3.62-.9s2.17.9 3.65.87c1.51-.02 2.46-1.36 3.38-2.71.96-1.39 1.36-2.75 1.38-2.82-.03-.01-2.65-1.02-2.82-4.06zM14.5 4.28c.77-.94 1.29-2.24 1.15-3.53-1.11.04-2.46.74-3.26 1.67-.71.82-1.34 2.15-1.17 3.42 1.24.1 2.5-.63 3.28-1.56z" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[9px]">Download on the</span>
        <span className="block text-sm font-semibold">App Store</span>
      </span>
    </span>
  );
}

function PlayStoreBadge() {
  return (
    <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-4 text-white opacity-60">
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="#00d9ff" d="M3.6 2.3 13.9 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" />
        <path fill="#ffd900" d="m13.9 12 3.5-3.4 4.3-2.5c.5.3.8.8.8 1.4v9c0 .6-.3 1.1-.8 1.4l-4.3-2.5z" />
        <path fill="#ff3d00" d="M3.6 2.3c.2-.1.4-.2.7-.2.3 0 .6.1.8.2l12.3 7-4 3.9z" />
        <path fill="#00ff67" d="M3.6 21.7c.2.1.4.2.7.2.3 0 .6-.1.8-.2l12.3-7-4-3.9z" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[9px]">GET IT ON</span>
        <span className="block text-sm font-semibold">Google Play</span>
      </span>
    </span>
  );
}
