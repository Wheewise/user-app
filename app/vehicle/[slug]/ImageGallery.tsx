"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRightIcon, CloseIcon } from "@wheewise/ui";

// Mobile: native horizontal scroll-snap carousel — real touch swipe, not a
// tap-only control, with the active dot tracked from scroll position.
// Desktop: unchanged from before — click a thumbnail to switch the main
// image, no swipe/arrows (kept exactly as it already was on purpose).
//
// Tapping/clicking any image (either layout) opens a fullscreen lightbox.
// Desktop lightbox navigates with left/right arrow buttons; mobile relies
// on swipe only, same as the inline carousel — no buttons needed there.
export function ImageGallery({
  photos,
  title,
  mobile = false,
}: {
  photos: string[];
  title: string;
  mobile?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setActive(index);
    setLightboxOpen(true);
  };

  if (photos.length === 0) {
    return <div className="aspect-video rounded-lg bg-surface-muted" />;
  }

  if (mobile) {
    const onScroll = () => {
      const el = scrollerRef.current;
      if (!el) return;
      setActive(Math.round(el.scrollLeft / el.clientWidth));
    };

    return (
      <>
        <div className="relative">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {photos.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => openLightbox(i)}
                className="aspect-video w-full flex-shrink-0 snap-center bg-surface-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={i === 0 ? title : ""} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          {photos.length > 1 ? (
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {photos.map((url, i) => (
                <span
                  key={url}
                  className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
        {lightboxOpen ? (
          <Lightbox photos={photos} title={title} active={active} setActive={setActive} mobile onClose={() => setLightboxOpen(false)} />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => openLightbox(active)}
          className="block aspect-video w-full overflow-hidden rounded-lg bg-surface-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[active]} alt={title} className="h-full w-full object-cover" />
        </button>
        {photos.length > 1 ? (
          <div className="mt-2 grid grid-cols-5 gap-2">
            {photos.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-md border-2 ${
                  i === active ? "border-brand" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {lightboxOpen ? (
        <Lightbox photos={photos} title={title} active={active} setActive={setActive} mobile={false} onClose={() => setLightboxOpen(false)} />
      ) : null}
    </>
  );
}

function Lightbox({
  photos,
  title,
  active,
  setActive,
  mobile,
  onClose,
}: {
  photos: string[];
  title: string;
  active: number;
  setActive: (i: number) => void;
  mobile: boolean;
  onClose: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keep the swipe scroller positioned on the image that was tapped/clicked
  // to open the lightbox — mount-only, since after this the scroller and
  // `active` stay in sync via onScroll (and the keydown handler below,
  // which scrolls rather than setting `active` directly).
  useEffect(() => {
    if (!mobile) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = active * el.clientWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const next = (active + (e.key === "ArrowRight" ? 1 : -1) + photos.length) % photos.length;
      // Mobile's image is whatever the scroller is actually scrolled to —
      // move the scroller and let its own onScroll handler set `active`
      // from the real position, instead of setting `active` directly and
      // leaving the visible photo behind (scrollLeft never followed it).
      const el = scrollerRef.current;
      if (mobile && el) {
        el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      } else {
        setActive(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length, onClose, setActive, mobile]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
      >
        <CloseIcon className="h-7 w-7" />
      </button>

      {mobile ? (
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((url, i) => (
            <div key={url} className="flex h-full w-full flex-shrink-0 snap-center items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={i === 0 ? title : ""} className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[active]} alt={title} className="max-h-[90vh] max-w-[90vw] object-contain" />
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setActive((active - 1 + photos.length) % photos.length)}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              >
                <ChevronRightIcon className="h-6 w-6 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setActive((active + 1) % photos.length)}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </>
      )}

      {photos.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {active + 1} / {photos.length}
        </div>
      ) : null}
    </div>
  );
}
