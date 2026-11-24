# Roentgen Matters — rgmatters.com

Marketing site for Roentgen Matters. A small multi-page static site built with
[Vite](https://vite.dev): plain HTML pages, Sass, and a little vanilla JavaScript.
It deploys to GitHub Pages at **www.rgmatters.com**.

## Quick start

Requires Node.js 20.19 or newer.

```sh
npm install
npm run dev        # local dev server with live reload
```

| Script            | What it does                                               |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                       |
| `npm run build`   | Build the static site into `dist/`                         |
| `npm run preview` | Serve the built `dist/` locally                            |
| `npm run lint`    | ESLint                                                     |
| `npm run format`  | Format everything with Prettier                            |
| `npm run check`   | Lint + formatting check + build (run before committing)    |
| `npm run deploy`  | Run `check`, then publish `dist/` to the `gh-pages` branch |

## Project structure

```
├── index.html, technology.html, products.html,
│   about.html, contact.html, 404.html      Pages (one file per URL)
├── public/                                 Copied to the site root as-is
│   ├── CNAME                               Custom domain (keep it — see Deployment)
│   ├── brand/                              Logo files
│   └── images/                             Page illustrations (WebP)
├── src/
│   ├── main.js                             Entry: fonts, styles, page scripts
│   ├── partials/                           Shared HTML (head, header, footer, inquiries)
│   ├── icons/                              Custom SVG icons (Lucide-compatible)
│   ├── scripts/
│   │   ├── header.js                       Sticky header + mobile menu
│   │   ├── reveal.js                       Scroll fade-in for [data-reveal]
│   │   └── hero/                           Home page 3D logo (canvas)
│   └── styles/
│       ├── abstracts/                      Sass-only helpers (breakpoint mixins)
│       ├── base/                           Tokens, reset, type roles
│       ├── layout/                         Container, bands, two-column layouts
│       ├── components/                     Buttons, cards, header, footer, …
│       └── pages/                          Page-specific styles
├── build/html-composer.js                  Vite plugin: partials + icons
└── vite.config.js
```

## How pages are assembled

Pages are static HTML. Two comment directives are resolved at build time (and in
`npm run dev`) by `build/html-composer.js`, so the output has no client-side
templating:

```html
<!-- @include header.html {"page":"technology"} -->
<!-- @include inquiries.html {"ctaHref":"/contact.html"} -->
<!-- @icon arrow-right -->
```

- **`@include`** inlines a file from `src/partials/`. The JSON object fills
  `{{variables}}` in the partial. `"page"` marks the nav link with the matching
  `data-page` attribute as the current page.
- **`@icon`** inlines an SVG: first from `src/icons/`, otherwise from
  [Lucide](https://lucide.dev/icons) by name (e.g. `arrow-right`, `mail`).

### Adding a page

1. Copy an existing page (e.g. `about.html`) and change its `<title>`, the
   `"page"` value in the header include, and the `<main>` content.
2. Add its name to the `pages` list in `vite.config.js`.
3. Link to it from `src/partials/header.html` and `src/partials/footer.html`.

## Styling conventions

- **Tokens first.** Colours, type sizes, spacing and radii are CSS custom
  properties in `src/styles/base/_tokens.scss`. Use them rather than raw values.
- **Breakpoints** come only from `abstracts/_breakpoints.scss`:
  `@include up(md) { … }` / `@include down(sm) { … }` (sm 640, md 900, lg 1100).
- **Class names** follow BEM: `.block`, `.block__element`, `.block--modifier`.
- **Type roles:** `.display` (page titles), `.heading` (section titles),
  `.title` (card titles), `.lead`, `.statement`, `.eyebrow` (section labels).
- **Look:** one white background, flat cards (`.card`) on a light surface,
  framed images (`.frame`), pill buttons (`.button--primary | --secondary | --light`).
  The brand teal is reserved for primary actions and section labels.
- **Motion** is opt-in: add `data-reveal` to an element to fade it in on
  scroll. The home hero has its own load-in (`src/scripts/hero-intro.js`, timings
  in `pages/_home.scss`): the headline rises line by line out of a mask, then
  the subtitle and buttons follow. Only `transform` and `opacity` animate, and
  everything respects `prefers-reduced-motion`.
- **Page edges:** the root background matches the footer, so overscroll and the
  iOS Safari toolbar area below the page stay seamless. Layout is
  `viewport-fit=cover`, and containers and the footer pad for safe areas.

### Colour and contrast

Every text/background pairing in the tokens meets **WCAG 2 AA** and the
**APCA** targets (Lc 75 for body text, Lc 60 for large text, Lc 45 for display
text), measured on the rendered pages. When changing a colour, re-check it, for
example with the [APCA contrast calculator](https://apcacontrast.com).
Small teal text uses `--color-accent-text` (#006787), not the logo teal, which
is only dark enough for fills and large text.

## The home page 3D logo

`src/scripts/hero/` draws the logo's geometry in 3D on a `<canvas>`: a
tetrahedron inscribed in a cube which, seen along the cube's diagonal, _is_ the
logo. It opens in that exact view, tumbles slowly and settles back into it.
Drag rotates; a mouse click pauses (touch never pauses it). It holds a still view under
`prefers-reduced-motion` and stops animating when off screen.

- `quaternion.js`: rotation maths
- `geometry.js`: shape data and the logo orientation
- `intro.js`: the load-in, where the logo draws itself on like a technical drawing
- `index.js`: rendering, animation and interaction; tune the constants at the
  top of the file (timing, colours, sizes)

## Deployment

```sh
npm run deploy
```

This builds the site and pushes `dist/` to the `gh-pages` branch, which GitHub
Pages serves. **Always change the source and redeploy. Never edit the
`gh-pages` branch directly:** each deploy replaces that branch wholesale, so
direct edits are silently lost (or, worse, silently undone).

`public/CNAME` must stay. Without it, a deploy would remove the custom domain.
