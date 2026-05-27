import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos", // 리다이렉트 되는 최종 도메인 추가
      },
    ],
  },
};

export default nextConfig;
