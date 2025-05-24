/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'feedbackhub.app'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
