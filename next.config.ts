import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Webpack instead of Turbopack for stability
  experimental: {
    turbo: undefined,
  },
  // Transpile packages if needed
  transpilePackages: [],
  // Webpack configuration to handle module resolution
  webpack: (config, { isServer }) => {
    // Fix for webpack module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  // TypeScript configuration
  typescript: {
    // Temporarily ignore build errors during development
    ignoreBuildErrors: false,
  },
  // ESLint configuration
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
