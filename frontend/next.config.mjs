/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': require('path').resolve(__dirname, '.'),
    };
    return config;
  }
};

export default nextConfig;
