const GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";

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
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
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
    posts: () =>
      gatewayFetch<
        Array<{ id: string; title?: string; slug?: string; excerpt?: string; published_at?: string }>
      >("/blog/posts"),
    latest: (limit = 5) =>
      gatewayFetch<
        Array<{ id: string; title?: string; slug?: string; excerpt?: string; published_at?: string }>
      >(`/blog/posts?limit=${encodeURIComponent(String(limit))}`),
  },
  cv: {
    url: () => `${GATEWAY_URL}/cv/cv`,
  },
};

export { GATEWAY_URL };
