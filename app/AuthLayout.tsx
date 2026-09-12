import Link from "next/link";
import type { ReactNode } from "react";

// Light, single centered card — matches the site's own default theme
// (see theme.css: "White/light theme is the deliberate default for this
// app, trust-first"), scoped to just /login and /signup via this wrapper.
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  // Optional: pages whose content switches between multiple headings at
  // runtime (e.g. sign-in vs. forgot-password) render their own instead of
  // fixing one here — otherwise the two headings would stack.
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border-default bg-background p-6 shadow-lg sm:p-8">
        <Link href="/" className="mb-6 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-mark.webp" alt="Wheewise" className="h-12 w-auto" />
        </Link>

        {title ? <h1 className="text-xl font-bold text-foreground">{title}</h1> : null}
        {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}

        <div className={title || subtitle ? "mt-6" : ""}>{children}</div>

        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
