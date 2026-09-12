import { Skeleton } from "../../Skeleton";
import { BackHeader } from "../../BackHeader";

export default function ChatSafetyTipsLoading() {
  return (
    <div>
      <BackHeader title="Chat safety tips" />
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
