"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, type BlogPost } from "@/lib/api";
import { BlogPostCard } from "@/components/BlogPostCard";
import {
  loadBlogFeedState,
  restoreBlogFeedScroll,
  saveBlogFeedState,
} from "@/lib/blogFeedState";

const PAGE_SIZE = 10;

type BlogFeedProps = {
  tag?: string;
};

export function BlogFeed({ tag }: BlogFeedProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const pendingRestoreRef = useRef(false);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  const persistBeforeNavigate = useCallback(
    (post: BlogPost) => {
      saveBlogFeedState({
        tag,
        scrollY: window.scrollY,
        focusPostId: post.id,
      });
    },
    [tag]
  );

  const loadPage = useCallback(
    async (cursor: string | null, replace: boolean) => {
      if (!replace && loadingMoreRef.current) return;
      if (!replace) {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }
      try {
        const page = await api.blog.posts({
          limit: PAGE_SIZE,
          cursor,
          tag,
        });
        setPosts((prev) => (replace ? page.items : [...prev, ...page.items]));
        setNextCursor(page.next_cursor);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        if (replace) setInitialLoading(false);
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    },
    [tag]
  );

  useEffect(() => {
    let cancelled = false;
    const saved = loadBlogFeedState();
    pendingRestoreRef.current =
      !!saved && (saved.tag ?? undefined) === (tag ?? undefined);

    setInitialLoading(true);
    setPosts([]);
    setNextCursor(null);
    setError(null);
    api.blog
      .posts({ limit: PAGE_SIZE, tag })
      .then((page) => {
        if (cancelled) return;
        setPosts(page.items);
        setNextCursor(page.next_cursor);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load posts");
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tag]);

  // After fresh fetch, restore scroll/focus (load more pages if focus post is deeper).
  useEffect(() => {
    if (!pendingRestoreRef.current || initialLoading) return;

    const saved = loadBlogFeedState();
    if (!saved || (saved.tag ?? undefined) !== (tag ?? undefined)) {
      pendingRestoreRef.current = false;
      return;
    }

    if (saved.focusPostId) {
      if (posts.some((p) => p.id === saved.focusPostId)) {
        restoreBlogFeedScroll(tag);
        pendingRestoreRef.current = false;
        return;
      }
      if (nextCursor && !loadingMoreRef.current) {
        void loadPage(nextCursor, false);
        return;
      }
      if (!nextCursor && !loadingMore) {
        restoreBlogFeedScroll(tag);
        pendingRestoreRef.current = false;
      }
      return;
    }

    if (posts.length > 0) {
      restoreBlogFeedScroll(tag);
      pendingRestoreRef.current = false;
    }
  }, [posts, nextCursor, initialLoading, loadingMore, tag, loadPage]);

  // Re-apply scroll when returning via browser back (bfcache / soft nav).
  useEffect(() => {
    const onReturn = () => {
      restoreBlogFeedScroll(tag);
    };
    window.addEventListener("pageshow", onReturn);
    window.addEventListener("popstate", onReturn);
    return () => {
      window.removeEventListener("pageshow", onReturn);
      window.removeEventListener("popstate", onReturn);
    };
  }, [tag]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !nextCursor) return;
    // Don't let the sentinel race with pending focus restore pagination.
    if (pendingRestoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void loadPage(nextCursor, false);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [nextCursor, loadPage, posts, initialLoading]);

  if (initialLoading) {
    return <p className="neon-muted py-6 text-sm">Loading…</p>;
  }

  if (error && posts.length === 0) {
    return <p className="py-6 text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="neon-muted py-6 text-sm">No posts yet.</p>;
  }

  return (
    <div>
      <div className="divide-y-0">
        {posts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onNavigate={persistBeforeNavigate}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {nextCursor ? (
        <div
          ref={sentinelRef}
          className="flex justify-center py-6"
          aria-hidden={!loadingMore}
        >
          {loadingMore ? (
            <p className="neon-muted text-sm">Loading more…</p>
          ) : (
            <span className="sr-only">Scroll for more</span>
          )}
        </div>
      ) : (
        <p className="neon-muted-2 py-6 text-center text-xs">End of feed</p>
      )}
    </div>
  );
}
