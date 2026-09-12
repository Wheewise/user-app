import { Skeleton, AuthCardSkeleton, AuthFieldSkeleton } from "../Skeleton";

export default function SignupLoading() {
  return (
    <AuthCardSkeleton>
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-px flex-1" />
      </div>
      <AuthFieldSkeleton labelWidth="w-20" />
      <AuthFieldSkeleton labelWidth="w-12" />
      <AuthFieldSkeleton labelWidth="w-28" />
      <AuthFieldSkeleton labelWidth="w-16" />
      <AuthFieldSkeleton labelWidth="w-32" />
      <Skeleton className="mx-auto h-16 w-64" />
      <Skeleton className="h-11 w-full rounded-full" />
    </AuthCardSkeleton>
  );
}
