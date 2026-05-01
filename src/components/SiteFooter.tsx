export function SiteFooter() {
  return (
    <footer className="flex w-full max-w-full min-w-0 shrink-0 items-center justify-center gap-2 px-6 py-6 text-sm text-[color:var(--muted-foreground)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pixel-heart.svg"
        alt=""
        width={22}
        height={22}
        decoding="async"
        className="h-[22px] w-[22px] shrink-0"
        aria-hidden
      />
      <span className="min-w-0 text-center">Made with passion and IA</span>
    </footer>
  );
}
