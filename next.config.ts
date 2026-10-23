import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Login action arguments include credentials; do not print them in dev logs.
  logging: { serverFunctions: false },
  /* config options here */
  // File-backed hours use request-time rendering via force-dynamic.
  // Cache Components disables that route option in Next 16.
  cacheComponents: false,
  outputFileTracingIncludes: {
    "/hours": ["./data/walk-in-hours.json"],
    "/admin": ["./data/walk-in-hours.json"],
    "/admin/login": ["./data/walk-in-hours.json"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
