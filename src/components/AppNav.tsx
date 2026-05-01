"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function AppNav() {
  const { token, logout, isReady } = useAuth();

  return (
    <nav className="neon-nav flex flex-wrap items-center gap-4 px-6 py-4">
      <Link
        href="/"
        className="font-medium"
      >
        Home
      </Link>
      <Link
        href="/profile"
        className=""
      >
        Profile
      </Link>
      <Link
        href="/projects"
        className=""
      >
        Projects
      </Link>
      <Link
        href="/blog"
        className=""
      >
        Blog
      </Link>
      <Link
        href="/cv"
        className=""
      >
        CV
      </Link>
      <Link
        href="/docs"
        className=""
      >
        Docs
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {isReady &&
          (token ? (
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm"
            >
              Sign out
            </button>
          ) : null)}
      </div>
    </nav>
  );
}
