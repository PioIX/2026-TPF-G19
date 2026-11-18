/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: (process.env.NEXT_ALLOWED_DEV_ORIGIN || '').split(',').map((origen) => origen.trim()).filter(Boolean),
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
