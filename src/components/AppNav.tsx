"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function AppNav() {
  const { token, logout, isReady } = useAuth();

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href="/"
        className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        Home
      </Link>
      <Link
        href="/profile"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Profile
      </Link>
      <Link
        href="/projects"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Projects
      </Link>
      <Link
        href="/blog"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Blog
      </Link>
      <Link
        href="/cv"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        CV
      </Link>
      <Link
        href="/docs"
        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Docs
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {isReady &&
          (token ? (
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign out
            </button>
          ) : null)}
      </div>
    </nav>
  );
}
