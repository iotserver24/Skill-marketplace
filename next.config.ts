/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Allow larger skill file uploads
    },
  },
}

export default nextConfig
