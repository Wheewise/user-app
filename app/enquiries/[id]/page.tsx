import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";
import { MessageForm } from "./MessageForm";

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  // RLS restricts this to the buyer/dealer participants — a non-participant
  // gets an empty result rather than an authorization error, so this reads
  // as a plain 404 either way.
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("*, vehicles(make, model, year)")
    .eq("id", id)
    .single();
  if (!enquiry) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("enquiry_id", id)
    .order("created_at", { ascending: true });

  const vehicle = enquiry.vehicles as unknown as { make: string; model: string; year: number };

  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] max-w-2xl flex-col px-4 py-4">
      <h1 className="mb-4 text-lg font-semibold">
        {vehicle.make} {vehicle.model}
      </h1>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border-default p-4">
        {(messages ?? []).map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              m.sender_id === userId
                ? "ml-auto bg-brand text-white"
                : "bg-surface-muted text-foreground"
            }`}
          >
            {m.body}
          </div>
        ))}
        {(messages ?? []).length === 0 ? (
          <p className="text-sm text-zinc-500">Say hello to get the conversation started.</p>
        ) : null}
      </div>
      <MessageForm enquiryId={id} />
    </div>
  );
}
