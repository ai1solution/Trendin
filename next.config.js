/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add any external image domains here if needed
  },
  // Enable static exports for static site generation
  output: 'standalone',
  // Optional: Configure page extensions if you have any custom page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // Optional: Add environment variables that should be available at build time
  env: {
    // Add any environment variables here
  },
  // Optional: Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
