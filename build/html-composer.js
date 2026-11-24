/**
 * html-composer — a tiny Vite plugin that assembles the static HTML pages.
 *
 * Directives (HTML comments, resolved at dev-serve and build time):
 *
 *   <!-- @include header.html {"page":"technology"} -->
 *     Inlines src/partials/header.html. The optional JSON object provides
 *     {{variables}} to the partial. A "page" value also marks the matching
 *     data-page="..." link(s) with aria-current="page".
 *
 *   <!-- @icon arrow-right -->
 *     Inlines an SVG icon: src/icons/<name>.svg first, then the Lucide set
 *     (node_modules/lucide-static/icons/<name>.svg).
 *
 * The output is plain static HTML: no client-side templating or icon runtime.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const INCLUDE = /<!--\s*@include\s+([\w./-]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g;
const ICON = /<!--\s*@icon\s+([\w-]+)\s*-->/g;
const VARIABLE = /\{\{\s*(\w+)\s*\}\}/g;

export default function htmlComposer({ root }) {
  const partialsDir = resolve(root, 'src/partials');
  const iconDirs = [resolve(root, 'src/icons'), resolve(root, 'node_modules/lucide-static/icons')];

  function renderIncludes(html, from = 'page') {
    return html.replace(INCLUDE, (_, file, json) => {
      const path = resolve(partialsDir, file);
      if (!existsSync(path))
        throw new Error(`[html-composer] ${from}: partial "${file}" not found`);

      const data = json ? JSON.parse(json) : {};
      let content = readFileSync(path, 'utf8');

      if (data.page) {
        content = content.replaceAll(
          `data-page="${data.page}"`,
          `data-page="${data.page}" aria-current="page"`,
        );
      }
      content = content.replace(VARIABLE, (_, key) => {
        if (!(key in data)) throw new Error(`[html-composer] ${file}: missing variable "${key}"`);
        return data[key];
      });

      return renderIncludes(content, file);
    });
  }

  function renderIcon(name) {
    const file = iconDirs.map((dir) => resolve(dir, `${name}.svg`)).find(existsSync);
    if (!file) throw new Error(`[html-composer] unknown icon "${name}"`);

    return (
      readFileSync(file, 'utf8')
        .replace(/<!--[\s\S]*?-->/g, '')
        // Size and class come from CSS; strip them from the root <svg> only
        // (child shapes such as <rect> keep their own width/height).
        .replace(/<svg\b[^>]*>/, (tag) =>
          tag
            .replace(/\s(class|width|height)="[^"]*"/g, '')
            .replace(
              '<svg',
              `<svg class="icon icon--${name}" aria-hidden="true" focusable="false"`,
            ),
        )
        .replace(/\s*\n\s*/g, ' ')
        .replace(/>\s+</g, '><')
        .trim()
    );
  }

  return {
    name: 'html-composer',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => renderIncludes(html).replace(ICON, (_, name) => renderIcon(name)),
    },
    handleHotUpdate({ file, server }) {
      // Partials and icons are not module-graph dependencies: reload the page.
      if (file.startsWith(partialsDir) || file.startsWith(iconDirs[0])) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}
