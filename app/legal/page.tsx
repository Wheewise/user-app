import type { Metadata } from "next";

export const metadata: Metadata = { title: "Legal & Privacy Information" };

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Legal & privacy information</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated 10 September 2026.</p>

      <nav className="mt-6 flex gap-4 text-sm">
        <a href="#terms" className="text-brand hover:underline">
          Terms of use
        </a>
        <a href="#privacy" className="text-brand hover:underline">
          Privacy policy
        </a>
      </nav>

      <section id="terms" className="mt-10 scroll-mt-4 space-y-4 text-sm text-zinc-700">
        <h2 className="text-lg font-semibold text-foreground">Terms of use</h2>
        <p>
          Wheewise (operated by Tomatrix Technologies Pvt Ltd) is a marketplace that connects
          buyers with GST-verified vehicle dealers across India. By creating an account or using
          the site, you agree to these terms.
        </p>
        <p>
          <strong>What Wheewise does.</strong> We list pre-owned cars, bikes, and commercial
          vehicles from dealers who have completed our GST verification, and let buyers browse,
          wishlist, and contact dealers through an in-app enquiry chat or WhatsApp.
        </p>
        <p>
          <strong>What Wheewise doesn&apos;t do.</strong> We are not a party to any sale. Pricing,
          negotiation, payment, vehicle inspection, and handover are arranged directly between the
          buyer and the dealer. Wheewise does not process payments or guarantee the condition,
          title, or accuracy of any listing.
        </p>
        <p>
          <strong>Accounts.</strong> You&apos;re responsible for keeping your login credentials
          secure and for the accuracy of the information you provide. We may suspend an account
          used for fraud, abuse, or to circumvent dealer verification.
        </p>
        <p>
          <strong>Dealer listings.</strong> Dealers must hold a valid, active GST registration to
          list vehicles and are responsible for the accuracy of their listings and business
          information.
        </p>
        <p>
          <strong>Changes.</strong> We may update these terms as the product changes; continued
          use after an update means you accept the revised terms.
        </p>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-4 space-y-4 text-sm text-zinc-700">
        <h2 className="text-lg font-semibold text-foreground">Privacy policy</h2>
        <p>
          <strong>Information we collect.</strong> Name, email, and phone number when you create
          an account; business name and GSTIN if you register as a dealer; your city or location
          (either typed in, or — only with your permission — detected from your browser to suggest
          nearby listings); and the content of enquiries you send to dealers.
        </p>
        <p>
          <strong>How we use it.</strong> To run your account, show relevant listings, connect you
          with dealers, and secure the platform against bots and abuse (via Cloudflare Turnstile).
          We don&apos;t sell your personal data.
        </p>
        <p>
          <strong>Sign-in.</strong> You can create an account with an email and password or with
          Google sign-in. If you use Google, we receive your name, email, and profile picture from
          Google to set up your account — we don&apos;t receive your Google password.
        </p>
        <p>
          <strong>WhatsApp.</strong> The WhatsApp button on a listing opens a chat with the dealer
          on WhatsApp with a pre-filled message; this happens on WhatsApp&apos;s own platform under
          its own privacy terms, not ours.
        </p>
        <p>
          <strong>Where data is stored.</strong> Account data and enquiries are stored with
          Supabase (our database and authentication provider). Vehicle photos and dealer
          verification documents are stored with Cloudflare R2. Location lookups (converting
          coordinates to a city name) are sent to OpenStreetMap&apos;s Nominatim service.
        </p>
        <p>
          <strong>Cookies & local storage.</strong> We use your browser&apos;s local storage to
          remember things like your chosen city and whether you&apos;ve dismissed a banner —
          nothing here is used for cross-site ad tracking.
        </p>
        <p>
          <strong>Your choices.</strong> You can decline the location permission prompt and type
          your city instead. To access, correct, or delete your account data, contact us at{" "}
          <a href="mailto:wheewise@gmail.com" className="text-brand hover:underline">
            wheewise@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
