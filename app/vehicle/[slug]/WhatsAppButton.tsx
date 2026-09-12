"use client";

import { WhatsAppIcon } from "@wheewise/ui";

export function WhatsAppButton({
  dealerWhatsapp,
  vehicleUrl,
  vehicleTitle,
}: {
  dealerWhatsapp: string;
  vehicleUrl: string;
  vehicleTitle: string;
}) {
  const message = `Hi, I'm interested in your ${vehicleTitle} listed on Wheewise: ${vehicleUrl}`;
  const href = `https://wa.me/${dealerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-default px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
    >
      <WhatsAppIcon className="h-4 w-4" />
      WhatsApp the dealer
    </a>
  );
}
