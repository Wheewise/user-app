import { Skeleton } from "../Skeleton";
import { BackHeader } from "../BackHeader";

export default function SettingsLoading() {
  return (
    <div>
      <BackHeader title="Settings" />
      <div className="mx-auto max-w-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border-default px-4 py-3.5">
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
