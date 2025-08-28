import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com', pathname: '/meu-bucket/**' },
      { protocol: 'https', hostname: 'static.vendeshows.com' }, 
      { protocol: 'https', hostname: 'www.benevides.pa.gov.br' },
    ],
  },
}
export default nextConfig

