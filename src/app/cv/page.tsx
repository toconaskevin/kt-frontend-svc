"use client";

import { api } from "@/lib/api";
import { AppNav } from "@/components/AppNav";

export default function CVPage() {
  const cvUrl = api.cv.url();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav />
      <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          CV
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Download the CV (PDF)
        </p>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Download CV (PDF)
          </a>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            If the CV is not yet uploaded to the object store, this link may return 404 or an error.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
