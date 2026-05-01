"use client";

import { useLayoutEffect, useMemo, useRef } from "react";

export function Carousel<T extends object>({
  title,
  items,
  getKey,
  renderItem,
  emptyText = "Nothing to show yet.",
  loading = false,
  overlayControls = false,
}: {
  title: string;
  items: T[];
  getKey?: (item: T, idx: number) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
  loading?: boolean;
  overlayControls?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const keys = useMemo(
    () =>
      items.map(
        (item, idx) =>
          getKey?.(item, idx) ??
          ("id" in item && item.id != null ? String(item.id) : String(idx))
      ),
    [items, getKey]
  );

  function getScrollStepPx() {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.children.length < 2) return 320;
    const a = scroller.children[0] as HTMLElement;
    const b = scroller.children[1] as HTMLElement;
    return Math.max(1, b.offsetLeft - a.offsetLeft);
  }

  function scrollBy(delta: number) {
    scrollerRef.current?.scrollBy({
      left: Math.sign(delta) * getScrollStepPx(),
      behavior: "smooth",
    });
  }

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const track = scroller;

    function centerIndex(idx: number) {
      const target = track.children[idx] as HTMLElement | undefined;
      if (!target) return;
      const nextLeft =
        target.offsetLeft - track.clientWidth / 2 + target.offsetWidth / 2;
      const maxLeft = track.scrollWidth - track.clientWidth;
      track.scrollLeft = Math.max(0, Math.min(maxLeft, nextLeft));
    }

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (loading && items.length === 0) {
          // Loading skeleton: 3 placeholder cards → start on the middle one
          if (scroller.children.length >= 2) centerIndex(1);
          return;
        }

        if (!loading && items.length > 0) {
          const idx = Math.max(0, Math.floor((items.length - 1) / 2));
          centerIndex(idx);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [loading, items.length, keys]);

  return (
    <div className="neon-surface w-full min-w-0 p-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div />
        <h2 className="justify-self-center text-sm font-semibold tracking-wide">
          {title}
        </h2>
        <div
          className={`hidden justify-self-end sm:flex sm:items-center sm:gap-2 ${
            overlayControls ? "invisible" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="neon-btn h-8 w-8 p-0"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="neon-btn h-8 w-8 p-0"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="relative mt-3">
          <div
            ref={scrollerRef}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 py-5 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            aria-busy="true"
            aria-label={`Loading ${title}`}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="neon-card flex min-h-[92px] w-[min(320px,calc(100vw-5rem))] shrink-0 snap-center items-center justify-center p-4 text-center sm:w-[320px]"
              >
                <div className="w-full">
                  <div className="mx-auto h-4 w-4/5 max-w-[180px] animate-pulse rounded bg-white/10" />
                  <div className="mx-auto mt-2 h-3 w-3/5 max-w-[120px] animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>

          {overlayControls ? (
            <>
              <button
                type="button"
                onClick={() => scrollBy(-320)}
                className="neon-btn pointer-events-auto absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 rounded-full p-0 sm:inline-flex"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollBy(320)}
                className="neon-btn pointer-events-auto absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 rounded-full p-0 sm:inline-flex"
                aria-label="Scroll right"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      ) : items.length === 0 ? (
        <p className="neon-muted mt-3 text-sm">{emptyText}</p>
      ) : (
        <div className="relative mt-3">
          <div
            ref={scrollerRef}
            className="-mx-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 py-5 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          >
            {items.map((item, idx) => (
              <div
                key={keys[idx]}
                className="neon-card flex min-h-[92px] w-[min(320px,calc(100vw-5rem))] shrink-0 snap-center items-center justify-center p-4 text-center sm:w-[320px]"
              >
                <div className="w-full">{renderItem(item)}</div>
              </div>
            ))}
          </div>

          {overlayControls ? (
            <>
              <button
                type="button"
                onClick={() => scrollBy(-320)}
                className="neon-btn pointer-events-auto absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 rounded-full p-0 sm:inline-flex"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollBy(320)}
                className="neon-btn pointer-events-auto absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 rounded-full p-0 sm:inline-flex"
                aria-label="Scroll right"
              >
                ›
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

