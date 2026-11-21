import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Canonicalize the bare apex to www. Anchored host match so
        // www.keithrobrien.com never matches (no redirect loop).
        source: "/:path*",
        has: [{ type: "host", value: "^keithrobrien\\.com$" }],
        destination: "https://www.keithrobrien.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
