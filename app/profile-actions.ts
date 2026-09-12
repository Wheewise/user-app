"use server";

import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { z } from "zod";

const phoneSchema = z.string().min(10).max(20);

export async function savePhone(phone: string): Promise<{ ok: boolean; error?: string }> {
  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) return { ok: false, error: "Enter a valid phone number." };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("profiles").update({ phone: parsed.data }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

const profileSchema = z.object({
  name: z.string().min(1, "Enter your name.").max(100, "Name is too long."),
  phone: z.string().min(10, "Enter a valid phone number.").max(20, "Enter a valid phone number."),
});

export async function saveProfile(input: {
  name: string;
  phone: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ name: parsed.data.name, phone: parsed.data.phone })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
