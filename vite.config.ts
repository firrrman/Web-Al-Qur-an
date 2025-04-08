import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Al-Qur'an Digital",
        short_name: "Al-Qur'an",
        description: "Aplikasi web Al-Qur'an digital",
        theme_color: "#4CAF50",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "./",
        orientation: "portrait",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api/");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
              },
            },
          },
        ],
      },
    }),
  ],
  base: "./", // Pengaturan base path
  build: {
    assetsInlineLimit: 0, // Mencegah konversi gambar kecil ke base64
  },
});
