"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { CompetencyCycle } from "@/components/hero/CompetencyCycle";
import { TechStackGrid } from "@/components/TechStackGrid";
import {
  api,
  type BlogPost,
  type FullProfile,
} from "@/lib/api";
import { DEFAULT_INTRO, DEFAULT_ROLE } from "@/lib/showcaseDefaults";

type Project = {
  _id?: string;
  name?: string;
  description?: string;
  url?: string;
};

function socialUrl(
  social: FullProfile["social_media"],
  platform: string
) {
  return social?.find(
    (s) => (s.platform || "").toLowerCase() === platform.toLowerCase()
  )?.url;
}

function techFromProfile(profile: FullProfile | null): string[] {
  return (profile?.tech_stack ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => item.name)
    .filter(Boolean);
}

function competencyNames(profile: FullProfile | null): string[] {
  return (profile?.core_competencies ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => item.name?.trim() ?? "")
    .filter(Boolean);
}

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Home() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.profile.getFull("me"),
      api.projects.latest(3),
      api.blog.latest(3),
    ]).then(([profileRes, projectsRes, postsRes]) => {
      if (cancelled) return;
      if (profileRes.status === "fulfilled") setProfile(profileRes.value);
      if (projectsRes.status === "fulfilled") setProjects(projectsRes.value);
      if (postsRes.status === "fulfilled") setPosts(postsRes.value);
    }).finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const name = profile?.name?.trim() || "Kevin Toconás";
  const role = profile?.profile_headline?.trim() || DEFAULT_ROLE;
  const names = competencyNames(profile);
  const tech = techFromProfile(profile);
  const github = socialUrl(profile?.social_media, "github");
  const linkedin = socialUrl(profile?.social_media, "linkedin");
  const cvDownloadUrl = api.cv.url({ download: true });

  return (
    <PageShell email={profile?.email} social={profile?.social_media}>
      <main>
        {/* Hero */}
        <section className="site-container flex min-h-[70vh] items-center py-16 md:py-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div className="max-w-3xl">
            {!ready ? (
              <div className="space-y-4" aria-busy="true" aria-label="Loading">
                <div className="h-10 w-4/5 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-6 w-3/5 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-20 w-full animate-pulse rounded-lg bg-slate-200" />
              </div>
            ) : (
              <>
                <p className="text-lg text-[color:var(--muted-foreground)]">
                  Hi, I&apos;m {name}.
                </p>
                <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-tight text-[color:var(--foreground)] md:text-6xl">
                  DevOps Engineer
                </h1>
                <p className="mt-4 max-w-2xl text-xl font-semibold leading-snug text-[color:var(--brand)] sm:text-2xl">
                  {role}
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
                  {DEFAULT_INTRO}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/projects" className="btn-primary">
                    View Projects
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href={cvDownloadUrl}
                    className="btn-secondary"
                    download="Kevin-Toconas-CV.pdf"
                  >
                    Download CV
                  </a>
                </div>
              </>
            )}
            </div>
            {ready && names.length > 0 ? <CompetencyCycle items={names} /> : null}
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-16">
          <div className="site-container">
            <p className="section-kicker">Toolkit</p>
            <h2 className="section-title mt-2">Tech stack</h2>
            <p className="mt-2 max-w-2xl text-[color:var(--muted-foreground)]">
              Technologies I use to design, automate, and operate platforms.
            </p>
            <div className="mt-8">
              <TechStackGrid items={tech} />
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white py-16">
          <div className="site-container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">Work</p>
                <h2 className="section-title mt-2">Featured projects</h2>
              </div>
              <Link href="/projects" className="neon-link text-sm">
                View all projects →
              </Link>
            </div>

            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {(projects.length > 0 ? projects : []).map((p, idx) => (
                <li key={p._id ?? p.name ?? String(idx)} className="card-surface flex flex-col overflow-hidden">
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-sky-700 px-4 text-center text-sm font-semibold text-white">
                    {p.name ?? "Project"}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold">{p.name ?? "Untitled project"}</h3>
                    {p.description ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                        {p.description}
                      </p>
                    ) : null}
                    <div className="mt-auto pt-4">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-link text-sm"
                        >
                          View details →
                        </a>
                      ) : (
                        <Link href="/projects" className="neon-link text-sm">
                          View details →
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {ready && projects.length === 0 ? (
                <li className="card-surface p-6 text-sm text-[color:var(--muted-foreground)] md:col-span-3">
                  No projects yet. Add items via the projects API.
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        {/* Blog */}
        <section className="bg-white py-16">
          <div className="site-container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">Writing</p>
                <h2 className="section-title mt-2">Blog</h2>
                <p className="mt-2 text-[color:var(--muted-foreground)]">
                  Notes on DevOps, cloud, and platform engineering.
                </p>
              </div>
              <Link href="/blog" className="neon-link text-sm">
                View all posts →
              </Link>
            </div>

            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {posts.map((post) => {
                const href = `/blog/${encodeURIComponent(post.slug ?? post.id)}`;
                const tag = post.tags?.[0];
                return (
                  <li key={post.id} className="card-surface overflow-hidden">
                    <Link href={href} className="block h-full">
                      <div className="h-36 bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100">
                        {post.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="p-5">
                        {tag ? (
                          <span className="text-xs font-bold uppercase tracking-wide text-[color:var(--brand)]">
                            {tag}
                          </span>
                        ) : null}
                        <h3 className="mt-2 text-lg font-bold leading-snug">
                          {post.title ?? "Untitled"}
                        </h3>
                        {post.published_at ? (
                          <time
                            dateTime={post.published_at}
                            className="mt-2 block text-xs text-[color:var(--muted-foreground)]"
                          >
                            {formatDate(post.published_at)}
                          </time>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
              {ready && posts.length === 0 ? (
                <li className="card-surface p-6 text-sm text-[color:var(--muted-foreground)] md:col-span-3">
                  No posts yet.
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16">
          <div className="site-container grid gap-8 rounded-[var(--radius-lg)] bg-[color:var(--brand)] px-6 py-10 text-white md:grid-cols-2 md:items-center md:px-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Let&apos;s work together
              </h2>
              <p className="mt-3 text-blue-100">
                Open to DevOps, cloud, and platform engineering conversations.
              </p>
              {profile?.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-secondary mt-6 bg-white text-[color:var(--brand)]"
                >
                  Get in touch
                </a>
              ) : (
                <a href="/profile" className="btn-secondary mt-6 bg-white text-[color:var(--brand)]">
                  View profile
                </a>
              )}
            </div>
            <ul className="space-y-3 text-sm text-blue-50">
              {profile?.email ? (
                <li>
                  <span className="font-semibold text-white">Email — </span>
                  <a href={`mailto:${profile.email}`} className="underline-offset-2 hover:underline">
                    {profile.email}
                  </a>
                </li>
              ) : null}
              {profile?.location ? (
                <li>
                  <span className="font-semibold text-white">Location — </span>
                  {profile.location}
                </li>
              ) : (
                <li>
                  <span className="font-semibold text-white">Location — </span>
                  Tokyo, Japan
                  <span className="ml-2 text-xs text-blue-200">(placeholder)</span>
                </li>
              )}
              {linkedin ? (
                <li>
                  <span className="font-semibold text-white">LinkedIn — </span>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Profile
                  </a>
                </li>
              ) : null}
              {github ? (
                <li>
                  <span className="font-semibold text-white">GitHub — </span>
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Profile
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
