/**
 * One-off migration: pulls pages and posts out of the old WordPress site,
 * strips them back to semantic HTML, downloads the images, and writes the
 * result into src/content/ so the build never needs the network.
 *
 * Re-run with:  node scripts/fetch-content.mjs
 *
 * The source markup is Themify page-builder output with Word-pasted spans and
 * inline styles — 30KB for a 400-word article. Everything below exists to get
 * from that to clean <h2>/<p>/<ul> we can style ourselves.
 */
import { parse } from 'node-html-parser'
import { writeFile, mkdir } from 'node:fs/promises'
import { createWriteStream, existsSync } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'

const API = 'https://e-coach.co.uk/wp-json/wp/v2'
const ROOT = new URL('..', import.meta.url).pathname
const IMG_DIR = path.join(ROOT, 'public/media/content')
const OUT_DIR = path.join(ROOT, 'src/content')
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/125.0 Safari/537.36'

/** Tags worth keeping. Everything else is unwrapped or dropped. */
const KEEP = new Set(['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote', 'a', 'strong', 'em', 'br', 'img', 'figure', 'figcaption'])
const UNWRAP = new Set(['div', 'span', 'section', 'article', 'header', 'footer', 'b', 'i', 'u', 'font', 'center', 'small', 'table', 'tbody', 'tr', 'td', 'th'])
const DROP = new Set(['script', 'style', 'noscript', 'iframe', 'form', 'input', 'button', 'svg', 'nav', 'aside'])
const ATTRS = { a: ['href'], img: ['src', 'alt'] }

const seenImages = new Map()

const get = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

/** Pull every page of a paginated WP collection. */
async function all(endpoint, fields) {
  const out = []
  for (let page = 1; page < 20; page++) {
    const url = `${API}/${endpoint}?per_page=100&page=${page}&_fields=${fields}`
    let batch
    try { batch = await get(url) } catch { break }
    if (!Array.isArray(batch) || !batch.length) break
    out.push(...batch)
    if (batch.length < 100) break
  }
  return out
}

async function downloadImage(src) {
  if (!src || src.startsWith('data:')) return null
  if (seenImages.has(src)) return seenImages.get(src)

  // Strip WP's -300x200 style size suffix to get the original.
  const clean = src.replace(/-\d{2,4}x\d{2,4}(?=\.[a-z]{3,4}($|\?))/i, '')
  const ext = (clean.match(/\.(jpe?g|png|webp|gif|svg)(?=$|\?)/i)?.[1] || 'jpg').toLowerCase()
  const name = `${path.basename(clean.split('?')[0]).replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase().slice(0, 60)}.${ext}`
  const dest = path.join(IMG_DIR, name)
  const rel = `media/content/${name}`

  if (!existsSync(dest)) {
    try {
      const res = await fetch(clean, { headers: { 'User-Agent': UA } })
      if (!res.ok) throw new Error(String(res.status))
      await pipeline(Readable.fromWeb(res.body), createWriteStream(dest))
    } catch {
      seenImages.set(src, null)
      return null
    }
  }
  seenImages.set(src, rel)
  return rel
}

/** Recursively reduce the builder soup to the allowlist above. */
function clean(node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 8) { child.remove(); continue }        // comment
    if (child.nodeType !== 1) continue                            // text
    const tag = child.rawTagName?.toLowerCase()
    if (!tag) continue

    if (DROP.has(tag)) { child.remove(); continue }
    clean(child)

    if (UNWRAP.has(tag) || !KEEP.has(tag)) {
      // Word paste wraps every run in <span><b>; promote bold runs so the
      // emphasis survives the unwrap.
      const replacement = (tag === 'b' || tag === 'i')
        ? `<${tag === 'b' ? 'strong' : 'em'}>${child.innerHTML}</${tag === 'b' ? 'strong' : 'em'}>`
        : child.innerHTML
      child.replaceWith(replacement)
      continue
    }

    const allowed = ATTRS[tag] || []
    for (const name of Object.keys(child.attributes)) {
      if (!allowed.includes(name)) child.removeAttribute(name)
    }
  }
  return node
}

function tidy(html) {
  let out = html
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/<(h2|h3|h4)>(\s|&nbsp;)*<\/\1>/gi, '')
    .replace(/<li>(\s|&nbsp;)*<\/li>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/(\r?\n){2,}/g, '\n')
  // strong wrapping an entire heading is noise once we style headings
  out = out.replace(/<(h2|h3|h4)><strong>(.*?)<\/strong><\/\1>/gis, '<$1>$2</$1>')
  return out.trim()
}

async function processHtml(raw) {
  const root = parse(raw, { blockTextElements: { script: false, style: false } })
  clean(root)

  for (const img of root.querySelectorAll('img')) {
    const local = await downloadImage(img.getAttribute('src'))
    if (!local) { img.remove(); continue }
    img.setAttribute('src', local)
    if (!img.getAttribute('alt')) img.setAttribute('alt', '')
  }

  // Keep links, but send internal ones to the new site's own routes later.
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href') || ''
    if (!href || href.startsWith('#')) a.replaceWith(a.innerHTML)
  }

  return tidy(root.innerHTML)
}

const strip = (html) => parse(html || '').textContent.replace(/\s+/g, ' ').trim()

async function main() {
  await mkdir(IMG_DIR, { recursive: true })
  await mkdir(OUT_DIR, { recursive: true })

  console.log('fetching…')
  const [rawPosts, rawPages, cats] = await Promise.all([
    all('posts', 'id,slug,date,title,content,excerpt,categories,featured_media'),
    all('pages', 'id,slug,title,content'),
    all('categories', 'id,name,slug')
  ])
  const catName = Object.fromEntries(cats.map((c) => [c.id, c.name]))

  const media = new Map()
  const ids = [...new Set(rawPosts.map((p) => p.featured_media).filter(Boolean))]
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await get(`${API}/media?include=${ids.slice(i, i + 50).join(',')}&per_page=50&_fields=id,source_url,alt_text`)
    batch.forEach((m) => media.set(m.id, m))
  }

  const posts = []
  for (const p of rawPosts) {
    const html = await processHtml(p.content.rendered)
    if (strip(html).length < 120) continue          // drop stubs
    const hero = media.get(p.featured_media)
    posts.push({
      slug: p.slug,
      title: strip(p.title.rendered),
      date: p.date.slice(0, 10),
      excerpt: strip(p.excerpt?.rendered || '').replace(/\[…\]$/, '').slice(0, 220),
      categories: (p.categories || []).map((id) => catName[id]).filter(Boolean),
      image: hero ? await downloadImage(hero.source_url) : null,
      imageAlt: hero?.alt_text || '',
      html,
      readingMinutes: Math.max(1, Math.round(strip(html).split(/\s+/).length / 210))
    })
    process.stdout.write('.')
  }
  console.log()

  const pages = []
  for (const p of rawPages) {
    const html = await processHtml(p.content.rendered)
    if (strip(html).length < 80) continue
    pages.push({ slug: p.slug, title: strip(p.title.rendered), html })
  }

  posts.sort((a, b) => b.date.localeCompare(a.date))
  await writeFile(path.join(OUT_DIR, 'posts.json'), JSON.stringify(posts, null, 1))
  await writeFile(path.join(OUT_DIR, 'pages.json'), JSON.stringify(pages, null, 1))

  console.log(`posts: ${posts.length}  pages: ${pages.length}  images: ${[...seenImages.values()].filter(Boolean).length}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
