#!/usr/bin/env node
// Fetch fish photos from Pexels and store them locally under /public/fish/.
// Usage:
//   1. Get a free API key at https://www.pexels.com/api/
//   2. Run:   PEXELS_API_KEY=xxxx node scripts/fetch-fish-images.mjs
//      (PowerShell:  $env:PEXELS_API_KEY="xxxx"; node scripts/fetch-fish-images.mjs)
//
// What it does:
//   - For each fish in app/games/aqua-fishing/fishData.ts (kept species),
//     searches Pexels with the English query below.
//   - Downloads the top result (orientation=landscape) to /public/fish/<species>.jpg
//   - Rewrites the imageUrl field in fishData.ts to /fish/<species>.jpg for
//     successfully-fetched species. Failed ones keep their existing Wikimedia URL.
//   - Prints a summary of OK / FAIL at the end.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FISH_DATA_PATH = path.join(ROOT, 'app', 'games', 'aqua-fishing', 'fishData.ts');
const PUBLIC_DIR = path.join(ROOT, 'public', 'fish');

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: PEXELS_API_KEY env var is required.');
  console.error('Get one at https://www.pexels.com/api/ and re-run.');
  process.exit(1);
}

// Per-species English search queries tuned for accuracy.
const QUERIES = {
  mackerel: 'mackerel fish',
  japanese_sea_bass: 'sea bass fish',
  red_sea_bream: 'red sea bream',
  flounder: 'flounder fish',
  olive_flounder: 'halibut fish',
  skipjack_tuna: 'skipjack tuna',
  yellowfin_tuna: 'yellowfin tuna',
  bluefin_tuna: 'bluefin tuna',
  japanese_amberjack: 'yellowtail fish',
  yellowtail_amberjack: 'amberjack fish',
  greater_amberjack: 'greater amberjack',
  pacific_cod: 'cod fish',
  hairtail: 'cutlassfish',
  bigfin_reef_squid: 'reef squid',
  skate_ray: 'stingray',
  john_dory: 'john dory fish',
  giant_grouper: 'giant grouper',
  ocean_sunfish: 'ocean sunfish mola',
  blue_marlin: 'blue marlin',
  great_white_shark: 'great white shark',
  hammerhead_shark: 'hammerhead shark',
  whale_shark: 'whale shark',
  killer_whale: 'orca killer whale',
  sperm_whale: 'sperm whale',
  blue_whale: 'blue whale',
};

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) return null;
  return photo.src.large || photo.src.original || photo.src.medium;
}

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

function updateImageUrlInFile(fileContent, species, newUrl) {
  // Match the line: 'species': { ... imageUrl: '...current...' ...
  const lineRe = new RegExp(`('${species}':\\s*\\{[^}]*?imageUrl:\\s*)'[^']*'`, 's');
  if (!lineRe.test(fileContent)) {
    throw new Error(`Could not locate imageUrl line for ${species}`);
  }
  return fileContent.replace(lineRe, `$1'${newUrl}'`);
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  let source = fs.readFileSync(FISH_DATA_PATH, 'utf8');

  const ok = [];
  const fail = [];

  for (const [species, query] of Object.entries(QUERIES)) {
    if (!source.includes(`'${species}':`)) {
      console.log(`SKIP  ${species} (not in fishData.ts)`);
      continue;
    }
    try {
      const photoUrl = await searchPexels(query);
      if (!photoUrl) {
        fail.push([species, 'no photo found']);
        console.log(`FAIL  ${species} (no Pexels match for "${query}")`);
        continue;
      }
      const dest = path.join(PUBLIC_DIR, `${species}.jpg`);
      await download(photoUrl, dest);
      const publicUrl = `/fish/${species}.jpg`;
      source = updateImageUrlInFile(source, species, publicUrl);
      ok.push(species);
      console.log(`OK    ${species}  ->  ${publicUrl}`);
      // mild throttle to be polite to the API
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      fail.push([species, e.message]);
      console.log(`FAIL  ${species}  (${e.message})`);
    }
  }

  fs.writeFileSync(FISH_DATA_PATH, source);

  console.log(`\nDone. OK: ${ok.length}, FAIL: ${fail.length}`);
  if (fail.length) {
    console.log('Failures (kept existing Wikimedia URL):');
    for (const [s, m] of fail) console.log(`  - ${s}: ${m}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
