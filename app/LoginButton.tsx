"use client";

import { UserIcon } from "@wheewise/ui";
import { useLoginModal } from "./LoginModalProvider";

export function LoginButton() {
  const { open } = useLoginModal();
  return (
    <button
      type="button"
      onClick={() => open()}
      className="flex flex-col items-center gap-0.5 text-foreground hover:text-brand"
    >
      <UserIcon className="h-5 w-5" />
      <span className="hidden text-xs font-medium sm:inline">Login</span>
    </button>
  );
}
