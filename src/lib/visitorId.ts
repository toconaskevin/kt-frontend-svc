const VISITOR_STORAGE_KEY = "kt-visitor-id";

/** Stable anonymous id for public chat quotas (client-minted; not auth). */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY)?.trim();
    if (existing && existing.length >= 8) {
      return existing;
    }
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
