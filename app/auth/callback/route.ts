import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { safeRedirect } from "../../../lib/safeRedirect";

// Supabase redirects here with a PKCE `code` after either Google's consent
// screen or an email confirmation link click — exchange it for a session
// (sets the auth cookies) before sending them on to where they were headed.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const callbackUrl = safeRedirect(searchParams.get("callbackUrl"), "/");

  let needsPhone = false;
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    // Google never collects a phone number — CompletePhoneModal asks for
    // one once they land back on the site. Password signups already have
    // it (collected on /signup, copied to profiles by the confirm trigger).
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", data.user.id)
        .single();
      needsPhone = !profile?.phone;
    }
  }

  const url = new URL(callbackUrl, origin);
  if (needsPhone) url.searchParams.set("needsPhone", "1");
  return NextResponse.redirect(url);
}
