"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AppNav } from "@/components/AppNav";

type Post = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  published_at?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.blog
      .posts()
      .then((list) => {
        if (!cancelled) setPosts(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load posts");
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
          Blog
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          List of blog posts
        </p>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {loading && <p className="text-zinc-500">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && (
            <ul className="space-y-4">
              {posts.length === 0 ? (
                <li className="text-zinc-500">No posts yet.</li>
              ) : (
                posts.map((p) => (
                  <li key={p.id} className="border-b border-zinc-100 pb-4 last:border-0 dark:border-zinc-800">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {p.title ?? p.slug ?? "Untitled"}
                    </div>
                    {p.excerpt && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {p.excerpt}
                      </p>
                    )}
                    {p.published_at && (
                      <time className="mt-2 block text-xs text-zinc-500 dark:text-zinc-400">
                        {p.published_at}
                      </time>
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
