import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { ChatIcon } from "@wheewise/ui";
import { Breadcrumb } from "../Breadcrumb";

// Signed-in-only, one buyer's own data — nothing here is ever the same
// page twice, so there's nothing worth a search engine indexing.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EnquiriesPage() {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, created_at, vehicles(make, model, year, photo_urls), dealers(business_name)")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-8">
      <Breadcrumb items={[["Home", "/"], ["My Enquiries", null]]} />
      <h1 className="mb-6 text-xl font-semibold">Chat</h1>
      {(enquiries ?? []).length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted">
            <ChatIcon className="h-11 w-11 text-zinc-300" />
          </span>
          <p className="mt-5 text-lg font-semibold">No messages, yet?</p>
          <p className="mt-1 max-w-xs text-sm text-zinc-500">
            We&apos;ll keep messages for any listing you enquire about here — enquire on a listing to
            start a conversation with the dealer.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-default rounded-lg border border-border-default">
          {(enquiries ?? []).map((e) => {
            const vehicle = e.vehicles as unknown as {
              make: string;
              model: string;
              year: number;
              photo_urls: string[];
            };
            const dealer = e.dealers as unknown as { business_name: string };
            return (
              <Link
                key={e.id}
                href={`/enquiries/${e.id}`}
                className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-muted"
              >
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  {vehicle.photo_urls[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vehicle.photo_urls[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-zinc-500">{dealer.business_name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
