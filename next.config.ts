import type { NextConfig } from "next"

import { BASE_PATH } from "./lib/base-path"

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.0.0.*", "100.106.213.33"],
}

export default nextConfig
