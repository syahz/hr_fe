import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    config.resolve.alias.encoding = false

    return config
  },
  images: {
    // allow external images from placehold.co used for placeholders/logos
    domains: ['placehold.co']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4002/api/:path*'
      }
    ]
  }
}

export default nextConfig
