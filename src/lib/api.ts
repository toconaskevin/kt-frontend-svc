/** Same-origin API paths; Next.js rewrites proxy to internal ingress (see next.config.ts). */
const GATEWAY_URL = "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export type GatewayError = { error: string };

export type FullProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  location?: string | null;
  profile_headline?: string | null;
  social_media?: Array<{ platform?: string; url?: string }>;
  education: Array<{
    id: string;
    institution: string;
    degree?: string | null;
    field?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
    sort_order?: number;
  }>;
  core_competencies: Array<{
    id: string;
    name: string;
    category?: string | null;
    sort_order?: number;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency?: string | null;
    sort_order?: number;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer?: string | null;
    issued_at?: string | null;
    expiry_at?: string | null;
    url?: string | null;
  }>;
  professional_experience: Array<{
    id: string;
    company: string;
    role: string;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    description?: string | null;
    highlights?: string[];
    sort_order?: number;
  }>;
};

export async function gatewayFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${GATEWAY_URL}${path}`;
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.headers as Record<string, string>),
  };
  if (options.body) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => ({})) : {};
    throw new Error((body as GatewayError).error || res.statusText || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  if (isJson) return res.json() as Promise<T>;
  return res.blob() as unknown as T;
}

export type AskSource = {
  type?: string;
  title?: string;
  id?: string;
  url?: string;
};

export type AskResponse = {
  answer: string;
  sources?: AskSource[];
  recipe?: string;
};

export type BlogPost = {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  cover_image_url?: string | null;
  tags?: string[];
  published_at?: string;
};

export type BlogPostDetail = BlogPost & {
  content?: string | null;
};

export type BlogPostsPage = {
  items: BlogPost[];
  next_cursor: string | null;
};

export const api = {
  // auth: {
  //   register: (email: string, password: string) =>
  //     gatewayFetch<{ email: string }>("/auth/register", {
  //       method: "POST",
  //       body: JSON.stringify({ email, password }),
  //     }),
  //   login: (email: string, password: string) =>
  //     gatewayFetch<{ token: string }>("/auth/login", {
  //       method: "POST",
  //       body: JSON.stringify({ email, password }),
  //     }),
  //   me: () =>
  //     gatewayFetch<{ user: { email: string } }>("/auth/me"),
  // },
  profile: {
    get: (id: string) =>
      gatewayFetch<{
        id: string;
        name?: string | null;
        email?: string;
        location?: string;
        profile_headline?: string;
        social_media?: Array<{ platform?: string; url?: string }>;
        [k: string]: unknown;
      }>(`/profile/profiles/${id}`),
    getFull: (id: string) =>
      gatewayFetch<FullProfile>(`/profile/profiles/${id}/full`),
  },
  projects: {
    list: () =>
      gatewayFetch<Array<{ _id?: string; name?: string; description?: string; url?: string }>>(
        "/projects/projects"
      ),
    latest: (limit = 5) =>
      gatewayFetch<Array<{ _id?: string; name?: string; description?: string; url?: string }>>(
        `/projects/projects?limit=${encodeURIComponent(String(limit))}`
      ),
  },
  blog: {
    posts: (opts?: { limit?: number; cursor?: string | null; tag?: string }) => {
      const params = new URLSearchParams();
      if (opts?.limit != null) params.set("limit", String(opts.limit));
      if (opts?.cursor) params.set("cursor", opts.cursor);
      if (opts?.tag) params.set("tag", opts.tag);
      const qs = params.toString();
      return gatewayFetch<BlogPostsPage>(`/blog/posts${qs ? `?${qs}` : ""}`);
    },
    post: (idOrSlug: string) =>
      gatewayFetch<BlogPostDetail>(
        `/blog/posts/${encodeURIComponent(idOrSlug)}`
      ),
    latest: async (limit = 5) => {
      const page = await gatewayFetch<BlogPostsPage>(
        `/blog/posts?limit=${encodeURIComponent(String(limit))}`
      );
      return page.items;
    },
  },
  cv: {
    url: () => `${GATEWAY_URL}/cv/cv`,
  },
  /** Q&A via Next BFF → MCP orchestrator (API key stays server-side). */
  ask: {
    question: (question: string, idempotencyKey?: string) =>
      gatewayFetch<AskResponse>("/api/ask", {
        method: "POST",
        body: JSON.stringify({ question }),
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
      }),
  },
};

export { GATEWAY_URL };
