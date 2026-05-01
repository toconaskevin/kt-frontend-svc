"use client";

import { AppNav } from "@/components/AppNav";

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
    <div className="neon-card flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="neon-badge inline-flex w-12 justify-center rounded-md px-2 py-1 text-xs font-semibold">
          {e.method}
        </span>
        <code className="text-sm">{e.path}</code>
      </div>
      <p className="neon-muted text-sm sm:ml-6 sm:text-right">
        {e.description}
      </p>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="neon-page">
      <AppNav />

      <main className="mx-auto w-full min-w-0 max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">API Docs</h1>
        <p className="neon-muted mt-2">
          Public endpoints exposed through the gateway.
        </p>

        <div className="mt-10 space-y-10">
          {endpoints.map((group) => (
            <section key={group.group}>
              <h2 className="text-sm font-semibold tracking-wide">{group.group}</h2>
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

