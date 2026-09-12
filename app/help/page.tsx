import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help & Support" };

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Help & support</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Answers to common questions about buying on Wheewise. Can&apos;t find what you need?{" "}
        <a href="mailto:wheewise@gmail.com" className="text-brand hover:underline">
          Email us
        </a>
        .
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-semibold">Browsing & accounts</h2>
          <dl className="mt-3 space-y-4 text-sm">
            <div>
              <dt className="font-medium">Do I need an account to browse listings?</dt>
              <dd className="mt-1 text-zinc-600">
                Yes — creating a free account lets us show you relevant listings and keeps your
                wishlist and enquiries in one place.
              </dd>
            </div>
            <div>
              <dt className="font-medium">How do I search by city or category?</dt>
              <dd className="mt-1 text-zinc-600">
                Use the location picker and search bar at the top of any page, or{" "}
                <Link href="/browse" className="text-brand hover:underline">
                  browse all listings
                </Link>{" "}
                and filter from there.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Buying a vehicle</h2>
          <dl className="mt-3 space-y-4 text-sm">
            <div>
              <dt className="font-medium">How do I contact a seller?</dt>
              <dd className="mt-1 text-zinc-600">
                Open a listing and use the Enquire button to start a chat with the dealer, or the
                WhatsApp button to message them directly — both are visible on every vehicle page.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Are all dealers on Wheewise verified?</dt>
              <dd className="mt-1 text-zinc-600">
                Only GST-verified dealers can list vehicles on Wheewise. A verified badge appears
                next to a dealer&apos;s name on their listings and storefront.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Can I save listings to look at later?</dt>
              <dd className="mt-1 text-zinc-600">
                Yes — tap the heart icon on any listing to add it to your{" "}
                <Link href="/wishlist" className="text-brand hover:underline">
                  wishlist
                </Link>
                .
              </dd>
            </div>
            <div>
              <dt className="font-medium">Does Wheewise handle payments or delivery?</dt>
              <dd className="mt-1 text-zinc-600">
                No — Wheewise connects you with the dealer, but the sale, payment, and handover are
                arranged directly between you and them.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Selling on Wheewise</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Only GST-verified dealers can list vehicles for sale. If you run a dealership,{" "}
            <a href="https://dealer.wheewise.com/signup" className="text-brand hover:underline">
              register on the dealer app
            </a>{" "}
            to get started.
          </p>
        </section>
      </div>
    </div>
  );
}
