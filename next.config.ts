import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
      { protocol: 'https', hostname: 'baiscopedownloads.co' },
      { protocol: 'https', hostname: 'bestsimilar.com' },
      { protocol: 'https', hostname: 'api.saferide.lk' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
    ],
  },
};

export default config;
