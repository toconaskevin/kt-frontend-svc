"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/api";
import { formatRelativeTime } from "@/lib/relativeTime";

type BlogPostCardProps = {
  post: BlogPost;
  onNavigate?: (post: BlogPost) => void;
};

export function BlogPostCard({ post, onNavigate }: BlogPostCardProps) {
  const title = post.title ?? post.slug ?? "Untitled";
  const tags = post.tags ?? [];
  const href = `/blog/${encodeURIComponent(post.slug ?? post.id)}`;
  const hasCoverUrl = Boolean(post.cover_image_url);
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = hasCoverUrl && !coverFailed;
  const showExcerpt = Boolean(post.excerpt) && (!hasCoverUrl || coverFailed);

  return (
    <article
      id={`post-${post.id}`}
      className="neon-divider border-b py-3 sm:py-4"
    >
      <Link
        href={href}
        className="block outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        onClick={() => onNavigate?.(post)}
      >
        <div className="text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] sm:text-lg">
          {title}
        </div>
        <div className="neon-muted mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
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
          <div className="mt-3 w-full overflow-hidden rounded-[var(--radius-sm)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url!}
              alt=""
              className="aspect-[16/9] w-full object-cover"
              loading="lazy"
              onError={() => setCoverFailed(true)}
            />
          </div>
        ) : null}
        {showExcerpt ? (
          <p className="neon-muted mt-2 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
