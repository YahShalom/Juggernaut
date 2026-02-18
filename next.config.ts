import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost', '127.0.0.1', '*.app.github.dev'],
    },
  },
};

export default nextConfig;
