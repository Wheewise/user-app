import { BellIcon } from "@wheewise/ui";

// Shared empty state — there's no notifications system built yet, so this
// is the only state this screen/panel will ever show. Reused by both the
// desktop dropdown and the mobile /notifications page rather than each
// hand-rolling its own "empty" copy.
export function NoNotifications() {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
        <BellIcon className="h-9 w-9 text-zinc-300" />
      </span>
      <p className="mt-4 font-semibold text-foreground">No notifications</p>
      <p className="mt-1 text-sm text-zinc-500">Check back here for updates!</p>
    </div>
  );
}
