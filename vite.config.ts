import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      '@alias/markdown-it': 'markdown-it'
    },
  },
  server: {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: "0.0.0.0",
    // 服务器端口号
    // port: 3000,
    // boolean | string 启动项目时自动在浏览器打开应用程序；如果为string，比如"/index.html"，会打开http://localhost:3000/index.html
    // open: false,
    // 自定义代理规则
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
});
