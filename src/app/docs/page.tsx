"use client";

import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { GatewayStatus } from "@/components/GatewayStatus";

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  description: string;
};

const endpoints: Array<{ group: string; items: Endpoint[] }> = [
  {
    group: "Gateway",
    items: [
      { method: "GET", path: "/auth/health", description: "Auth service healthcheck (used for gateway reachability)." },
      { method: "GET", path: "/profile/health", description: "Profile service healthcheck." },
      { method: "GET", path: "/projects/health", description: "Projects service healthcheck." },
      { method: "GET", path: "/blog/health", description: "Blog service healthcheck." },
      { method: "GET", path: "/cv/health", description: "CV service healthcheck." },
    ],
  },
  {
    group: "Auth",
    items: [
      { method: "POST", path: "/auth/register", description: "Create a user (demo in-memory store)." },
      { method: "POST", path: "/auth/login", description: "Login and receive a JWT." },
      { method: "GET", path: "/auth/me", description: "Get current user from JWT (Authorization: Bearer …)." },
    ],
  },
  {
    group: "Profile",
    items: [
      { method: "GET", path: "/profile/profiles/me", description: "Get the main profile row (single-user)." },
      { method: "GET", path: "/profile/profiles/me/full", description: "Get profile + all sections in one response." },
      { method: "GET", path: "/profile/profiles/me/education", description: "Education section." },
      { method: "GET", path: "/profile/profiles/me/core-competencies", description: "Core competencies section." },
      { method: "GET", path: "/profile/profiles/me/languages", description: "Languages section." },
      { method: "GET", path: "/profile/profiles/me/certifications", description: "Certifications section." },
      { method: "GET", path: "/profile/profiles/me/professional-experience", description: "Professional experience section." },
    ],
  },
  {
    group: "Projects",
    items: [
      { method: "GET", path: "/projects/projects", description: "List all projects." },
      { method: "GET", path: "/projects/projects?limit=5", description: "Latest N projects (sorted by createdAt desc)." },
    ],
  },
  {
    group: "Blog",
    items: [
      { method: "GET", path: "/blog/posts", description: "List all posts." },
      { method: "GET", path: "/blog/posts?limit=5", description: "Latest N posts (sorted by published_at desc)." },
    ],
  },
  {
    group: "CV",
    items: [
      { method: "GET", path: "/cv/cv", description: "Stream the CV PDF from object storage." },
    ],
  },
];

function EndpointRow({ e }: { e: Endpoint }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex w-12 justify-center rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {e.method}
        </span>
        <code className="text-sm text-zinc-900 dark:text-zinc-100">{e.path}</code>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:ml-6 sm:text-right">
        {e.description}
      </p>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          API Docs
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Public endpoints exposed through the gateway.
        </p>

        <div className="mt-6">
          <GatewayStatus />
        </div>

        <div className="mt-10 space-y-10">
          {endpoints.map((group) => (
            <section key={group.group}>
              <h2 className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
                {group.group}
              </h2>
              <div className="mt-3 grid gap-3">
                {group.items.map((e) => (
                  <EndpointRow key={`${e.method}:${e.path}`} e={e} />
                ))}
              </div>
            </section>
          ))}
        </div>

      </main>
    </div>
  );
}

