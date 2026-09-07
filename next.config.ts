import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    /* Next 16 deprecates `images.domains` — remotePatterns is required to
       serve product photography out of Supabase Storage. */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tcqfwdngfkywyrlbsxek.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
