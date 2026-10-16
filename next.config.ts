import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow transpiling Three.js and related packages
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
