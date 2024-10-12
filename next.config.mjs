/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        SOCKET_IO_URL: process.env.SOCKET_IO_URL,
    },
    images: {
        unoptimized: true,
        domains: [
            "dash-tail.vercel.app",
            "lh3.googleusercontent.com",
            "i.hizliresim.com",
        ],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
};

export default nextConfig;
