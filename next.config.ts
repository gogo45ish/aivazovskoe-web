import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker — copies only the files `next start`
  // needs into .next/standalone, so the runtime image skips full node_modules.
  output: "standalone",
  images: {
    remotePatterns: [
      // Timeweb object storage (direct) + CDN domain serving event/media images
      { protocol: "https", hostname: "s3.twcstorage.ru", pathname: "/**" },
      { protocol: "https", hostname: "**.cdn.twcstorage.ru", pathname: "/**" },
      // Dev-only placeholder imagery — replace with self-hosted/S3 before launch
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    // Preserve ranking from the old top-level treatment URLs.
    return [
      {
        source: "/legkoe-dyhanie",
        destination: "/lechenie/legkoe-dyhanie",
        statusCode: 301,
      },
      {
        source: "/dolgoletie",
        destination: "/lechenie/dolgoletie",
        statusCode: 301,
      },
      {
        source: "/dvizhenie-bez-boli",
        destination: "/lechenie/dvizhenie-bez-boli",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
