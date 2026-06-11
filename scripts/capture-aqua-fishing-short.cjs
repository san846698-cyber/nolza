const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const BASE_URL = process.env.NOLZA_CAPTURE_URL || "http://127.0.0.1:3000/games/aqua-fishing";
const outDir = path.resolve("marketing", "aqua-fishing-short", "captures");
const edgePath =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const debugPort = Number(process.env.EDGE_DEBUG_PORT || 9356);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

async function waitForDebugger() {
  const url = `http://127.0.0.1:${debugPort}/json/list`;
  for (let i = 0; i < 100; i += 1) {
    try {
      const pages = await getJson(url);
      const page = Array.isArray(pages)
        ? pages.find((item) => item.type === "page" && item.webSocketDebuggerUrl)
        : null;
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Edge is still starting.
    }
    await sleep(150);
  }
  throw new Error("Timed out waiting for Edge remote debugger.");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  };

  const opened = new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  return {
    async send(method, params = {}) {
      await opened;
      const id = nextId++;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close() {
      ws.close();
    },
  };
}

async function evalJs(cdp, expression) {
  return cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
}

async function waitFor(cdp, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const result = await evalJs(cdp, expression).catch(() => null);
    if (result?.result?.value) return;
    await sleep(150);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function shot(cdp, name) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(result.data, "base64"));
}

async function aquaInput(cdp, detail) {
  await evalJs(
    cdp,
    `window.dispatchEvent(new CustomEvent('aqua-fishing:input', { detail: ${JSON.stringify(detail)} })); true;`,
  );
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  const userDataDir = path.resolve("C:\\tmp", `edge-aqua-capture-${Date.now()}`);
  let edge;
  let cdp;
  edge = spawn(edgePath, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    "--remote-allow-origins=*",
    "--disable-gpu",
    "--hide-scrollbars",
    "--mute-audio",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=540,960",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    cdp = connect(await waitForDebugger());
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 540,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url: BASE_URL });
    await waitFor(cdp, "document.readyState === 'complete'");
    await evalJs(
      cdp,
      `(() => {
        window.localStorage.setItem('nolza_locale', 'ko');
        window.localStorage.setItem('fishing_stats', JSON.stringify({
          rod: 3,
          speed: 2,
          drop: 3,
          depth: 3,
          sonar: 2,
          coins: 1280,
          caught: { yellowfin_tuna: 2, bluefin_tuna: 1, giant_grouper: 1, blue_marlin: 1 }
        }));
        location.reload();
        return true;
      })();`,
    );
    await waitFor(cdp, "document.readyState === 'complete'");
    await waitFor(cdp, "document.querySelector('canvas') && document.querySelector('canvas').width > 400");
    await sleep(1800);
    await shot(cdp, "01_game_ui");

    await aquaInput(cdp, { kind: "down", key: "space" });
    await sleep(2600);
    await shot(cdp, "02_line_drop");

    await aquaInput(cdp, { kind: "down", key: "right" });
    await sleep(900);
    await aquaInput(cdp, { kind: "up", key: "right" });
    await sleep(600);
    await shot(cdp, "03_deep_play");

    await aquaInput(cdp, { kind: "up", key: "space" });
    await sleep(900);
    await shot(cdp, "04_reel_up");

    await aquaInput(cdp, { kind: "tap", key: "shop" });
    await sleep(900);
    await shot(cdp, "05_shop");

    await aquaInput(cdp, { kind: "tap", key: "shop" });
    await sleep(400);
    await aquaInput(cdp, { kind: "tap", key: "enc" });
    await sleep(1200);
    await shot(cdp, "06_dex");

    fs.writeFileSync(
      path.resolve("marketing", "aqua-fishing-short", "capture-meta.json"),
      JSON.stringify({ baseUrl: BASE_URL, width: 540, height: 960 }, null, 2),
      "utf8",
    );
  } finally {
    if (cdp) cdp.close();
    if (edge) edge.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
