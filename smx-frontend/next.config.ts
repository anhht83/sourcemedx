import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL, // Automatically uses the correct `.env` file
  },
}

export default nextConfig
