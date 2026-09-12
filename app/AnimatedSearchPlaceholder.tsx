"use client";

import { useEffect, useState } from "react";

const TERMS = ["Cars", "Bikes", "Commercial", "Autorickshaw", "Taxi"];
const CYCLE_MS = 2200;
const TRANSITION_MS = 300;

// A decorative overlay, not the real placeholder — a native <input
// placeholder> swaps text instantly with no way to animate it. The real
// input keeps placeholder=" " (a non-empty placeholder, so :placeholder-shown
// still applies) purely so the peer-[:not(:placeholder-shown)]:hidden below
// can hide this overlay the moment the visitor types something.
export function AnimatedSearchPlaceholder({ className }: { className: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % TERMS.length);
        setVisible(true);
      }, TRANSITION_MS);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`pointer-events-none absolute inset-y-0 flex items-center overflow-hidden text-sm text-zinc-400 peer-[:not(:placeholder-shown)]:hidden ${className}`}
    >
      <span
        className={`inline-block whitespace-nowrap transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
        }`}
      >
        Search &quot;{TERMS[index]}&quot;
      </span>
    </span>
  );
}
