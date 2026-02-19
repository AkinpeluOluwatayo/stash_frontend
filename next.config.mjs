/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: [],
  async rewrites() {
    return [];
  },
};

export default nextConfig;