"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { CompactHeader } from "./CompactHeader";
import { Footer } from "./Footer";
import { AppDownloadBanner } from "./AppDownloadBanner";

// /login, /signup, and /reset-password are full-bleed pages (see
// AuthLayout) — the marketplace header/footer would just crowd a page
// whose only job is getting someone signed in.
export function SiteChrome({
  isAuthenticated,
  avatarUrl,
  name,
  mobile,
  children,
}: {
  isAuthenticated: boolean;
  avatarUrl: string | null;
  name: string | null;
  mobile: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/reset-password");

  if (isAuthPage) return <main>{children}</main>;

  return (
    <>
      {mobile ? (
        <CompactHeader isAuthenticated={isAuthenticated} avatarUrl={avatarUrl} name={name} />
      ) : (
        <Header isAuthenticated={isAuthenticated} avatarUrl={avatarUrl} />
      )}
      <main>{children}</main>
      <Footer mobile={mobile} />
      {mobile ? <AppDownloadBanner /> : null}
    </>
  );
}
