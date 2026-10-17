"use client";

import { useState } from "react";
import { techIconSrc } from "@/lib/techIcons";

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#6366f1",
  "#0891b2",
  "#1d4ed8",
  "#0284c7",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function TechMark({ name, colorIndex }: { name: string; colorIndex: number }) {
  const src = techIconSrc(name);
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
      style={{ background: COLORS[colorIndex % COLORS.length] }}
      aria-hidden
    >
      {initials(name) || "·"}
    </span>
  );
}

export function TechStackGrid({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((name, i) => (
        <li
          key={name}
          className="card-surface flex flex-col items-center gap-3 px-3 py-5 text-center transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          <TechMark name={name} colorIndex={i} />
          <span className="text-sm font-semibold text-[color:var(--foreground)]">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
