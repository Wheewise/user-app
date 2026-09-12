import { Skeleton, VehicleCardSkeleton } from "../Skeleton";

export default function BrowseLoading() {
  return (
    <div className="px-4 pt-4 pb-8 sm:px-6">
      <Skeleton className="mb-4 h-4 w-48" />
      <div className="grid gap-3 lg:grid-cols-[240px_1fr] lg:gap-6">
        <Skeleton className="hidden h-[420px] lg:block" />
        <div>
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
