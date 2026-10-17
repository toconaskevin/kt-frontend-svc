"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageShell } from "@/components/PageShell";

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
    <PageShell>
      <div className="site-container py-10 md:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
        <p className="neon-muted mt-2 text-sm">
          Public work and technical evidence.
        </p>
        {loading && <p className="neon-muted mt-8">Loading…</p>}
        {error && (
          <p className="mt-8 text-sm text-red-600">{error}</p>
        )}
        {!loading && !error && (
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.length === 0 ? (
              <li className="card-surface p-6 text-sm text-[color:var(--muted-foreground)] md:col-span-2">
                No projects yet.
              </li>
            ) : (
              projects.map((p, idx) => (
                <li
                  key={p._id ?? p.name ?? String(idx)}
                  className="card-surface flex flex-col overflow-hidden"
                >
                  <div className="flex h-28 items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-sky-700 px-4 text-center text-sm font-semibold text-white">
                    {p.name ?? "Project"}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-lg font-bold">{p.name ?? "Untitled"}</div>
                    {p.description ? (
                      <p className="neon-muted mt-2 text-sm leading-relaxed">
                        {p.description}
                      </p>
                    ) : null}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-link mt-4 inline-block text-sm"
                      >
                        View details →
                      </a>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
