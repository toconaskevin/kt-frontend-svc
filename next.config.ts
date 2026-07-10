import type { NextConfig } from "next";

const gatewayInternal =
  process.env.API_GATEWAY_INTERNAL_URL?.trim() || "http://localhost:8080";

const apiRewrites = [
  { source: "/auth/:path*", destination: `${gatewayInternal}/auth/:path*` },
  { source: "/profile/:path*", destination: `${gatewayInternal}/profile/:path*` },
  { source: "/projects/:path*", destination: `${gatewayInternal}/projects/:path*` },
  { source: "/cv/:path*", destination: `${gatewayInternal}/cv/:path*` },
];

/** Blog API must win over the App Router page `/blog/[slug]`. */
const blogApiRewrites = [
  { source: "/blog/health", destination: `${gatewayInternal}/blog/health` },
  { source: "/blog/posts", destination: `${gatewayInternal}/blog/posts` },
  {
    source: "/blog/posts/:path*",
    destination: `${gatewayInternal}/blog/posts/:path*`,
  },
];

const nextConfig: NextConfig = {
  // Browsers request /favicon.ico by default; map it to the generated PNG so the tab
  // icon is never an empty 404 (often shown as a generic triangle placeholder).
  async rewrites() {
    return {
      beforeFiles: blogApiRewrites,
      afterFiles: [
        { source: "/favicon.ico", destination: "/icon" },
        ...apiRewrites,
      ],
    };
  },
};

export default nextConfig;
