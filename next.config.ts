import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.0.0.*", "100.106.213.33"],
}

export default nextConfig
