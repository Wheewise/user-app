"use client";

import { useRef, useTransition } from "react";
import { Button } from "@wheewise/ui";
import { sendMessage, requestTestDrive } from "./actions";

export function MessageForm({ enquiryId }: { enquiryId: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3 border-t border-border-default p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = ref.current?.value ?? "";
          ref.current!.value = "";
          startTransition(() => sendMessage(enquiryId, value));
        }}
        className="flex gap-2"
      >
        <input
          ref={ref}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-border-default px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button type="submit" disabled={pending}>
          Send
        </Button>
      </form>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => requestTestDrive(enquiryId))}
        className="text-sm font-medium text-brand hover:underline disabled:opacity-50"
      >
        Request a test drive
      </button>
    </div>
  );
}
