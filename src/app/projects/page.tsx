"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AppNav } from "@/components/AppNav";

type Project = {
  _id?: string;
  name?: string;
  description?: string;
  url?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.projects
      .list()
      .then((list) => {
        if (!cancelled) setProjects(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load projects");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav />
      <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Projects
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          List of projects
        </p>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {loading && <p className="text-zinc-500">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && (
            <ul className="space-y-4">
              {projects.length === 0 ? (
                <li className="text-zinc-500">No projects yet.</li>
              ) : (
                projects.map((p) => (
                  <li key={p._id ?? p.name ?? Math.random()} className="border-b border-zinc-100 pb-4 last:border-0 dark:border-zinc-800">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {p.name ?? "Untitled"}
                    </div>
                    {p.description && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {p.description}
                      </p>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        {p.url}
                      </a>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
