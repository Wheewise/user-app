"use server";

import { cookies } from "next/headers";
import { locales, LOCALE_COOKIE, type Locale } from "../i18n/locales";

export async function setLocale(locale: string) {
  if (!(locales as readonly string[]).includes(locale)) return;
  const store = await cookies();
  // A year — matches how long a returning visitor's language choice
  // should reasonably stick without asking again.
  store.set(LOCALE_COOKIE, locale as Locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
}
