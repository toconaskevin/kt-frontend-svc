import Link from "next/link";

type SiteFooterProps = {
  email?: string | null;
  social?: Array<{ platform?: string; url?: string }>;
};

function socialHref(
  social: Array<{ platform?: string; url?: string }> | undefined,
  platform: string
) {
  const hit = social?.find(
    (s) => (s.platform || "").toLowerCase() === platform.toLowerCase()
  );
  return hit?.url;
}

export function SiteFooter({ email, social }: SiteFooterProps) {
  const github = socialHref(social, "github");
  const linkedin = socialHref(social, "linkedin");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[color:var(--footer)] text-[color:var(--footer-fg)]">
      <div className="site-container flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xl font-extrabold tracking-tight">KT</div>
          <p className="mt-2 max-w-xs text-sm text-slate-400">
            Cloud platforms, automation, and reliable delivery.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            {github ? (
              <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                GitHub
              </a>
            ) : null}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                LinkedIn
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="hover:text-white">
                Email
              </a>
            ) : null}
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-300" aria-label="Footer">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/profile" className="hover:text-white">About</Link>
          <Link href="/projects" className="hover:text-white">Projects</Link>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <Link href="/cv" className="hover:text-white">CV</Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container py-4 text-xs text-slate-500">
          © {year} Kevin Toconás
        </div>
      </div>
    </footer>
  );
}
