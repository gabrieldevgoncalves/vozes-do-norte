// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com', pathname: '/meu-bucket/**' },
      { protocol: 'https', hostname: 'static.vendeshows.com' },
      { protocol: 'https', hostname: 'www.benevides.pa.gov.br' },
    ],
  },

  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.APP_VERSION ?? Date.now().toString(),
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }],
      },
      { source: '/favicon.ico', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, must-revalidate' }] },
      { source: '/robots.txt',  headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
      { source: '/sitemap.xml', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },

      { source: '/',            headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] },
      { source: '/inscricao',   headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] },

      { source: '/api/:path*',  headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] },
    ]
  },
}

export default nextConfig
