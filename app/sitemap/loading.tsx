import { Skeleton } from "../Skeleton";

function LinkListSkeleton({ rows }: { rows: number }) {
  return (
    <div>
      <Skeleton className="mb-3 h-3.5 w-20" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-28" />
        ))}
      </div>
    </div>
  );
}

export default function SitemapLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-2 h-4 w-56" />

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <LinkListSkeleton rows={7} />
        <LinkListSkeleton rows={8} />
        <LinkListSkeleton rows={3} />
        <LinkListSkeleton rows={3} />
      </div>
    </div>
  );
}
