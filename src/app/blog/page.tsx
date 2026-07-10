"use client";

import { AppNav } from "@/components/AppNav";
import { BlogFeed } from "@/components/BlogFeed";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function BlogPage() {
  return (
    <div className="neon-page">
      <AppNav />
      <div className="w-full min-w-0 px-4 py-8">
        <div className="mx-auto w-full min-w-0 max-w-2xl">
          <h1 className="mt-4 text-2xl font-semibold">Blog</h1>
          <p className="neon-muted mt-1 text-sm">Notes, experiments, and build logs</p>
          <div className="mt-6">
            <BlogFeed />
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
