import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("src"),
      "@/app": path.resolve("src/app"),
      "@/entities": path.resolve("src/entities"),
      "@/features": path.resolve("src/features"),
      "@/pages": path.resolve("src/pages"),
      "@/processes": path.resolve("src/processes"),
      "@/shared": path.resolve("src/shared"),
      "@/widgets": path.resolve("src/widgets"),
    },
  },
});
