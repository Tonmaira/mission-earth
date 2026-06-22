/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpdcfsmqmeyarneakmiz.supabase.co",
      },
    ],
  },
}

export default nextConfig