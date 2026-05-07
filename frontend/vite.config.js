import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // Dev server – proxy /api to local Express backend
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target:       env.VITE_API_BASE || "http://localhost:4000",
          changeOrigin: true,
          secure:       false,
        },
      },
    },

    // vite preview uses same proxy
    preview: {
      port: 4173,
      proxy: {
        "/api": {
          target:       env.VITE_API_BASE || "http://localhost:4000",
          changeOrigin: true,
          secure:       false,
        },
      },
    },

    build: {
      outDir:    "dist",
      sourcemap: mode !== "production",
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react":  ["react", "react-dom"],
            "vendor-router": ["react-router-dom"],
          },
        },
      },
    },
  };
});