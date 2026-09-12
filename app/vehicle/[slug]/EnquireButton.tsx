"use client";

import { useTransition } from "react";
import { Button } from "@wheewise/ui";
import { useLoginModal } from "../../LoginModalProvider";
import { startEnquiry } from "./actions";

export function EnquireButton({
  vehicleId,
  isAuthenticated,
}: {
  vehicleId: string;
  isAuthenticated: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const { open } = useLoginModal();

  return (
    <Button
      disabled={pending}
      onClick={() => (isAuthenticated ? startTransition(() => startEnquiry(vehicleId)) : open())}
      className="w-full"
    >
      {pending ? "Starting chat…" : "Enquire"}
    </Button>
  );
}
