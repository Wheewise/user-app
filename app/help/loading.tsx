import { Skeleton } from "../Skeleton";

function QuestionSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3.5 w-full" />
    </div>
  );
}

export default function HelpLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-full" />

      <div className="mt-8 space-y-8">
        <section>
          <Skeleton className="h-5 w-48" />
          <div className="mt-3 space-y-4">
            <QuestionSkeleton />
            <QuestionSkeleton />
          </div>
        </section>

        <section>
          <Skeleton className="h-5 w-36" />
          <div className="mt-3 space-y-4">
            <QuestionSkeleton />
            <QuestionSkeleton />
            <QuestionSkeleton />
            <QuestionSkeleton />
          </div>
        </section>

        <section>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-3 h-3.5 w-full" />
        </section>
      </div>
    </div>
  );
}
