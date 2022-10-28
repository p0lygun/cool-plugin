import { resolve } from 'path'
import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: true,
      mangle: true
    },
    rollupOptions: {
      chunkSizeWarningLimit: 600,
      input: [
        resolve(__dirname, 'main.ts'),
      ],
      output: {
        entryFileNames: "[name].js",
        preserveModules:  false
      }
    },
    chunkSizeWarningLimit: 600
  },
  plugins:[
    copy({
      targets:[
        {src: 'loader.js', dest: 'dist'}
      ],
      hook: "writeBundle"

    }),
  ]
})