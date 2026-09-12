import Link from "next/link";
import { ChevronRightIcon } from "@wheewise/ui";

// Shared across every content page (vehicle, browse, store…) so the
// "Home > Category > City > ..." trail looks and behaves identically
// everywhere instead of each page re-implementing its own copy.
export function Breadcrumb({ items }: { items: [string, string | null][] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-500 sm:text-sm">
      {items.map(([label, href], i) => (
        <span key={label} className="flex items-center gap-1">
          {i > 0 ? <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-400" /> : null}
          {href ? (
            <Link href={href} className="hover:text-brand hover:underline">
              {label}
            </Link>
          ) : (
            <span className="max-w-[16rem] truncate text-zinc-600">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
