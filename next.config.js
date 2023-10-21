module.exports = {
  env: {
    API: process.env.API,
    API_IMAGE: process.env.API_IMAGE,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '34.71.125.94',
        port: ':3500',
        pathname: '/api',
      },
    ],
  },
};
