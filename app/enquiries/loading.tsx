import { Skeleton } from "../Skeleton";

export default function EnquiriesLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-8">
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="mb-6 h-6 w-40" />
      <div className="divide-y divide-border-default rounded-lg border border-border-default">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-14 w-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
