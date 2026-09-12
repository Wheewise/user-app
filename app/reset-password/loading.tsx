import { Skeleton, AuthCardSkeleton, AuthFieldSkeleton } from "../Skeleton";

export default function ResetPasswordLoading() {
  return (
    <AuthCardSkeleton>
      <AuthFieldSkeleton labelWidth="w-28" />
      <AuthFieldSkeleton labelWidth="w-32" />
      <Skeleton className="h-11 w-full rounded-full" />
    </AuthCardSkeleton>
  );
}
