"use client";

import { useLoginModal } from "./LoginModalProvider";

export function FooterSignInLink() {
  const { open } = useLoginModal();
  return (
    <li>
      <button type="button" onClick={() => open()} className="text-sm text-zinc-600 hover:text-brand">
        Sign in
      </button>
    </li>
  );
}
