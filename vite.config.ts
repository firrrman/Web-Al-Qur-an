import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./", // Pengaturan base path
  build: {
    assetsInlineLimit: 0, // Mencegah konversi gambar kecil ke base64
  },
});
