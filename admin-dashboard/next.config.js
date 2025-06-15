/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // تجاهل وحدات Node.js التي لا تعمل في المتصفح
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
  // تكوينات إضافية
  images: {
    domains: ['firebasestorage.googleapis.com', 'example.com'],
  },
  // تمكين JIT mode لـ Tailwind CSS
  experimental: {
    optimizeCss: true
  },
  // إضافة دعم CSS modules
  cssModules: true,
  // تعطيل تحسين الصور لتجنب المشاكل
  swcMinify: true,
};

module.exports = nextConfig; 