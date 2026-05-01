"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { Carousel } from "@/components/Carousel";
import { api, type FullProfile } from "@/lib/api";

type Project = { _id?: string; name?: string };
type Post = { id: string; title?: string };

export default function Home() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.profile.getFull("me"),
      api.projects.latest(5),
      api.blog.latest(5),
    ]).then(([profileRes, projectsRes, postsRes]) => {
      if (cancelled) return;
      if (profileRes.status === "fulfilled") setProfile(profileRes.value);
      if (projectsRes.status === "fulfilled") setProjects(projectsRes.value);
      if (postsRes.status === "fulfilled") setPosts(postsRes.value);
    }).finally(() => {
      if (!cancelled) setDataReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="neon-page">
      <AppNav />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-2xl">
            {!dataReady ? (
              <div
                className="mt-10 flex flex-col items-center gap-3"
                aria-busy="true"
                aria-label="Loading profile"
              >
                <div className="h-10 w-[min(12rem,55%)] animate-pulse rounded-md bg-white/10" />
                <div className="h-6 w-[min(18rem,85%)] animate-pulse rounded-md bg-white/10" />
              </div>
            ) : (
              <>
                <h1 className="mt-10 text-4xl font-semibold tracking-tight">
                  {profile?.name ?? ""}
                </h1>
                {profile?.profile_headline ? (
                  <p className="neon-muted mt-3 text-lg">
                    {profile.profile_headline}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          <div className="min-w-0">
            <Carousel
              title="Projects"
              items={projects}
              loading={!dataReady}
              overlayControls
              getKey={(p, idx) => p._id ?? String(idx)}
              emptyText="No projects yet."
              renderItem={(p) => (
                <div>
                  <div className="text-sm font-medium">
                    {p.name ?? "Untitled project"}
                  </div>
                </div>
              )}
            />
          </div>

          <div className="min-w-0">
            <Carousel
              title="Blog"
              items={posts}
              loading={!dataReady}
              overlayControls
              getKey={(p) => p.id}
              emptyText="No posts yet."
              renderItem={(p) => (
                <div>
                  <div className="text-sm font-medium">
                    {p.title ?? "Untitled post"}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
