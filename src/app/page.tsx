"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { AskChat } from "@/components/AskChat";
import { SiteFooter } from "@/components/SiteFooter";
import { api, type FullProfile } from "@/lib/api";

export default function Home() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.profile
      .getFull("me")
      .then((res) => {
        if (!cancelled) setProfile(res);
      })
      .catch(() => {
        /* hero can render empty; chat still works */
      })
      .finally(() => {
        if (!cancelled) setDataReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="neon-page">
      <AppNav />

      <main className="mx-auto flex w-full min-w-0 max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="flex w-full flex-col items-center text-center">
          {!dataReady ? (
            <div
              className="mt-6 flex flex-col items-center gap-3"
              aria-busy="true"
              aria-label="Loading profile"
            >
              <div className="h-10 w-[min(12rem,55%)] animate-pulse rounded-md bg-white/10" />
              <div className="h-6 w-[min(18rem,85%)] animate-pulse rounded-md bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {profile?.name ?? ""}
              </h1>
              {profile?.profile_headline ? (
                <p className="neon-muted mt-3 text-lg">
                  {profile.profile_headline}
                </p>
              ) : null}
            </>
          )}
        </div>

        <AskChat
          className="mt-10"
          title="Ask about me"
          subtitle="Chat grounded in my professional profile."
        />
      </main>

      <SiteFooter />
    </div>
  );
}
