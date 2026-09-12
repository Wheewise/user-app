import type { ComponentType, SVGProps } from "react";

// Shared shape for an inert "not built yet" row (Notifications, Select
// language, Delete account, …) — used in both MobileMenu.tsx and
// settings/page.tsx instead of each hand-rolling the same icon+label+badge
// markup, which had drifted into four separate copies.
export function SoonRow({
  icon: Icon,
  label,
}: {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-default px-4 py-3.5 text-sm font-medium text-zinc-400">
      {Icon ? <Icon className="h-5 w-5 text-zinc-400" /> : null}
      {label}
      <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-zinc-500">
        Soon
      </span>
    </div>
  );
}
