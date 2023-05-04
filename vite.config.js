import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: true,
      mangle: true
    },
    rollupOptions: {
      input: [
        resolve(__dirname, 'main.ts'),
      ],
      output: {
        entryFileNames: "[name].js",
        preserveModules:  false
      },
    },
    chunkSizeWarningLimit: 600
  },
  plugins:[]
})