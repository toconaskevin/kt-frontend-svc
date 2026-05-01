"use client";

import { api } from "@/lib/api";
import { AppNav } from "@/components/AppNav";

export default function CVPage() {
  const cvUrl = api.cv.url();

  return (
    <div className="neon-page">
      <AppNav />
      <div className="w-full min-w-0 px-4 py-8">
      <div className="mx-auto w-full min-w-0 max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold">CV</h1>
        <p className="neon-muted mt-1 text-sm">Download the CV (PDF)</p>
        <div className="neon-surface mt-6 p-6">
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn"
          >
            Download CV (PDF)
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}
