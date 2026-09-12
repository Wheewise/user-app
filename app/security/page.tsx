import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vulnerability Disclosure Program" };

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Vulnerability disclosure program</h1>
      <p className="mt-2 text-sm text-zinc-500">
        We take the security of Wheewise seriously and welcome reports from security researchers.
      </p>

      <div className="mt-8 space-y-8 text-sm text-zinc-700">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Scope</h2>
          <p className="mt-2">
            wheewise.com, dealer.wheewise.com, and association.wheewise.com. Third-party services
            we rely on (Supabase, Cloudflare, Google, WhatsApp, etc.) are out of scope — please
            report issues in those directly to their own security teams.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">How to report</h2>
          <p className="mt-2">
            Email{" "}
            <a href="mailto:wheewise@gmail.com" className="text-brand hover:underline">
              wheewise@gmail.com
            </a>{" "}
            with a description of the issue, steps to reproduce it, and its potential impact.
            Please don&apos;t include real user data or account credentials that aren&apos;t your
            own in your report.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Guidelines</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Only test against accounts and data you own or have explicit permission to use.</li>
            <li>
              Don&apos;t run automated scans or load tests that could degrade the service for
              other users.
            </li>
            <li>Don&apos;t attempt social engineering against our team, dealers, or users.</li>
            <li>Don&apos;t access, modify, or delete data that isn&apos;t yours.</li>
            <li>Give us a reasonable amount of time to fix an issue before disclosing it publicly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">What to expect from us</h2>
          <p className="mt-2">
            We&apos;ll acknowledge your report within a few business days and keep you updated as
            we investigate and fix the issue. We don&apos;t currently run a paid bug bounty
            program, but we&apos;re happy to credit researchers who report a valid issue in good
            faith, if you&apos;d like.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Safe harbor</h2>
          <p className="mt-2">
            We won&apos;t pursue legal action against anyone who reports a vulnerability in good
            faith and in line with these guidelines.
          </p>
        </section>
      </div>
    </div>
  );
}
