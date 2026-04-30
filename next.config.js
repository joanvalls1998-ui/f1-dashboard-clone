/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.formula1.com',
      },
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
    ],
  },
};

module.exports = nextConfig;
