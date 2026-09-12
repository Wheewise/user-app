import Script from "next/script";

// Google Identity Services/gtag.js run entirely in the browser and need
// the Measurement ID at load time — same reason NEXT_PUBLIC_GOOGLE_CLIENT_ID
// carries the prefix (see .env.example): Next.js only inlines an env var
// into the client bundle when it's named with that prefix. No-ops (renders
// nothing) until the var is actually set, so a blank env doesn't ship a
// broken gtag call to every visitor.
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
