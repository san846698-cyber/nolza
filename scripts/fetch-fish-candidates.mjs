#!/usr/bin/env node
// For each problem species, fetch top N Pexels candidates into
// public/fish/_candidates/<species>/0.jpg ... N-1.jpg, so we can visually
// review and pick the best full-body shot.
//
// Usage:  PEXELS_API_KEY=xxx node scripts/fetch-fish-candidates.mjs
// PowerShell: $env:PEXELS_API_KEY="xxx"; node scripts/fetch-fish-candidates.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CANDIDATES_DIR = path.join(ROOT, 'public', 'fish', '_candidates');

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) { console.error('PEXELS_API_KEY required'); process.exit(1); }

// Tuned queries — broader/biological terms tend to surface single-specimen shots
const QUERIES = {
  mackerel: 'mackerel single fish',
  red_sea_bream: 'red snapper fish',
  flounder: 'flatfish flounder',
  olive_flounder: 'halibut flatfish',
  skipjack_tuna: 'tuna swimming underwater',
  yellowfin_tuna: 'yellowfin tuna swimming',
  bluefin_tuna: 'bluefin tuna underwater',
  japanese_amberjack: 'yellowtail seriola',
  yellowtail_amberjack: 'amberjack swimming',
  greater_amberjack: 'amberjack underwater',
  pacific_cod: 'cod fish whole',
  hairtail: 'ribbonfish cutlassfish',
  bigfin_reef_squid: 'squid underwater swimming',
  blue_marlin: 'marlin fish ocean',
  john_dory: 'john dory zeus faber',
  sperm_whale: 'sperm whale ocean',
  blue_whale: 'blue whale swimming',
  giant_grouper: 'grouper fish underwater',
};

const PER_PAGE = 10;

async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${PER_PAGE}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status}`);
  const data = await res.json();
  return data.photos || [];
}

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

async function main() {
  if (!fs.existsSync(CANDIDATES_DIR)) fs.mkdirSync(CANDIDATES_DIR, { recursive: true });

  for (const [species, query] of Object.entries(QUERIES)) {
    const dir = path.join(CANDIDATES_DIR, species);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    try {
      const photos = await searchPexels(query);
      console.log(`${species}: ${photos.length} candidates`);
      for (let i = 0; i < photos.length; i++) {
        const url = photos[i].src.large || photos[i].src.original || photos[i].src.medium;
        await download(url, path.join(dir, `${i}.jpg`));
      }
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      console.log(`FAIL  ${species}: ${e.message}`);
    }
  }
  console.log('\nDone. Candidates in public/fish/_candidates/<species>/');
}

main().catch(e => { console.error(e); process.exit(1); });
