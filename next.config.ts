import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browsers request /favicon.ico by default; map it to the generated PNG so the tab
  // icon is never an empty 404 (often shown as a generic triangle placeholder).
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
};

export default nextConfig;
