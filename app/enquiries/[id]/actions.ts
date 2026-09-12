"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { requireAuthContext } from "@wheewise/rbac";

export async function sendMessage(enquiryId: string, body: string) {
  if (!body.trim()) return;
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  // RLS scopes this to participants only — see enquiries/messages policies
  // in supabase/migrations/0001_init.sql.
  await supabase.from("messages").insert({ enquiry_id: enquiryId, sender_id: userId, body });
  revalidatePath(`/enquiries/${enquiryId}`);
}

export async function requestTestDrive(enquiryId: string) {
  const supabase = await createServerSupabaseClient();
  const { userId } = await requireAuthContext(supabase);

  await supabase.from("enquiries").update({ test_drive_requested: true }).eq("id", enquiryId);
  await supabase.from("messages").insert({
    enquiry_id: enquiryId,
    sender_id: userId,
    body: "I'd like to book a test drive — what times work for you?",
  });
  revalidatePath(`/enquiries/${enquiryId}`);
}
