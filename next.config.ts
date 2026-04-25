import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  // Isso silencia o erro e permite que o PWA faça o build corretamente
  turbopack: {},
};

export default withPWA(nextConfig);