// Download idol portraits from Wikipedia using the pageimages API.
//
// Usage:
//   node scripts/download-idols.js          (skip files that already exist)
//   node scripts/download-idols.js --force  (re-download everything)

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "public", "idols");
const FORCE = process.argv.includes("--force");
const MIN_BYTES = 5000;
const THUMB_WIDTH = 500;

// (target filename root, Wikipedia article title or [primary, ...fallbacks])
const IDOLS = [
  // ── BTS ─────────────────────────────────────
  ["rm", "RM_(rapper)"],
  ["jin", "Jin_(singer)"],
  ["suga", "Suga_(rapper)"],
  ["jhope", "J-Hope"],
  ["jimin", "Jimin_(entertainer)"],
  ["v", "V_(singer)"],
  ["jungkook", "Jungkook"],
  // ── BLACKPINK ───────────────────────────────
  ["jisoo", "Jisoo"],
  ["jennie", "Jennie_(singer)"],
  ["rose", "Rosé_(singer)"],
  ["lisa", "Lisa_(rapper)"],
  // ── aespa ───────────────────────────────────
  ["karina", "Karina_(singer)"],
  ["giselle", "Giselle_(singer)"],
  ["winter", "Winter_(singer)"],
  ["ningning", "Ningning"],
  // ── NewJeans ────────────────────────────────
  ["minji", "Minji_(singer)"],
  ["hanni", "Hanni_(singer)"],
  ["danielle", "Danielle_(singer)"],
  ["haerin", "Haerin"],
  ["hyein", "Hyein"],
  // ── IVE ─────────────────────────────────────
  ["yujin", "Ahn_Yu-jin"],
  ["gaeul", ["Gaeul", "Gaeul_(singer)", "Kim_Gae-ul"]],
  ["rei", "Rei_(singer)"],
  ["liz", ["Liz_(IVE)", "Kim_Ji-won_(singer)", "Liz_(singer)"]],
  ["leeseo", ["Leeseo", "Lee_Seo_(singer)"]],
  ["wonyoung", "Jang_Won-young"],
  // ── Stray Kids ──────────────────────────────
  ["bangchan", "Bang_Chan"],
  ["leeknow", "Lee_Know"],
  ["changbin", "Seo_Chang-bin"],
  ["hyunjin", ["Hwang_Hyun-jin", "Hyunjin_(Stray_Kids)", "Hyunjin"]],
  ["han", "Han_(rapper)"],
  ["felix", "Felix_(rapper)"],
  ["seungmin", ["Seungmin", "Kim_Seung-min_(singer)"]],
  ["in", "Yang_Jeong-in"],
  // ── TWICE ───────────────────────────────────
  ["nayeon", "Nayeon"],
  ["jeongyeon", "Jeongyeon"],
  ["momo", ["Hirai_Momo", "Momo_(singer)"]],
  ["sana", "Sana_(singer)"],
  ["jihyo", "Jihyo"],
  ["mina", ["Myoui_Mina", "Mina_(singer)"]],
  // "Kim_Da-hyun" goes to a different person — TWICE Dahyun's article is at "Dahyun".
  ["dahyun", ["Dahyun", "Kim_Da-hyun"]],
  ["chaeyoung", "Son_Chae-young"],
  ["tzuyu", "Tzuyu"],
  // ── ENHYPEN ─────────────────────────────────
  ["heeseung", "Heeseung"],
  // ENHYPEN's Jay (Park Jongseong) has no individual Wikipedia article — falls back to gradient.
  // ["jay", ...],
  ["jake", ["Jake_Sim", "Jake_(singer)"]],
  ["sunghoon", "Park_Sung-hoon_(singer)"],
  ["sunoo", ["Sunoo", "Kim_Sun-woo_(singer)"]],
  ["jungwon", "Yang_Jung-won"],
  ["niki", "Ni-ki"],
  // ── Red Velvet ──────────────────────────────
  ["irene", "Irene_(singer)"],
  ["seulgi", "Seulgi"],
  ["wendy", "Wendy_(singer)"],
  ["joy", "Joy_(singer)"],
  ["yeri", ["Kim_Ye-rim_(singer,_born_1999)", "Yeri_(singer)", "Yeri"]],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchJsonOnce(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        { headers: { "User-Agent": "Mozilla/5.0 (compatible; nolza-bias-downloader/1.0)" } },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            const err = new Error(`HTTP ${res.statusCode}`);
            err.status = res.statusCode;
            reject(err);
            return;
          }
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (c) => (data += c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on("error", reject);
  });
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await fetchJsonOnce(url);
    } catch (e) {
      if (e.status === 429 && attempt < 3) {
        await sleep(3000 * (attempt + 1));
        continue;
      }
      throw e;
    }
  }
}

function fetchBufferOnce(url) {
  return new Promise((resolve, reject) => {
    const tryUrl = (u, redirects = 0) => {
      https
        .get(
          u,
          { headers: { "User-Agent": "Mozilla/5.0 (compatible; nolza-bias-downloader/1.0)" } },
          (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              if (redirects > 5) {
                reject(new Error("too many redirects"));
                return;
              }
              res.resume();
              tryUrl(new URL(res.headers.location, u).toString(), redirects + 1);
              return;
            }
            if (res.statusCode !== 200) {
              res.resume();
              const err = new Error(`HTTP ${res.statusCode}`);
              err.status = res.statusCode;
              reject(err);
              return;
            }
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => resolve(Buffer.concat(chunks)));
          },
        )
        .on("error", reject);
    };
    tryUrl(url);
  });
}

async function fetchBuffer(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await fetchBufferOnce(url);
    } catch (e) {
      if (e.status === 429 && attempt < 3) {
        await sleep(3000 * (attempt + 1));
        continue;
      }
      throw e;
    }
  }
}

function sniffExtension(buf) {
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "png";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "jpg";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

function existingFile(name) {
  for (const ext of ["jpg", "png", "webp", "jpeg"]) {
    const p = path.join(OUT_DIR, `${name}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function lookup(wikiTitle) {
  const apiUrl =
    "https://en.wikipedia.org/w/api.php?" +
    [
      "action=query",
      "format=json",
      "prop=pageimages",
      `pithumbsize=${THUMB_WIDTH}`,
      "redirects=1",
      `titles=${encodeURIComponent(wikiTitle)}`,
    ].join("&");
  const data = await fetchJson(apiUrl);
  const pages = data?.query?.pages || {};
  for (const k of Object.keys(pages)) {
    const p = pages[k];
    if (p.thumbnail?.source) {
      return { source: p.thumbnail.source, file: p.pageimage || null };
    }
  }
  return null;
}

async function downloadOne(name, wikiTitle) {
  const existing = existingFile(name);
  if (existing && !FORCE) {
    return { name, status: "skip", path: existing, note: "already exists" };
  }
  const titles = Array.isArray(wikiTitle) ? wikiTitle : [wikiTitle];
  let info = null;
  let lastErr = null;
  let triedTitle = titles[0];
  for (const title of titles) {
    triedTitle = title;
    try {
      info = await lookup(title);
      if (info) break;
    } catch (e) {
      lastErr = e;
    }
    // Brief pause between fallback attempts so we don't burn the rate limit on one idol.
    if (titles.length > 1) await sleep(800);
  }
  if (!info) {
    if (lastErr) return { name, status: "fail", note: `API error: ${lastErr.message}` };
    return { name, status: "fail", note: `no thumbnail (tried ${titles.length} title${titles.length === 1 ? "" : "s"})` };
  }
  // Remember which title actually worked, for the final report.
  info.usedTitle = triedTitle;
  let buf;
  try {
    buf = await fetchBuffer(info.source);
  } catch (e) {
    return { name, status: "fail", note: `download error: ${e.message}` };
  }
  if (buf.length < MIN_BYTES) {
    return { name, status: "fail", note: `too small (${buf.length} B)` };
  }
  const ext = sniffExtension(buf) || "jpg";
  // Remove any prior copy with a different extension so we don't have stale duplicates.
  if (existing && path.basename(existing) !== `${name}.${ext}`) {
    try {
      fs.unlinkSync(existing);
    } catch {
      /* ignore */
    }
  }
  const outPath = path.join(OUT_DIR, `${name}.${ext}`);
  fs.writeFileSync(outPath, buf);
  return {
    name,
    status: "ok",
    path: outPath,
    bytes: buf.length,
    source: info.source,
    file: info.file,
  };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];
  for (const [name, wikiTitle] of IDOLS) {
    const titleLabel = Array.isArray(wikiTitle) ? wikiTitle[0] + "*" : wikiTitle;
    process.stdout.write(`${name.padEnd(12)} ${titleLabel.padEnd(30)} ... `);
    const r = await downloadOne(name, wikiTitle);
    results.push(r);
    if (r.status === "ok") {
      console.log(`OK (${(r.bytes / 1024).toFixed(0)} KB)`);
    } else if (r.status === "skip") {
      console.log(`skip (${path.basename(r.path)})`);
    } else {
      console.log(`FAIL — ${r.note}`);
    }
    // Throttle to avoid Wikipedia 429s — only delay when we actually hit the network.
    if (r.status !== "skip") await sleep(1500);
  }
  const ok = results.filter((r) => r.status === "ok");
  const skip = results.filter((r) => r.status === "skip");
  const fail = results.filter((r) => r.status === "fail");
  console.log(
    `\nSummary: ${ok.length} downloaded, ${skip.length} skipped, ${fail.length} failed (${IDOLS.length} total)`,
  );
  if (fail.length) {
    console.log("\nFailures:");
    for (const r of fail) console.log(`  ${r.name.padEnd(12)} ${r.note}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
