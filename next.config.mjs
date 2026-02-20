/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cxpnpykakvxpzqhnxcjn.supabase.co',
      },
    ],
  },
  serverExternalPackages: [],
  async rewrites() {
    return [];
  },
};

export default nextConfig;