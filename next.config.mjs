// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Remove the experimental.serverActions line completely
    // Server Actions are now enabled by default in Next.js
    output: 'standalone', // If you're using standalone output
    // Optional: Add other configurations you need
  };
  
  export default nextConfig;