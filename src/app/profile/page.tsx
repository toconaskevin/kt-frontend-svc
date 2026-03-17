"use client";

import { useEffect, useState } from "react";
import { api, type FullProfile } from "@/lib/api";
import { AppNav } from "@/components/AppNav";

function formatMonthYear(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value ?? "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.profile
      .getFull("me")
      .then((res) => {
        if (!cancelled) setProfile(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load profile");
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
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Professional profile
        </p>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {loading && <p className="text-zinc-500">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && profile && (
            <>
              <div className="space-y-1">
                {profile.profile_headline && (
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {profile.profile_headline}
                  </p>
                )}
                {profile.email && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {profile.email}
                  </p>
                )}
                {profile.location && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {profile.location}
                  </p>
                )}
                {profile.social_media && profile.social_media.length > 0 && (
                  <ul className="flex flex-wrap gap-3 mt-2">
                    {profile.social_media.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline"
                        >
                          {s.platform || s.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {profile.core_competencies.length > 0 && (
                <Section title="Core competencies">
                  <ul className="flex flex-wrap gap-2">
                    {profile.core_competencies.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        {c.name}
                        {c.category && (
                          <span className="text-zinc-500 dark:text-zinc-400 ml-1">
                            ({c.category})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.professional_experience.length > 0 && (
                <Section title="Professional experience">
                  <ul className="space-y-5">
                    {profile.professional_experience.map((exp) => (
                      <li key={exp.id} className="text-sm">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {exp.role} at {exp.company}
                        </div>
                        {exp.location && (
                          <div className="text-zinc-500 dark:text-zinc-500">
                            {exp.location}
                          </div>
                        )}
                        {(exp.start_date || exp.end_date) && (
                          <div className="text-zinc-500 dark:text-zinc-500 mt-0.5">
                            {formatMonthYear(exp.start_date)} –{" "}
                            {exp.end_date ? formatMonthYear(exp.end_date) : "Present"}
                          </div>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                            {exp.description}
                          </p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="mt-2 list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400">
                            {exp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.education.length > 0 && (
                <Section title="Education">
                  <ul className="space-y-4">
                    {profile.education.map((e) => (
                      <li key={e.id} className="text-sm">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {e.institution}
                        </div>
                        {(e.degree || e.field) && (
                          <div className="text-zinc-600 dark:text-zinc-400">
                            {[e.degree, e.field].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {(e.start_date || e.end_date) && (
                          <div className="text-zinc-500 dark:text-zinc-500 mt-0.5">
                            {formatMonthYear(e.start_date)} –{" "}
                            {e.end_date ? formatMonthYear(e.end_date) : "Present"}
                          </div>
                        )}
                        {e.description && (
                          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            {e.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.certifications.length > 0 && (
                <Section title="Certifications">
                  <ul className="space-y-3 text-sm">
                    {profile.certifications.map((c) => (
                      <li key={c.id}>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {c.name}
                        </div>
                        {c.issuer && (
                          <div className="text-zinc-600 dark:text-zinc-400">
                            {c.issuer}
                          </div>
                        )}
                        {(c.issued_at || c.expiry_at) && (
                          <div className="text-zinc-500 dark:text-zinc-500">
                            {formatMonthYear(c.issued_at)}
                            {c.expiry_at && ` – ${formatMonthYear(c.expiry_at)}`}
                          </div>
                        )}
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 dark:text-zinc-400 underline"
                          >
                            Verify
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {profile.languages.length > 0 && (
                <Section title="Languages">
                  <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {profile.languages.map((l) => (
                      <li key={l.id}>
                        {l.language}
                        {l.proficiency && (
                          <span className="text-zinc-500 dark:text-zinc-400 ml-2">
                            — {l.proficiency}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {!profile.profile_headline &&
                !profile.email &&
                !profile.location &&
                profile.education.length === 0 &&
                profile.core_competencies.length === 0 &&
                profile.languages.length === 0 &&
                profile.certifications.length === 0 &&
                profile.professional_experience.length === 0 && (
                  <p className="text-zinc-500 text-sm">
                    Profile is empty. Add data to the profile_db (e.g. update the
                    profiles row and insert into education, core_competencies,
                    etc.).
                  </p>
                )}
            </>
          )}
          {!loading && !error && !profile && (
            <p className="text-zinc-500">No profile found.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
