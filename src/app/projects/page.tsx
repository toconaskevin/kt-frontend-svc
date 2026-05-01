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
    <div className="neon-page">
      <AppNav />
      <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold">Projects</h1>
        <p className="neon-muted mt-1 text-sm">List of projects</p>
        <div className="neon-surface mt-6 p-6">
          {loading && <p className="neon-muted">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && (
            <ul className="space-y-4">
              {projects.length === 0 ? (
                <li className="neon-muted">No projects yet.</li>
              ) : (
                projects.map((p, idx) => (
                  <li
                    key={p._id ?? p.name ?? String(idx)}
                    className="neon-divider border-b pb-4 last:border-0"
                  >
                    <div className="font-medium">{p.name ?? "Untitled"}</div>
                    {p.description && (
                      <p className="neon-muted mt-1 text-sm">
                        {p.description}
                      </p>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-link mt-2 inline-block text-sm"
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
