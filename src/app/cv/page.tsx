"use client";

import { api } from "@/lib/api";
import { PageShell } from "@/components/PageShell";

export default function CVPage() {
  const cvDownloadUrl = api.cv.url({ download: true });
  const cvViewUrl = api.cv.url();

  return (
    <PageShell>
      <div className="site-container py-10 md:py-14">
        <div className="mx-auto max-w-xl card-surface p-8">
          <h1 className="text-3xl font-extrabold tracking-tight">CV</h1>
          <p className="neon-muted mt-2 text-sm">
            Download or open the latest CV (PDF).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={cvDownloadUrl}
              className="btn-primary"
              download="Kevin-Toconas-CV.pdf"
            >
              Download CV (PDF)
            </a>
            <a
              href={cvViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open in browser
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
