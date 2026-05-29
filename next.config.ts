import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
      { protocol: 'https', hostname: 'baiscopedownloads.co' },
      { protocol: 'https', hostname: 'bestsimilar.com' },
    ],
  },
};

export default config;
