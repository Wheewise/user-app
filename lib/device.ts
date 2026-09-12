import { headers } from "next/headers";

// "Mobi" (not bare "Android") on purpose: Android phones and iPhone/iPod
// both include the "Mobile" token in their real UA specifically to request
// phone-optimized sites; Android *tablets* deliberately omit it to request
// the desktop site, same as modern iPadOS. Matching bare "Android" would
// wrongly catch tablets too.
const MOBILE_UA_RE = /Mobi/i;

// Real device detection (User-Agent), not a CSS breakpoint — resizing a
// desktop browser window must never flip the layout; only an actual
// phone's browser gets the compact mobile experience. Tablets get the
// desktop layout, which already has the room for it.
export async function isMobileDevice(): Promise<boolean> {
  const ua = (await headers()).get("user-agent") ?? "";
  return MOBILE_UA_RE.test(ua);
}
