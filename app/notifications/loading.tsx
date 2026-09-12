import { Skeleton } from "../Skeleton";
import { BackHeader } from "../BackHeader";

export default function NotificationsLoading() {
  return (
    <div>
      <BackHeader title="Notifications" />
      <div className="flex flex-col items-center px-6 py-10">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="mt-4 h-4 w-32" />
        <Skeleton className="mt-2 h-3.5 w-44" />
      </div>
    </div>
  );
}
