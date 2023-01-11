/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  rewrites: async () => {
    return { afterFiles: 
      [
        {
          source: "/",
          destination: "/recipes",
        }
      ]
    }
  }
};

module.exports = nextConfig;
