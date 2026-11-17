# Roadmap — renovating the awalkaday.art web gallery

Principles: keep the visual identity (edge-to-edge black-and-white tiles, dark header bar, dark About sheet, Source Sans, random order and crop), keep the git history intact (no rewrites; large binaries are avoided in git), and keep it simple enough to maintain alone.

Findings and evidence are in [`AUDIT.md`](AUDIT.md).

## Phase 1 — Foundations (this branch)

Done in `renovation/gallery-2026`, in separate commits so each can be cherry-picked or reverted:

- [x] Lazy-loaded responsive grid; page visible immediately (P1-1, P1-2, P2-1…P2-4)
- [x] jQuery, skel.js, poptrox and Multiverse `main.js` replaced by one dependency-free script (10 KB, 3 KB gzipped, replacing about 110 KB of libraries that were each loaded twice); scripts no longer loaded twice (P1-3, P3-6)
- [x] Photograph viewer: keyboard, swipe, focus return, shareable link per photograph (`/#photo-9e4d2608`)
- [x] Random order and crop preserved, with an unbiased shuffle and crop on both axes (P2-5)
- [x] Accessibility basics (P3-4); relative URLs for local preview (P3-8)
- [x] `npm run images` (sharp) replaces the broken gulp pipeline; keeps originals, strips GPS (P3-1)
- [x] GitHub Actions build check, Dependabot (P3-2); inert security meta tags removed (P3-5)
- [x] `_data/photos.yml` hook for per-photo title, alt text and Ethereum link

**Before merging:** preview the branch at several window sizes (see AUDIT.md "How to review").

## Phase 2 — Image weight (biggest remaining win)

Today a visitor who scrolls through everything downloads up to ~73 MB. A trial re-encode (JPEG q82 + mozjpeg) shows 15.3 → 4.9 MB for thumbnails and 58 → 16 MB for the 1024 px files.

Recommended, in this order:

1. **Regenerate from your originals, not from the current files.** Re-compressing already-compressed JPEGs adds visible loss; the originals are not in the repository (the old gulp task deleted them). Put the originals in `images/` and run `npm run images`.
2. **Add an intermediate size** (~768 px) so high-density laptop screens get a sharp tile without downloading the 1024 px file, and a **larger viewer size** (1600–2048 px) for big screens. The script already accepts `--fulls=` and `--thumbs=`; extending it to several widths + `srcset` is a small change.
3. **WebP/AVIF with JPEG fallback** (`<picture>`): thumbnails ~3.4 MB as WebP in the trial.
4. **Where to keep the binaries.** The images already make up most of the repository (69 MB shallow). Rewriting history to shrink it is not recommended (it would invalidate commit links and the code-frequency graph linked in the footer). Options that keep history intact: (a) keep images in the repo and accept growth, (b) from now on store new generated sizes with Git LFS, (c) serve images from a CDN or from the IPFS gateway used for the NFT metadata and keep only a manifest in git. Decide before regenerating, because every regeneration adds a full copy of the images to history.

## Phase 3 — Simplify the front-end stack

- Retire the SCSS (`assets/sass`): it no longer matches what is served (AUDIT P2-6). Treat `main.min.css` as the source, split it into readable plain CSS with custom properties (colours, spacing), delete `main.css`, `ie8.css`, `ie9.css`.
- Replace FontAwesome 4 (six font files for seven icons) with inline SVG icons; serve Source Sans as WOFF2 (the TTF is 299 KB).
- Add a real Content-Security-Policy (`<meta http-equiv>`), once the inline shuffle script is moved to a hashed or external file; `privacy.html` already has a working one to copy from.
- Decide on the About panel's desktop layout (AUDIT P2-7) — the intended two columns are currently broken by an invalid CSS declaration.
- Automatic "latest update" and photo count in the footer and meta description (from the build, instead of typed by hand).
- Optional: move to Jekyll 4 / a plain GitHub Actions deployment, so the site is no longer bound to the `github-pages` gem's old Jekyll 3.

## Phase 4 — Features that serve visitors and the project

Ordered by value for effort:

1. **Real alt text and titles.** Today every photo says "Black-and-white photograph…". Fill `_data/photos.yml` (title, alt). I can draft alt text for all 261 photographs for you to correct — it is the best accessibility and search-engine improvement available.
2. **Link each photograph to its token.** The smart contract is already in the footer (`0xE318…7eB1`). With a table of file → token ID, the viewer shows "View on Ethereum" (already supported through `chain:`), and the "collect" store can link to the exact work.
3. **Shareable links** — already in place (`/#photo-<id>`); add a share/copy button and per-photograph Open Graph previews (needs one generated page per photo, about 261 small HTML files).
4. **Navigation:** a "shuffle again" button; optional filter or search once titles exist; a "walk" slideshow mode (auto-advance).
5. **Structured data** (`schema.org/ImageGallery`, `ImageObject` with license CC BY-NC-ND and creator) for search engines.
6. **Offline / repeat visits:** a small service worker that caches the shell and already-seen thumbnails.
7. **Reduced motion and dark/light:** respect `prefers-reduced-motion` (done for the new CSS) and optionally `prefers-color-scheme`.
8. **Print/book bridge:** link each photo to the passage of the online book (printlab.awalkaday.art) that mentions it, using the same data file.

## Open questions for you

1. The site says 263 photographs but the repository holds 261 — which two are missing from the gallery, and should they be added?
2. Are your original, full-size files still available (needed for phase 2)?
3. Should the About panel keep its stacked layout on desktop, or use the two-column layout the theme intended?
4. Is `awalkaday.art` the only canonical host (the privacy page still says `beta.awalkaday.art`)?
5. Two columns on phones (new) instead of one very large tile — keep, or go back to one? It is one CSS value (`--tile-min`, in `assets/css/gallery.css`).
