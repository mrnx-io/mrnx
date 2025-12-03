/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  env: {
    RESTATE_INGRESS_URL: process.env.RESTATE_INGRESS_URL || 'http://localhost:8080',
  },
};

export default nextConfig;