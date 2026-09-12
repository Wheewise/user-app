import { useEffect, type RefObject } from "react";

// Shared by the header's Account and Notifications dropdowns — closes the
// panel on any click outside it, without each dropdown re-implementing the
// same listener.
export function useClickOutside(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [active, ref, onOutside]);
}
