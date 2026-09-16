# Claude design & animation skills — portable bundle

Everything design-related that was installed into the TopTab project, ready to
drop into another one. No network needed; the skills are the files themselves.

## What is inside

**14 skills** in `.claude/skills/` — each a folder with a `SKILL.md` that Claude
loads on demand:

| Skill | What it does |
|---|---|
| `animate` | Build a web animation from scratch — which property, which curve, how it interrupts |
| `animate-expo` | The same for React Native / Expo (Reanimated, Gesture Handler, haptics) |
| `animation-vocabulary` | Reverse lookup: describe a motion effect, get its real name |
| `apple-design` | Apple's approach to fluid, physical UI, translated for the web |
| `apple-design` / `emil-design-eng` | UI polish, component design, the invisible details |
| `ask-sonner` | The Sonner toast library — setup, promise toasts, styling, gotchas |
| `design-md-library` | 76 brand design systems (see below) |
| `find-animation-opportunities` | Scan a codebase for places that should animate but don't |
| `image-to-code` | Generate a design image first, then implement the page to match it |
| `improve-animations` | Audit a whole codebase's motion, produce a prioritised plan |
| `pick-ui-library` | Choosing a component library for a given project |
| `prototype` | Rapid prototyping workflow |
| `review-animations` | Critique motion in a diff |
| `write-swift` | Modern Swift — concurrency, value types, Swift Testing |

**76 brand design systems** in `.claude/design-md/` — plain-text design
languages for Apple, Airbnb, Linear, Stripe, Vercel, Notion, Spotify, Tesla,
Shopify, Coinbase, Framer, Cursor and more. Each is a `DESIGN.md` defining that
brand's colour, type, spacing, motion and component rules. Used by the
`design-md-library` skill when you ask for UI "like <brand>".

**`.agents/skills/design-taste-frontend`** — the same skill in the `.agents`
layout, for tools that read from there instead.

**`skills-lock.json`** — records where each skill came from
(`emilkowalski/skills`, `Leonxlnx/taste-skill`) and its content hash, so a
skill installer can verify or update them later.

## Install into another project

From the root of the target project:

```bash
tar -xzf toptab-design-skills.tar.gz
```

That creates `.claude/skills/`, `.claude/design-md/`, `.agents/skills/` and
`skills-lock.json`. If the project already has a `.claude/` directory, the
archive merges into it — existing files with the same names are overwritten,
everything else is left alone.

Nothing else is required. Claude discovers skills by reading `.claude/skills/`,
so they are available in that project from the next session.

To check it worked:

```bash
ls .claude/skills          # 14 entries
ls .claude/design-md | wc -l   # 76
```

## What was deliberately left out

`.claude/settings.json` is **not** included. It holds TopTab-specific tool
permissions with absolute paths, plus a seeded admin password and API bearer
tokens from development. Copying it into another project would carry those
across and grant permissions that make no sense there. Write a fresh one, or
let Claude build it up as you approve tools.

## Licence

`.claude/design-md/LICENSE` covers the brand design files. The skills come from
their respective public repositories, credited in `skills-lock.json`.
