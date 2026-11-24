import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import htmlComposer from './build/html-composer.js';

const root = import.meta.dirname;
const pages = ['index', 'technology', 'products', 'about', 'contact', '404'];

export default defineConfig({
  base: '/',
  plugins: [htmlComposer({ root })],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(root, `${page}.html`)])),
    },
  },
});
