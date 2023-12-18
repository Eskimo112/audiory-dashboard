module.exports = {
  env: {
    API: process.env.API,
    API_IMAGE: process.env.API_IMAGE,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '34.71.125.94',
        port: ':3500',
        pathname: '/api',
      },
    ],
  },
};
