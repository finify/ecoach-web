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

## Pages

The site is a prerendered multi-page app. `vite-ssg` renders every route below
to its own `index.html`, so a deep link is a real 200 with real markup — not an
empty shell hydrated by JavaScript, and not the `404.html` fallback trick.

| Route | What it is |
|---|---|
| `/` | The single-page pitch: hero, platform, blocks, pricing builder, orbit |
| `/what-we-do` | Course catalogue, tailored LXP, module creation |
| `/platform` | All 10 blocks with prices |
| `/platform/:slug` | A detail page per block (10 of them) |
| `/case-studies` | The 7 client case studies |
| `/testimonials` | Quote plus the client wall |
| `/team` | Three bios, photos and direct emails |
| `/news` | All 43 articles, filterable by category |
| `/news/:slug` | An article page per post (43 of them) |
| `/contact` | Walkthrough request (see below) |
| `/cookie-policy` | Migrated legal text |
| `404.html` | The prerendered not-found route |

That is **63 HTML files**, each with its own `<title>` and description.

### The contact form

GitHub Pages is a static host, so there is nowhere to `POST`. The form composes
a `mailto:` from the fields instead — the visitor's own mail client sends it,
and they keep a copy in their Sent folder. Swapping in a real endpoint later
means changing one computed property in `ContactView.vue`.

## Content migration

`npm run content` re-runs the whole pipeline against the live WordPress site:

```
scripts/fetch-content.mjs    pull pages + posts, sanitise, download images
scripts/optimise-images.mjs  convert to WebP, rewrite references
scripts/build-data.mjs       derive team/courses, split article bodies
```

The output is committed to `src/content/`, so an ordinary build never touches
the network.

Two things the pipeline exists to solve:

- **The source markup is Themify page-builder output with Word-pasted spans** —
  30KB of nested `<div>`s and inline styles for a 400-word article. The
  sanitiser reduces everything to an allowlist (`h2`–`h4`, `p`, lists,
  `blockquote`, `a`, `img`) so one set of `.prose` rules styles all 43 posts.
- **Images came off WordPress at full upload resolution**, 26.5MB across 172
  files. They are resized to 1400px and converted to WebP, which brings that to
  9.5MB.

`posts.json` holds only the index (21KB). Article bodies live in
`articles.json` (194KB) and load on article routes only — otherwise every
listing page would ship all 43 bodies just to render a grid of titles.

The block detail pages are hand-authored in `src/data/blockPages.js` rather than
migrated: those source pages are interactive product mockups, so their markup
reduces to fragments rather than prose. Their intros and feature names are taken
verbatim from the originals.

## Structure

```
index.html              %BASE_URL% placeholders for favicon and og:image
run.sh                  dev / build / preview / deploy / clean
vite.config.js          base path + the list of routes to prerender
scripts/                the one-off WordPress migration pipeline
src/
  router.js             every route, listed explicitly
  main.js               ViteSSG entry; sets the router base from BASE_URL
  data/site.js          home-page copy, pricing, asset() + withAssetPaths()
  data/blockPages.js    the 10 block detail pages
  content/              migrated posts, pages, team, courses (committed)
  styles/tokens.css     design tokens, type scale, .prose, reveal states
  composables/          GSAP context, scroll reveal, count-up, SEO head
  components/           BrandMark, nav, footer, hero, marquee, platform,
                        ecosystem scroller, builder, orbit, cards
  views/                one component per route
public/media/           video, screenshots, client logos, migrated images
```

## Notes

- The pricing builder reproduces the live calculator: 2% bundle discount per
  additional block capped at 30%, 5% at three years and 8% at five, against a
  competitor modelled at £4 base + £1 per block per user per year. With nothing
  selected it shows an empty state rather than claiming a saving on a platform
  nobody bought.
- Prices and statistics are the ones published on the current site and should be
  confirmed before this goes live.
- Internal links now point at the new routes. The only outbound links left are
  the team's `mailto:` addresses.
- Four block pages on the old site have no content (the site itself says they
  are "currently being improved"), so they are not built here. The directory
  block is included because the home page carried enough copy to stand one up.
- The router base comes from `BASE_URL`. Without it every internal link would
  resolve against the domain root and 404 under the `/ecoach-web/` path.
