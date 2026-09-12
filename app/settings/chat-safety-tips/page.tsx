import type { Metadata } from "next";
import { BackHeader } from "../../BackHeader";

export const metadata: Metadata = { title: "Chat safety tips", robots: { index: false, follow: false } };

export default function ChatSafetyTipsPage() {
  return (
    <div>
      <BackHeader title="Chat safety tips" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <ul className="space-y-4 text-sm text-zinc-600">
          <li>
            <p className="font-medium text-foreground">Keep the conversation on Wheewise</p>
            <p className="mt-1">
              Enquire and chat through the app so there&apos;s a record of what was discussed if
              something goes wrong.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">Inspect the vehicle in person before paying</p>
            <p className="mt-1">
              Never send money, a deposit, or your ID documents to a dealer you haven&apos;t met or
              verified.
            </p>
          </li>
          <li>
            <p className="font-medium text-foreground">Meet at the dealer&apos;s verified storefront</p>
            <p className="mt-1">Prefer a public, verifiable location over an unfamiliar address.</p>
          </li>
          <li>
            <p className="font-medium text-foreground">Report anything that feels off</p>
            <p className="mt-1">
              If a dealer pressures you to pay upfront or move off-platform, email{" "}
              <a href="mailto:wheewise@gmail.com" className="text-brand hover:underline">
                wheewise@gmail.com
              </a>
              .
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
