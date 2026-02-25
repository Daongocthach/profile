import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dalhc6zvg/image/**",
      },
    ],
  },
};

export default nextConfig;
