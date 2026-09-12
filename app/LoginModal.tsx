"use client";

import { CloseIcon } from "@wheewise/ui";
import { LoginForm } from "./LoginForm";

export function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-xl border border-border-default bg-background p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-400 hover:text-foreground"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <LoginForm />
      </div>
    </div>
  );
}
