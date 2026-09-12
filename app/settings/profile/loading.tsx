import { Skeleton, AuthFieldSkeleton } from "../../Skeleton";
import { BackHeader } from "../../BackHeader";

export default function ProfileLoading() {
  return (
    <div>
      <BackHeader title="Edit profile" />
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
        <section>
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <AuthFieldSkeleton labelWidth="w-20" />
            </div>
          </div>
        </section>
        <section>
          <Skeleton className="mb-4 h-4 w-36" />
          <div className="space-y-4">
            <AuthFieldSkeleton labelWidth="w-28" />
            <AuthFieldSkeleton labelWidth="w-12" />
          </div>
        </section>
        <Skeleton className="h-9 w-full" />
        <section>
          <Skeleton className="mb-4 h-4 w-40" />
          <Skeleton className="h-14 w-full" />
        </section>
      </div>
    </div>
  );
}
