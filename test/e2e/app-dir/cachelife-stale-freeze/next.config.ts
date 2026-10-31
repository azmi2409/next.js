import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    frozen: { stale: 0, revalidate: 15, expire: 300 },
  },
}

export default nextConfig
