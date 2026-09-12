"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { LoginModal } from "./LoginModal";

type LoginModalContextValue = { open: () => void; close: () => void };

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error("useLoginModal must be used within LoginModalProvider");
  return ctx;
}

// Opening used to be a <Link href="/?login=1"> navigation — which, even to
// the same route, re-runs every server component in the tree (the auth
// check in this layout, the vehicle query in page.tsx) before the modal
// could show, making the card feel slow to appear. Local state opens it
// instantly; the URL param is only read once on mount, to support the
// server-redirect case (middleware sends signed-out visitors to
// /?login=1 when they hit a gated page).
export function LoginModalProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [open_, setOpen] = useState(() => searchParams.get("login") === "1");

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <LoginModalContext.Provider value={{ open, close }}>
      {children}
      {open_ ? <LoginModal onClose={close} /> : null}
    </LoginModalContext.Provider>
  );
}
