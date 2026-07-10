"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { api, type BlogPostDetail } from "@/lib/api";
import { loadBlogFeedState } from "@/lib/blogFeedState";
import { formatRelativeTime } from "@/lib/relativeTime";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverFailed, setCoverFailed] = useState(false);

  function handleBack() {
    // Same path as the browser back button when we arrived from the feed.
    if (loadBlogFeedState()) {
      router.back();
      return;
    }
    router.push("/blog");
  }

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCoverFailed(false);
    api.blog
      .post(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setPost(null);
          setError(err instanceof Error ? err.message : "Failed to load post");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const title = post?.title ?? post?.slug ?? "Post";
  const tags = post?.tags ?? [];
  const showCover = Boolean(post?.cover_image_url) && !coverFailed;

  return (
    <div className="neon-page">
      <AppNav />
      <div className="w-full min-w-0 px-4 py-8">
        <div className="mx-auto w-full min-w-0 max-w-2xl">
          <button
            type="button"
            onClick={handleBack}
            className="neon-muted inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--foreground)]"
            aria-label="Back to blog feed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back
          </button>

          {loading ? (
            <p className="neon-muted mt-8 text-sm">Loading…</p>
          ) : null}

          {error ? (
            <p className="mt-8 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          {!loading && !error && post ? (
            <article className="mt-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <div className="neon-muted mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
                {tags.map((tag, i) => (
                  <span key={tag} className="inline-flex items-center gap-x-1.5">
                    {i > 0 ? <span aria-hidden="true">·</span> : null}
                    <span className="text-[var(--neon-cyan)]">{tag}</span>
                  </span>
                ))}
                {tags.length > 0 && post.published_at ? (
                  <span aria-hidden="true">·</span>
                ) : null}
                {post.published_at ? (
                  <time dateTime={post.published_at}>
                    {formatRelativeTime(post.published_at)}
                  </time>
                ) : null}
              </div>

              {showCover ? (
                <div className="mt-6 w-full overflow-hidden rounded-[var(--radius-md)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image_url!}
                    alt=""
                    className="aspect-[16/9] w-full object-cover"
                    onError={() => setCoverFailed(true)}
                  />
                </div>
              ) : null}

              {post.content ? (
                <MarkdownContent content={post.content} className="mt-6" />
              ) : post.excerpt ? (
                <p className="neon-muted mt-6 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              ) : (
                <p className="neon-muted mt-6 text-sm">No content.</p>
              )}
            </article>
          ) : null}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
