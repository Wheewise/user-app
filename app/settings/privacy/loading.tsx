import { Skeleton } from "../../Skeleton";
import { BackHeader } from "../../BackHeader";

export default function PrivacyLoading() {
  return (
    <div>
      <BackHeader title="Privacy" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
