/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This ensures Netlify can build and serve your app properly
  output: 'standalone',
}

module.exports = nextConfig
