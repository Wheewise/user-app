import { isMobileDevice } from "../lib/device";
import { Skeleton, VehicleCardSkeleton } from "./Skeleton";

export default async function HomeLoading() {
  const mobile = await isMobileDevice();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
      {mobile ? (
        <div className="mb-6 flex gap-4 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      ) : null}
      <Skeleton className="mb-4 h-6 w-40" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
    </div>
  );
}
