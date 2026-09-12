import { Skeleton, VehicleCardSkeleton } from "../Skeleton";

export default function WishlistLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="mb-6 h-6 w-40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
