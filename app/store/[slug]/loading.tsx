import { Skeleton } from "../../Skeleton";

export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="px-4 pt-4">
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="aspect-[3/1] w-full rounded-none" />
      <div className="px-4">
        <div className="-mt-12 flex items-end gap-4">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full border-4 border-background" />
        </div>
        <Skeleton className="mt-3 h-6 w-48" />
        <Skeleton className="mt-3 h-4 w-32" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-0.5 px-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-none" />
        ))}
      </div>
    </div>
  );
}
