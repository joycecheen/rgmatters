import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'

const partialsDir = resolve(__dirname, 'src/partials')
const customIconsDir = resolve(__dirname, 'src/icons')
const lucideDir = resolve(__dirname, 'node_modules/lucide-static/icons')

/**
 * Static HTML composition at build time (and in dev):
 *   <!-- @include header.html {"page":"technology"} -->   (marks the active nav link)
 *   <!-- @include inquiries.html {"ctaHref":"contact.html"} -->   ({{ctaHref}} substitution)
 *   <!-- @icon arrow-right -->
 * Icons resolve from src/icons first, then lucide-static.
 */
function loadIcon(name) {
  const custom = resolve(customIconsDir, `${name}.svg`)
  const file = existsSync(custom) ? custom : resolve(lucideDir, `${name}.svg`)
  if (!existsSync(file)) throw new Error(`Unknown icon: ${name}`)
  return readFileSync(file, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*class="[^"]*"/, '')
    .replace(/\s*width="24"/, '')
    .replace(/\s*height="24"/, '')
    .replace('<svg', `<svg class="icon icon--${name}" aria-hidden="true" focusable="false"`)
    .replace(/\n\s*/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

function renderIncludes(html) {
  return html.replace(/<!--\s*@include\s+([\w./-]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g, (_, file, json) => {
    const data = json ? JSON.parse(json) : {}
    let content = readFileSync(resolve(partialsDir, file), 'utf8')
    if (data.page) {
      content = content.replace(
        new RegExp(`data-nav="${data.page}"`, 'g'),
        `data-nav="${data.page}" aria-current="page"`
      )
    }
    content = content.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => {
      if (!(key in data)) throw new Error(`Missing "${key}" for partial ${file}`)
      return data[key]
    })
    return renderIncludes(content)
  })
}

function htmlComposer() {
  return {
    name: 'html-composer',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return renderIncludes(html).replace(/<!--\s*@icon\s+([\w-]+)\s*-->/g, (_, name) => loadIcon(name))
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir) || file.startsWith(customIconsDir)) {
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [htmlComposer()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        technology: resolve(__dirname, 'technology.html'),
        products: resolve(__dirname, 'products.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
