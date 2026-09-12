import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { SiteChrome } from "./SiteChrome";
import { LoginModalProvider } from "./LoginModalProvider";
import { AutoPrompts } from "./AutoPrompts";
import { GoogleOneTap } from "./GoogleOneTap";
import { CompletePhoneModal } from "./CompletePhoneModal";
import { RegisterServiceWorker } from "./RegisterServiceWorker";
import { AppPromoModal } from "./AppPromoModal";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { isMobileDevice } from "../lib/device";
import { safeJsonLd } from "../lib/jsonld";

const APP_URL = process.env.APP_URL || "https://wheewise.com";

// Static, no dealer/user-entered text involved — but every JSON-LD block
// goes through the same escape regardless, so a future edit can't
// accidentally reintroduce the injection risk by copying this as a
// "known safe" example.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wheewise",
  url: APP_URL,
  logo: `${APP_URL}/icon-512.png`,
};
const TITLE = "Wheewise — Buy From Trusted, GST-Verified Vehicle Dealers";
const DESCRIPTION =
  "Buy pre-owned cars, bikes, and commercial vehicles from trusted, GST-verified dealers across India. Every dealer is verified before they can list — browse with confidence.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: TITLE, template: "%s | Wheewise" },
  description: DESCRIPTION,
  keywords: [
    "buy used cars",
    "verified car dealers",
    "trusted pre-owned vehicles",
    "second hand cars India",
    "GST verified dealers",
  ],
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Wheewise" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Wheewise",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const mobile = await isMobileDevice();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <GoogleAnalytics />
        <RegisterServiceWorker />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense>
            <LoginModalProvider>
              <AutoPrompts />
              <GoogleOneTap isAuthenticated={!!user} />
              <AppPromoModal />
              <CompletePhoneModal />
              <SiteChrome
                isAuthenticated={!!user}
                avatarUrl={user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null}
                name={user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null}
                mobile={mobile}
              >
                {children}
              </SiteChrome>
            </LoginModalProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
