# eCoach — website rebrand

A ground-up rebuild of [e-coach.co.uk](https://e-coach.co.uk): Vue 3, Vite and GSAP
ScrollTrigger, on a dark technical canvas built around the one colour already in
the brand — the pitch green from the eCoach tactics-board mark.

## Quick start

```bash
./run.sh            # install deps if needed, then start the dev server
./run.sh build      # production build into dist/
./run.sh preview    # build, then serve dist/ locally
./run.sh deploy     # build and push dist/ to the gh-pages branch
./run.sh clean      # remove node_modules and dist
```

Node 18+ is the only prerequisite; `run.sh` checks for it and installs
dependencies on first run.

## The rebrand

The existing logo is a tactics board — a pitch with circles, crosses and a dotted
play path. That drawing is the whole identity, so it was rebuilt as SVG
(`src/components/BrandMark.vue`) rather than shipped as a flat PNG. As geometry it
stays crisp at any size, takes its colour from CSS, and — the reason it matters —
the dotted play path can animate, which turns the mark into the signature motif
instead of a static badge. The same chalk-line language reappears as the tick
marks in the ecosystem cards and the rules under section eyebrows.

| Token | Value | Where it came from |
|---|---|---|
| `--brand` | `#00a06f` | sampled from the logo artwork |
| `--canvas` | `#050807` | near-black with a faint green cast |
| Display / body | Inter Tight / Inter | tight negative tracking on display sizes |
| Data & labels | JetBrains Mono | stats, prices, eyebrows |

Green is the only saturated colour on the page. Hierarchy is carried by a surface
ladder (`--surface-1` … `--surface-4`) and hairline borders rather than shadows.

## Content and assets

Copy, pricing, statistics, the client list and the sportscotland testimonial are
taken from the live site and collected in `src/data/site.js`. Media in
`public/media/` is likewise pulled from the current site:

- **Hero video** — the existing `eCoach-video-baw.mp4`, re-encoded from **51 MB to
  2.4 MB** (720p, silent, `faststart`). The original would have been the single
  heaviest thing on the page by a wide margin.
- **Product screenshots** — the real LMS, compliance, membership and learner
  dashboard captures, resized and converted to WebP.
- **Client logos** — 15 governing-body marks, shown full-colour on light tiles
  rather than flattened to white silhouettes, so each brand stays correct.

Total media weight is about 2.9 MB.

## Motion

GSAP ScrollTrigger drives the scroll work; CSS handles hovers and the looping
play path. Every tween lives inside a `gsap.context` scoped to its component, so
it is reverted on unmount.

- Hero headline reveals line by line out of a clipping mask; the video parallaxes
  behind it.
- The dashboard panel arrives tilted in perspective and straightens as it enters.
- Platform screenshots drift against the scroll.
- The ecosystem row scrolls horizontally while pinned — **desktop only**, via
  `gsap.matchMedia`. Below 900px it stays an ordinary swipeable, snapping row,
  because hijacking scroll on a phone costs more than the effect is worth.
- Statistics count up as they reach the viewport.

Two guards are load-bearing:

- **`prefers-reduced-motion`** — the GSAP context is skipped entirely, and the CSS
  resting state is already the final state, so content simply appears.
- **`.js-ready`** — every scroll-reveal resting state is scoped to a class added
  by `main.js`. Without JavaScript the page renders fully visible instead of
  leaving content stranded at `opacity: 0`.

## Deploying to GitHub Pages

A project site is served from `https://<owner>.github.io/<repo>/`, so the bundle
has to be built with that path prefix. `vite.config.js` reads it from
`BASE_PATH`, and every asset URL goes through the `asset()` helper in
`src/data/site.js`, which prefixes `import.meta.env.BASE_URL`. Nothing is
hard-coded to `/`.

### Option A — GitHub Actions (recommended)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. It
derives `BASE_PATH` from the repository name and handles the `<owner>.github.io`
case, where the site is served from the root instead.

```bash
git init && git add -A && git commit -m "eCoach rebrand"
git branch -M main
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

Then in **Settings → Pages**, set **Source** to **GitHub Actions**. Subsequent
pushes deploy on their own.

### Option B — push the built branch

```bash
./run.sh deploy
```

This builds with the right base path, adds `.nojekyll` and a `404.html`
fallback, and force-pushes `dist/` to `gh-pages`. Then set **Settings → Pages →
Source** to **Deploy from a branch**, `gh-pages` / root.

`.nojekyll` matters: without it Pages runs the output through Jekyll, which drops
any file or directory whose name begins with an underscore.

## Structure

```
index.html              %BASE_URL% placeholders for favicon and og:image
run.sh                  dev / build / preview / deploy / clean
vite.config.js          base path from BASE_PATH
src/
  data/site.js          all copy, pricing and the asset() helper
  styles/tokens.css     design tokens, type scale, reveal resting states
  composables/          GSAP context, scroll reveal, count-up
  components/           BrandMark, nav, hero, marquee, platform,
                        ecosystem scroller, builder, testimonial, CTA, footer
public/media/           video, product screenshots, client logos, brand marks
```

## Notes

- The pricing builder reproduces the live calculator: 2% bundle discount per
  additional block capped at 30%, 5% at three years and 8% at five, against a
  competitor modelled at £4 base + £1 per block per user per year. With nothing
  selected it shows an empty state rather than claiming a saving on a platform
  nobody bought.
- Prices and statistics are the ones published on the current site and should be
  confirmed before this goes live.
- "Book a walkthrough" and the footer's company links still point at the existing
  WordPress site; repoint them when the new pages exist.
