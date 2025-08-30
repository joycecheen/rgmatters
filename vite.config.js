import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/rgmatters/',
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        technology: resolve(__dirname, 'technology.html'),
        products: resolve(__dirname, 'products.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
      external: ['fsevents'],
      output: {
        manualChunks: {
          vendor: ['vite']
        }
      }
    }
  }
})