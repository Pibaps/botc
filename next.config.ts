import type { NextConfig } from "next";

const isMobileExport = process.env.BOTC_MOBILE_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isMobileExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    unoptimized: isMobileExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wiki.bloodontheclocktower.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
