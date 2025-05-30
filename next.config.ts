import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    output: 'export',
    // output: 'standalone', // Pour les déploiements Node.js
    trailingSlash: true,
    // Active le mode strict React
    reactStrictMode: true,
    distDir: 'out',
    images: {
        // remotePatterns: [
        //     new URL('https://firebasestorage.googleapis.com/v0/b/optibrain-28df4.firebasestorage.app/o/**')
        // ],
        unoptimized: true, // Désactive l'optimisation des images
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                // port: '',
                pathname: '/v0/b/optibrain-28df4.firebasestorage.app/o/**',
                // search: '',
            },
        ],

    },
};

export default nextConfig;
