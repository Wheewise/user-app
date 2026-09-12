import { Skeleton } from "../../Skeleton";

export default function VehicleLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 pb-8">
      <Skeleton className="mb-4 h-4 w-56" />
      <div className="grid gap-8 sm:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-11 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
