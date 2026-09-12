"use server";

import { createServerSupabaseClient } from "@wheewise/supabase/server";
import { z } from "zod";

// Upper bounds too, not just lower — an unbounded string accepted here
// would let a single request write an arbitrarily large row (and, since
// there's no rate limiting on this action, repeated ones), and Supabase's
// own password hashing has no reason to ever see more than a sane max.
const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  phone: z.string().min(10).max(20),
  turnstileToken: z.string().max(4096),
});

export type SignupState =
  | { ok: true; needsConfirmation: boolean }
  | { ok: false; errors: Record<string, string[]>; formError?: string };

export async function signupBuyer(
  _prev: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  const { name, email, password, phone, turnstileToken } = parsed.data;

  // Verified server-side by Supabase itself (Authentication > Settings >
  // Bot and Abuse Protection must be enabled) — do not also verify this
  // token independently before calling signUp: Turnstile tokens are
  // single-use, so a separate check here would consume it and make
  // Supabase's own verification fail on the same request.
  const supabase = await createServerSupabaseClient();
  // The profile row is NOT created here — with email confirmation enabled,
  // signUp() returns no active session yet, so there's no auth.uid() for
  // RLS to check. Metadata travels with the auth user instead, and
  // `on_auth_user_confirmed` (see supabase/migrations) creates the profile
  // the moment the confirmation link is actually clicked.
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken: turnstileToken,
      // Must land on /auth/callback, not just "/" — that route is what
      // actually exchanges Supabase's confirmation code for a session
      // (exchangeCodeForSession). Landing anywhere else leaves the click
      // "verified" server-side but the browser still signed out, forcing
      // the user to log in again right after confirming.
      emailRedirectTo: `${process.env.APP_URL}/auth/callback?callbackUrl=/`,
      data: { role: "BUYER", name, phone },
    },
  });
  if (signUpError) {
    const formError =
      signUpError.code === "user_already_exists"
        ? "An account with this email already exists. Try signing in instead."
        : signUpError.message;
    return { ok: false, errors: {}, formError };
  }
  if (!signUpData.user) {
    return { ok: false, errors: {}, formError: "Signup failed." };
  }
  // Supabase doesn't return an error for an already-registered email (even
  // one that originally signed up via Google) — to avoid leaking which
  // emails exist, it returns a fake "success" whose user has no identities
  // attached. This is the only way to detect that case here.
  if (signUpData.user.identities?.length === 0) {
    return {
      ok: false,
      errors: {},
      formError: "An account with this email already exists. Try signing in instead.",
    };
  }

  return { ok: true, needsConfirmation: !signUpData.session };
}
