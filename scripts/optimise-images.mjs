/**
 * Converts the migrated WordPress images to WebP at a sane width and rewrites
 * the references in src/content/*.json.
 *
 * The originals come off WordPress at full upload resolution — 27MB across
 * 172 files, which is more than the rest of the site combined. Run after
 * fetch-content.mjs.
 */
import { readFile, writeFile, readdir, unlink, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = new URL('..', import.meta.url).pathname
const DIR = path.join(ROOT, 'public/media/content')
const MAX_W = 1400

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f))
let before = 0
let after = 0
const renames = new Map()

for (const file of files) {
  const src = path.join(DIR, file)
  const out = file.replace(/\.(jpe?g|png)$/i, '.webp')
  const dest = path.join(DIR, out)
  before += (await stat(src)).size

  try {
    await run('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', src,
      // Only ever shrink: upscaling a small logo would add bytes for nothing.
      '-vf', `scale='min(${MAX_W},iw)':-2`,
      '-c:v', 'libwebp', '-q:v', '82',
      dest
    ])
    after += (await stat(dest)).size
    await unlink(src)
    renames.set(`media/content/${file}`, `media/content/${out}`)
  } catch (e) {
    console.warn('skipped', file, e.message.split('\n')[0])
  }
}

for (const name of ['posts.json', 'pages.json']) {
  const p = path.join(ROOT, 'src/content', name)
  let raw = await readFile(p, 'utf8')
  for (const [from, to] of renames) raw = raw.split(from).join(to)
  await writeFile(p, raw)
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + 'MB'
console.log(`${renames.size} images: ${mb(before)} -> ${mb(after)}`)
