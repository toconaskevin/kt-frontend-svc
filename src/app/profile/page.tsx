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
      <h2 className="neon-divider border-b pb-2 text-lg font-semibold">
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
    <div className="neon-page">
      <AppNav />
      <div className="w-full min-w-0 px-4 py-8">
      <div className="mx-auto w-full min-w-0 max-w-2xl">
        <h1 className="mt-4 text-2xl font-semibold">Profile</h1>
        <p className="neon-muted mt-1 text-sm">Professional profile</p>

        <div className="neon-surface mt-6 p-6">
          {loading && <p className="neon-muted">Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {!loading && !error && profile && (
            <>
              <div className="space-y-1">
                {profile.profile_headline && (
                  <p className="font-medium">
                    {profile.profile_headline}
                  </p>
                )}
                {profile.email && (
                  <p className="neon-muted text-sm">{profile.email}</p>
                )}
                {profile.location && (
                  <p className="neon-muted text-sm">{profile.location}</p>
                )}
                {profile.social_media && profile.social_media.length > 0 && (
                  <ul className="flex flex-wrap gap-3 mt-2">
                    {profile.social_media.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-link text-sm"
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
                        className="neon-pill rounded-md px-2.5 py-1 text-sm"
                      >
                        {c.name}
                        {c.category && (
                          <span className="neon-muted ml-1">
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
                        <div className="font-medium">
                          {exp.role} at {exp.company}
                        </div>
                        {exp.location && (
                          <div className="neon-muted-2">{exp.location}</div>
                        )}
                        {(exp.start_date || exp.end_date) && (
                          <div className="neon-muted-2 mt-0.5">
                            {formatMonthYear(exp.start_date)} –{" "}
                            {exp.end_date ? formatMonthYear(exp.end_date) : "Present"}
                          </div>
                        )}
                        {exp.description && (
                          <p className="neon-muted mt-2">{exp.description}</p>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="neon-muted mt-2 list-disc list-inside space-y-0.5">
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
                        <div className="font-medium">{e.institution}</div>
                        {(e.degree || e.field) && (
                          <div className="neon-muted">
                            {[e.degree, e.field].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {(e.start_date || e.end_date) && (
                          <div className="neon-muted-2 mt-0.5">
                            {formatMonthYear(e.start_date)} –{" "}
                            {e.end_date ? formatMonthYear(e.end_date) : "Present"}
                          </div>
                        )}
                        {e.description && (
                          <p className="neon-muted mt-1">{e.description}</p>
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
                        <div className="font-medium">{c.name}</div>
                        {c.issuer && (
                          <div className="neon-muted">{c.issuer}</div>
                        )}
                        {(c.issued_at || c.expiry_at) && (
                          <div className="neon-muted-2">
                            {formatMonthYear(c.issued_at)}
                            {c.expiry_at && ` – ${formatMonthYear(c.expiry_at)}`}
                          </div>
                        )}
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neon-link mt-1 inline-block"
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
                  <ul className="space-y-1 text-sm">
                    {profile.languages.map((l) => (
                      <li key={l.id}>
                        {l.language}
                        {l.proficiency && (
                          <span className="neon-muted ml-2">
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
                  <p className="neon-muted text-sm">
                    Profile is empty. Add data to the profile_db (e.g. update the
                    profiles row and insert into education, core_competencies,
                    etc.).
                  </p>
                )}
            </>
          )}
          {!loading && !error && !profile && (
            <p className="neon-muted">No profile found.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
