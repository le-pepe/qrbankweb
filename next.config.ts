import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ["localhost", 'web.noc.test', '192.168.1.35'],
};

export default nextConfig;
