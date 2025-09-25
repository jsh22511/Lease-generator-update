/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Ensure API routes work properly on Netlify
  trailingSlash: false,
  // Enable static optimization where possible
  output: 'standalone',
}

module.exports = nextConfig
