/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["monday-sdk-js"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "static.thenounproject.com",
      },
      {
        hostname: "files-monday-com.s3.amazonaws.com",
      },
    ],
  },
};

export default config;
