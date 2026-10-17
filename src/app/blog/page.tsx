"use client";

import { PageShell } from "@/components/PageShell";
import { BlogFeed } from "@/components/BlogFeed";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function BlogPage() {
  return (
    <PageShell>
      <div className="site-container py-10 md:py-14">
        <div className="mx-auto w-full min-w-0 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Blog</h1>
          <p className="neon-muted mt-2 text-sm">
            Notes on DevOps, cloud, and platform engineering.
          </p>
          <div className="mt-8">
            <BlogFeed />
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </PageShell>
  );
}
