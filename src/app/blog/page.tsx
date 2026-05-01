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
    <div className="neon-page">
      <AppNav />
      <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold">Blog</h1>
        <p className="neon-muted mt-1 text-sm">List of blog posts</p>
        <div className="neon-surface mt-6 p-6">
          {loading && <p className="neon-muted">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && (
            <ul className="space-y-4">
              {posts.length === 0 ? (
                <li className="neon-muted">No posts yet.</li>
              ) : (
                posts.map((p) => (
                  <li
                    key={p.id}
                    className="neon-divider border-b pb-4 last:border-0"
                  >
                    <div className="font-medium">{p.title ?? p.slug ?? "Untitled"}</div>
                    {p.excerpt && (
                      <p className="neon-muted mt-1 text-sm">
                        {p.excerpt}
                      </p>
                    )}
                    {p.published_at && (
                      <time className="neon-muted-2 mt-2 block text-xs">
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
