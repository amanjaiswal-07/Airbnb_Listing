// Asset import from the reference deployment (user-approved).
// The reference rejects non-browser clients (HTTP 429), so files are downloaded in a real browser:
//   1. node scripts/assets.mjs snippet   -> writes scripts/download-snippet.js
//   2. Open the reference in Chrome, paste that snippet into the DevTools console (saves one JSON bundle)
//   3. node scripts/assets.mjs import [downloadsDir]   -> unpacks the bundle into public/images/
// Photos are renamed by photo-tour section so the data file stays readable.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const OUT = join(import.meta.dirname, '..', 'public', 'images')

// Photo-tour order (see docs/REFERENCE_NOTES.md)
const sections = {
  'living-room-1': ['a9831aeb-f441-44f5-a38f-4cf54e3f0fcf', 'a45feaa2-b607-4092-83ac-5fd4b2894959', 'f1da1c3d-0d10-481e-9b63-c71f9073f30b'],
  'living-room-2': ['090d8b0b-b539-42c0-84f8-e1fb0cdf9a93', '9be71047-fc52-438a-9270-75cb470f6752', 'f6de1663-4e9c-4414-b63b-29a154a92ee1', '2367476f-11c4-4a14-a7c6-267be62c1d59', '34529829-a971-44d3-ac2f-90ea3678a34d', '153aa732-4935-48b8-a6fe-b469b6af5efc', '3c6e6809-1bb1-47a6-8e24-aff593e1c28f'],
  'full-kitchen': ['56c44812-52c0-4481-90d8-101ec1f34c7a', 'ddc853d7-e658-405c-bedc-8f31106c447e'],
  bedroom: ['67c61c6f-6260-4809-9510-0360e58a345d', '1c827136-4a85-4fe0-8e69-3fd8ea19bb17', '0622ab42-b851-4d55-9d9f-df3143bc5909', 'a74e3c0b-3188-4442-9146-1cd4d6ea45df', '48a8ffbc-fbf7-4f84-bc29-ee400da3f08b', '3cf31697-f3f3-4c60-82c4-029acb119ae4'],
  'full-bathroom': ['97c78f8a-5090-4663-aebc-ba4e13b47092'],
  gym: ['9aa8e65f-94ac-4ba0-9a10-9ec91e536d22', '246bd88d-4dd6-4117-a401-02a36ebfcf16', '4fede77d-7a71-446f-89e3-263af937f3fa', '79f59adb-5a5f-4d6c-8109-1f01f4ca0d03', 'f19d8c0a-1d88-42a4-9218-686d4f0db7e4'],
  exterior: ['23ea6621-6f74-4baa-acea-2fd03e312b41', '5adfdf3e-d497-4efc-ab8c-fc559dab311e', '608748cd-6ee7-4a71-88a2-ba79d3ddba5a', '5b856fde-a393-41bf-b373-c9d02e64221f', 'c904e1ab-a39d-4ef0-bdea-8c0bd16b9e3d', '42befad7-fb29-473d-91db-b03e7a544d1d'],
  pool: ['fc02f48f-a937-42c5-895d-f9cc3113d6ca', '929545d3-e241-46c0-8a70-c24531ce7b54', '8eb65a8b-e795-4870-b141-6f63b1be24ae'],
  'additional-photos': ['70325367-cbae-4993-b560-18cd3f6edd53', 'cc7a56bd-242c-498a-9aef-0cffac619e54', '30ad93b2-293f-494d-b645-626303c6cb93', '9642a60d-e9de-4e1a-89c2-9ebd230f4a74', 'b6599f26-d65c-4df0-baf2-ef18c82a86a3', 'dc01fd46-b119-48d3-a43b-f6c093e26eca', 'fe37b80e-da8a-4225-b27b-dfbb5d763c01', '3c90338e-86b4-423f-aae1-279e0ccc3a18', '862d936c-0f34-4e50-af87-b519e2781d19', '79addceb-8c2d-419b-80ff-e29af426a94c'],
}

const jobs = []
for (const [section, ids] of Object.entries(sections)) {
  ids.forEach((id, i) => {
    jobs.push([`${id}.jpeg`, `photos/${section}-${String(i + 1).padStart(2, '0')}.jpeg`])
  })
}

const ui = ['ui/searchbar-house.png', 'ui/laurel-left.png', 'ui/laurel-right.png', 'ui/discount.svg']
const chips = ['comfort', 'accuracy', 'hot-tub', 'condition', 'hospitality', 'cleanliness', 'amenities', 'decor', 'indoor-spaces', 'location'].map((c) => `chips/${c}.png`)
const avatars = ['host.jpeg', 'rev1.jpeg', 'rev2.jpeg', 'rev3.jpeg', 'rev4.jpeg', 'rev5.jpeg', 'co1.jpg', 'co2.jpg', 'co3.jpg'].map((a) => `avatars/${a}`)
const similar = [1, 2, 3, 4, 5, 6].map((n) => `similar/s${n}.jpeg`) // cards 7–8 reuse s2/s4
for (const p of [...ui, ...chips, ...avatars, ...similar]) jobs.push([p, p])

const BUNDLE = 'airbnb-assets.json'
const [command, dirArg] = process.argv.slice(2)

if (command === 'snippet') {
  const list = JSON.stringify(jobs)
  const snippet = `// Paste into the DevTools console on the reference page (after it has fully loaded).
// Reads from the browser cache first, paces requests, and backs off on 429 so the
// site's rate limit is respected. Saves everything as one ${BUNDLE} download.
(async () => {
  const jobs = ${list};
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const toDataUrl = (blob) => new Promise((r) => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(blob); });
  const out = {};
  const failed = [];
  for (const [i, [src, dest]] of jobs.entries()) {
    const url = '/assets/images/' + src;
    let res = await fetch(url, { cache: 'force-cache' });
    for (let wait = 5000; res.status === 429 && wait <= 40000; wait *= 2) {
      console.log('rate limited on ' + src + ', waiting ' + wait / 1000 + 's');
      await sleep(wait);
      res = await fetch(url, { cache: 'force-cache' });
    }
    if (!res.ok) { failed.push(src + ' (' + res.status + ')'); continue; }
    out[dest] = await toDataUrl(await res.blob());
    console.log((i + 1) + '/' + jobs.length + ' ' + dest);
    await sleep(1200);
  }
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' })),
    download: '${BUNDLE}',
  });
  a.click();
  console.log('saved ' + Object.keys(out).length + '/' + jobs.length + ' files to ${BUNDLE}');
  if (failed.length) console.warn('failed: ' + failed.join(', '));
})();
`
  await writeFile(join(import.meta.dirname, 'download-snippet.js'), snippet)
  console.log(`wrote scripts/download-snippet.js (${jobs.length} files)`)
} else if (command === 'import') {
  const bundlePath = join(dirArg ?? join(homedir(), 'Downloads'), BUNDLE)
  const bundle = JSON.parse(await readFile(bundlePath, 'utf8'))
  let written = 0
  for (const [, dest] of jobs) {
    const dataUrl = bundle[dest]
    if (!dataUrl) continue
    const file = join(OUT, dest)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64'))
    written++
  }
  const missing = jobs.map(([, dest]) => dest).filter((dest) => !bundle[dest])
  console.log(`imported ${written}/${jobs.length} files into public/images`)
  if (missing.length) console.log('missing:', missing.join(', '))
} else {
  console.log('usage: node scripts/assets.mjs snippet | import [downloadsDir]')
}
