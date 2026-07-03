/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In production, point this to the Render backend URL via environment variable
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
