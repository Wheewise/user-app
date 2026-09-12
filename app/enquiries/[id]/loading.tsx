import { Skeleton } from "../../Skeleton";

export default function EnquiryLoading() {
  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] max-w-2xl flex-col px-4 py-4">
      <Skeleton className="mb-4 h-5 w-48" />
      <div className="flex-1 space-y-3 rounded-lg border border-border-default p-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="ml-auto h-10 w-1/2" />
        <Skeleton className="h-10 w-3/5" />
      </div>
      <Skeleton className="mt-3 h-11 w-full" />
    </div>
  );
}
