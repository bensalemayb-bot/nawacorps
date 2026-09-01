import type { NextConfig } from "next";

/**
 * `output: "standalone"` ne sert QU A l image Docker : le Dockerfile copie
 * `.next/standalone` puis lance `node server.js`. Vercel, lui, trace les
 * fichiers lui-meme et fabrique ses propres fonctions ; le mode standalone n y
 * apporte rien et fait produire au build une seconde copie de l application.
 *
 * VERCEL vaut "1" dans tout build Vercel. La variable est donc le seul
 * aiguillage necessaire, et les deux cibles restent servies par le meme depot.
 */
const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
