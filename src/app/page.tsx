"use client";

import Link from "next/link";
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

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.profile.getFull("me"),
      api.projects.latest(5),
      api.blog.latest(5),
    ])
      .then(([p, pr, po]) => {
        if (cancelled) return;
        setProfile(p);
        setProjects(pr);
        setPosts(po);
      })
      .catch(() => {
        // Home should still render even if one service is down.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-2xl">
            <h1 className="mt-10 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {profile?.name ?? "Your Name"}
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
              {profile?.profile_headline ?? "Professional headline"}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Carousel
            title="Projects"
            items={projects}
            getKey={(p, idx) => p._id ?? String(idx)}
            emptyText="No projects yet."
            renderItem={(p) => (
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {p.name ?? "Untitled project"}
                </div>
              </div>
            )}
          />

          <Carousel
            title="Blog"
            items={posts}
            getKey={(p) => p.id}
            emptyText="No posts yet."
            renderItem={(p) => (
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {p.title ?? "Untitled post"}
                </div>
              </div>
            )}
          />
        </div>
      </main>
    </div>
  );
}
