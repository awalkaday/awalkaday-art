# Audit of the awalkaday.art web gallery

Date: 2026-11-17 · Code audited: `master` at `72ad9b6` · Scope: the repository, not the live server.

How to read this: problems are ranked **P1 (fix first) → P4 (nice to have)**. Each one says whether it was **verified** (measured or read directly in the code), **inferred** (follows from the code but not observed in a browser), and whether this branch **fixes** it.

> Not tested: nothing here was viewed in a real browser. Jekyll could not be installed in the audit sandbox, so the templates were rendered with a stand-in engine and the gallery script was exercised in a simulated DOM. Preview the branch (see "How to review") before merging.

## What the site is

A Jekyll site (GitHub Pages, custom domain) that shows 261 square, black-and-white photographs in a shuffled grid, with a photograph viewer and an "About" panel. It was forked from a minimal gallery template (rampatra/photography) on top of the *Multiverse* theme by HTML5 UP. The 263 photographs on the Ethereum contract are the reference collection; the site shows 261 files (see P3-3).

Weight today: `images/fulls` 58 MB (261 files, ~1024 px) + `images/thumbs` 15 MB (261 files, 512 px) + 2.6 MB of assets.

## P1 — Why the gallery is slow

| # | Finding | Evidence | Status |
|---|---------|----------|--------|
| P1-1 | **All 261 thumbnails (15 MB) are requested at once.** No `loading="lazy"`, no `width`/`height`. | `index.html` loop emits a plain `<img>` per file. | verified · **fixed** |
| P1-2 | **The page stays hidden until every thumbnail has finished.** The `loading` class that hides tiles, header and shows the spinner is only removed on the window `load` event, which waits for all 261 images. On a slow connection the visitor waits for the full 15 MB. | old `assets/js/main.js` (`$window.on('load', …)`) | verified · **fixed** |
| P1-3 | **Scripts are loaded twice and block rendering.** jQuery, jQuery-poptrox, skel.js, util.js and main.js are included in `<head>` (`_includes/header.html`) *and* at the end of `<body>` (`_includes/footer.html`). Everything executes twice, which would add duplicate close buttons and doubled event handlers. Whether this visibly breaks the About button in a real browser was not confirmed. | both include files | verified (duplication) · **fixed** |
| P1-4 | **Image files are much bigger than needed.** A trial re-encode of all 261 photographs (JPEG q82 with mozjpeg, progressive) gives thumbs 15.3 → 4.9 MB and fulls 58 → 16 MB; WebP thumbs 3.4 MB. | measured with sharp on the files in the repo | verified · **not fixed** (needs your originals and your eye on quality — see Roadmap phase 2) |
| P1-5 | Every tile started hidden and revealed through staggered CSS transition delays, and JavaScript hid each `<img>` and repainted the same file as a CSS background. That blocks the browser's native lazy loading and `srcset`. | `main.min.css`, old `main.js` | verified · **fixed** |

## P2 — Rendering bugs that depend on the browser window

| # | Finding | Evidence | Status |
|---|---------|----------|--------|
| P2-1 | **Tile shape follows window height**, not the photograph: `height: calc(28.57vh - 1.33em)` with `min-height: 18em`, at a fixed 20 % width. Short or wide windows give wide strips; windows around 981–1200 px give tall slivers about 200–240 px wide. | shipped `main.min.css` | verified from CSS · **fixed** (fixed square tiles, columns adapt) |
| P2-2 | **Blurry photos on large screens and tablets.** Tiles can be 700+ px wide on 4K screens, and a single full-width column from 980 px down shows 512 px thumbnails stretched to 980 px. | shipped `main.min.css` (`width:100%` at ≤980 px) | inferred · **fixed** (`srcset`/`sizes`, more columns on wide screens) |
| P2-3 | **A single jump from 5 columns to 1 at 980 px**, nothing in between. | shipped `main.min.css` | verified · **fixed** (continuous auto-fill grid; 2 columns on phones) |
| P2-4 | **`100vh` on phones** changes when the address bar hides, resizing every tile mid-scroll. | shipped `main.min.css` | inferred · **fixed** (no viewport-height tile sizing) |
| P2-5 | **The random crop did nothing on landscape tiles.** The old script set a one-value `background-position` (horizontal only), but the tiles were landscape so the crop overflowed vertically. It only had an effect on the portrait slivers above. | old `main.js` | verified · **fixed** (both axes randomised — the intent in the artist's book is kept) |
| P2-6 | **The SCSS source and the CSS that is served have drifted apart.** `main.min.css` (served) has 5 columns and different spacing than `assets/sass` (4 columns), `main.scss` imports a `.ttf` as if it were Sass (does not compile), and `main.css` differs from `main.min.css`. The CSS was edited by hand after the last build. | compile attempt with dart-sass | verified · **worked around** (new `gallery.css`; Roadmap phase 3 retires the SCSS) |
| P2-7 | `.panel > .inner.split { display: display: display: display: flex }` is invalid, so the footer's two-column layout falls back to stacked blocks on desktop. Possibly unintentional. | `main.min.css` | verified · **not changed** (it would alter how the About panel looks — your call) |

## P3 — Maintenance, accessibility, SEO

| # | Finding | Status |
|---|---------|--------|
| P3-1 | **Build tooling is unusable on current Node.** `node-sass@9` is deprecated and has no prebuilt binary for Node 22, so `npm install` needs a native compile (it failed in the audit sandbox, partly for network reasons — unconfirmed on your machine). The gulpfile uses gulp 3 syntax with gulp 5 (`gulp.watch('…', ['sass'])`) and `gulp-sass` 5 without its required `sass` argument. `gulp default` also **deleted your originals** after resizing. | **fixed**: replaced by `npm run images` (sharp), keeps originals by default, strips GPS metadata |
| P3-2 | `.travis.yml` targets Ruby 2.2 on a retired CI service. No automated check exists. | **fixed**: GitHub Actions build check + Dependabot |
| P3-3 | The site text and meta say 263 photographs, the repository has 261 files in each of `fulls` and `thumbs`. | **not changed** — which two are missing from the web gallery? |
| P3-4 | Accessibility: every photo had empty alt text inside a link with no name; the "About" button had `aria-hidden="true"` (hidden from screen-reader users but still clickable); header links were rewritten by JavaScript into click handlers (no right-click or open-in-new-tab); the off-screen About sheet was reachable by Tab; no visible keyboard focus. | **fixed** (generic alt text, link name, `aria-expanded`, `inert`, focus ring, real links); meaningful per-photo alt text is Roadmap phase 4 |
| P3-5 | `<meta name="Content-Security-Policy">` and `<meta name="X-XSS-Protection">` do nothing (a CSP meta tag needs `http-equiv`; X-XSS-Protection is obsolete). They gave a false sense of protection. | **fixed** (removed). A real CSP is Roadmap phase 3 |
| P3-6 | jQuery 2.2.4 (2016) has known XSS issues that were fixed in 3.5; skel.js is abandoned. | **fixed** (removed) |
| P3-7 | `privacy.html` has `canonical`/`hreflang` pointing to `beta.awalkaday.art`; the sitemap listed `book.awalkaday.art` (a different host, not allowed in this sitemap). | sitemap **fixed**; privacy canonical **not changed** (confirm intended host) |
| P3-8 | Absolute URLs everywhere (`baseurl: "https://awalkaday.art"`): a local `jekyll serve` silently loads the production images. | **fixed** (relative URLs) |
| P3-9 | Stylesheets for IE 8/9 are still referenced (`ie8.css`, `ie9.css`); FontAwesome 4 ships six font formats for 7 icons; Source Sans is served as a TTF only (no WOFF2). | not changed — Roadmap phase 3 |
| P3-10 | "Latest Update" date and the photograph count are typed by hand in the templates. | not changed |

## P4 — Product ideas (besides structure and design)

See the Roadmap, phase 4: per-photo pages and share links, "view on Ethereum" links per photograph, real alt text, keyboard-friendly random "shuffle again", offline caching, structured data (schema.org `ImageGallery`), richer social previews.

## How to review this branch

1. Preview: Settings → Pages in the GitHub repo can build a branch preview, or locally `bundle install && bundle exec jekyll serve`.
2. Open the site at several window sizes (phone width, 1000 px, 1920 px, 4K or browser zoom 50 %), reload a few times (order and crop should change), open a photograph, use ← →, Esc, swipe on a phone, open About.
3. Open the browser's Network tab: first load should fetch a few dozen thumbnails, not 261.
4. Visual identity check: header bar, footer sheet, colours and typography were not touched (`main.min.css` is unchanged).
