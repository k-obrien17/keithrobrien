import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
