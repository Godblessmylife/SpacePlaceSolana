/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['v0.blob.com', 'placeholder.com', 'acne55yuaik8ikk0.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Добавляем поддержку WebP
  webpack(config) {
    config.module.rules.push({
      test: /\.(webp|gif)$/,
      use: ['url-loader'],
    });
    return config;
  },
  eslint: {
    // Пропускаем проверку ESLint при сборке для деплоя
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Пропускаем проверку TypeScript при сборке для деплоя
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
