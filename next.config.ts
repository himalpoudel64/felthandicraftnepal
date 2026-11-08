import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // The stylesheet is small: inlining it removes the only render-blocking
  // request, worth 0.5 to 1 s of first paint on a throttled connection.
  experimental: { inlineCss: true },
};

export default nextConfig;
