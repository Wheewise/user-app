// Shared shimmer block — reuses bg-surface-muted, the same neutral already
// used everywhere else in the app for empty image placeholders, so a
// loading state and an empty state read as the same visual language.
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-muted ${className}`} />;
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 border-l-4 border-border-default px-3 py-2.5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

// Matches AuthLayout.tsx's own markup exactly (same wrapper/card classes)
// so the shell doesn't visibly shift once the real page swaps in — only
// the fields inside (passed as children) differ per auth page.
export function AuthCardSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border-default bg-background p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function AuthFieldSkeleton({ labelWidth = "w-16" }: { labelWidth?: string }) {
  return (
    <div className="space-y-1.5">
      <Skeleton className={`h-3.5 ${labelWidth}`} />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
