/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a/**'
            }
        ]
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/students',
            permanent: true,
          },
        ]
      },
};

module.exports = nextConfig;
