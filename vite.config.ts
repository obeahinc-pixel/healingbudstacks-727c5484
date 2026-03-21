import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'copy-htaccess',
      apply: 'build',
      generateBundle() {
        const htaccessPath = path.resolve(__dirname, 'public/.htaccess');
        if (fs.existsSync(htaccessPath)) {
          const htaccessContent = fs.readFileSync(htaccessPath, 'utf-8');
          this.emitFile({
            type: 'asset',
            fileName: '.htaccess',
            source: htaccessContent,
          });
        }
      },
    },
  ].filter(Boolean),
  base: "/",
  publicDir: 'public',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
