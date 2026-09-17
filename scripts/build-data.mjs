/**
 * Derives structured data from the migrated page HTML.
 *
 * The team and course-library pages hold real records (name/role/bio/email,
 * course titles) inside builder markup. Parsing them once into JSON beats
 * dumping their HTML into a page and hoping it styles well.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { parse } from 'node-html-parser'
import path from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIR = path.join(ROOT, 'src/content')
const pages = JSON.parse(await readFile(path.join(DIR, 'pages.json'), 'utf8'))
const by = Object.fromEntries(pages.map((p) => [p.slug, p]))

// ---- team ---------------------------------------------------------------
// Each member appears as a portrait followed by <h3><strong>Name</strong><br>
// Role</h3> and a bio paragraph. Pair them by position in the source rather
// than by tree structure — the builder nests them inconsistently.
const html = by.team.html
const team = []
const imgAt = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => ({ i: m.index, src: m[1] }))

for (const m of html.matchAll(/<h3>(.*?)<\/h3>([\s\S]*?)(?=<h3>|$)/g)) {
  const head = parse(m[1])
  const name = head.querySelector('strong')?.textContent.trim() || ''
  if (!name) continue
  const role = head.textContent.replace(name, '').replace(/\s+/g, ' ').trim()

  const after = parse(m[2])
  let bio = ''
  let email = ''
  for (const para of after.querySelectorAll('p')) {
    const mail = para.querySelector('a[href^="mailto:"]')
    if (mail) email = mail.getAttribute('href').replace('mailto:', '')
    else if (!bio && para.textContent.trim().length > 60) bio = para.textContent.replace(/\s+/g, ' ').trim()
  }

  // nearest portrait above this heading
  const prior = imgAt.filter((x) => x.i < m.index)
  team.push({ name, role, bio, email, image: prior.length ? prior[prior.length - 1].src : null })
}

// ---- course library -----------------------------------------------------
const SKIP = /need something custom|create fully bespoke|^sport positions$|^volunteering training$/i
const courses = [...new Set(
  parse(by['course-library-bespoke'].html)
    .querySelectorAll('h3, h4')
    .map((h) => h.textContent.replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 5 && t.length < 70 && !SKIP.test(t))
)]

await writeFile(path.join(DIR, 'team.json'), JSON.stringify(team, null, 1))
await writeFile(path.join(DIR, 'courses.json'), JSON.stringify(courses, null, 1))
console.log(`team: ${team.length}  courses: ${courses.length}`)
team.forEach((t) => console.log(`  ${t.name} — ${t.role} ${t.email ? '<' + t.email + '>' : '(no email)'} ${t.image ? '' : '(no photo)'} bio:${t.bio.length}`))

// ---- split article bodies out of the index ------------------------------
// posts.json is imported by every listing page. Shipping all 43 article
// bodies with it put 216KB of JS in front of anyone browsing the index, so
// the bodies live in their own module that only the article route pulls in.
const posts = JSON.parse(await readFile(path.join(DIR, 'posts.json'), 'utf8'))
if (posts.length && 'html' in posts[0]) {
  const bodies = Object.fromEntries(posts.map((p) => [p.slug, p.html]))
  const index = posts.map(({ html, ...rest }) => rest)
  await writeFile(path.join(DIR, 'posts.json'), JSON.stringify(index, null, 1))
  await writeFile(path.join(DIR, 'articles.json'), JSON.stringify(bodies, null, 1))
  console.log(`split: index ${(JSON.stringify(index).length / 1024).toFixed(0)}KB · bodies ${(JSON.stringify(bodies).length / 1024).toFixed(0)}KB`)
}
