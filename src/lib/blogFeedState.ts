const FEED_STATE_KEY = "blog-feed-state";

export type BlogFeedPersistedState = {
  tag?: string;
  scrollY: number;
  focusPostId?: string;
};

export function saveBlogFeedState(state: BlogFeedPersistedState): void {
  try {
    sessionStorage.setItem(FEED_STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadBlogFeedState(): BlogFeedPersistedState | null {
  try {
    const raw = sessionStorage.getItem(FEED_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BlogFeedPersistedState & {
      posts?: unknown;
    };
    if (!parsed || typeof parsed.scrollY !== "number") return null;
    return {
      tag: parsed.tag,
      scrollY: parsed.scrollY,
      focusPostId: parsed.focusPostId,
    };
  } catch {
    return null;
  }
}

export function clearBlogFeedState(): void {
  try {
    sessionStorage.removeItem(FEED_STATE_KEY);
  } catch {
    /* ignore */
  }
}

/** Apply saved scroll/focus after returning to the feed (Link or browser back). */
export function restoreBlogFeedScroll(tag?: string): boolean {
  const saved = loadBlogFeedState();
  if (!saved) return false;
  if ((saved.tag ?? undefined) !== (tag ?? undefined)) return false;

  const apply = () => {
    if (saved.focusPostId) {
      const el = document.getElementById(`post-${saved.focusPostId}`);
      if (el) {
        el.scrollIntoView({ block: "center" });
        return;
      }
    }
    window.scrollTo(0, saved.scrollY);
  };

  apply();
  // Beat Next.js scroll reset on back-navigation.
  requestAnimationFrame(apply);
  window.setTimeout(apply, 50);
  window.setTimeout(apply, 150);
  return true;
}
