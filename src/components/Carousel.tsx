"use client";

import { useMemo, useRef } from "react";

export function Carousel<T extends { id?: string }>({
  title,
  items,
  getKey,
  renderItem,
  emptyText = "Nothing to show yet.",
}: {
  title: string;
  items: T[];
  getKey?: (item: T, idx: number) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const keys = useMemo(
    () =>
      items.map(
        (item, idx) =>
          getKey?.(item, idx) ?? (item.id ? String(item.id) : String(idx))
      ),
    [items, getKey]
  );

  function scrollBy(delta: number) {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {emptyText}
        </p>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-3 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, idx) => (
            <div
              key={keys[idx]}
              className="min-w-[240px] max-w-[240px] shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

