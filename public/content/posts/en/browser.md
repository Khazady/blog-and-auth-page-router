---
title: "Browser"
excerpt: "How a browser turns HTML and CSS into a UI: DOM, CSSOM, and the critical rendering path."
image: browser.png
isFeatured: false
date: "2026-01-13"
---

# Browser

## After entering a URL in the address bar

1. The browser uses [DNS](/posts/network#DNS) to obtain the domain IP address.
2. A [TCP](/posts/network#TCP) connection is opened; with HTTPS the [TLS](/posts/network#TLS) handshake happens.
3. The browser sends an HTTP request and receives HTML.
4. HTML is parsed into DOM, and links to CSS/JS/images are discovered.
5. CSS is parsed into CSSOM, and the render tree is built (DOM + CSSOM).
6. Layout calculates geometry, then paint draws pixels, compositing assembles layers.
7. JS makes the page interactive (especially important for SPA/SSR hydration).

## Critical Rendering Path (CRP)

CRP is the chain of steps from receiving HTML to the first render. Key stages:

- DOM -> CSSOM -> render tree -> layout -> paint -> compositing.

### What can block rendering

- **CSS** is render-blocking: until CSSOM is built, the page cannot paint.
- **Scripts without `defer/async`** block HTML parsing and can delay rendering.
- **Fonts** can delay text rendering (FOIT/FOUT).

### How to speed it up

- Use `defer` for scripts; keep only critical scripts synchronous.
- Put critical CSS inline in `<style>` and defer the rest.
- Use `preload`/`preconnect` for critical resources.
