/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fitnessprogramer.com',
                pathname: '/wp-content/uploads/**',
            },
        ],
    },
}

module.exports = nextConfig
