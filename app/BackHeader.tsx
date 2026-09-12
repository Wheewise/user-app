"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@wheewise/ui";

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 border-b border-border-default px-4 py-3.5">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="text-foreground hover:text-zinc-500"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
