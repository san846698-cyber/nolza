const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const BASE_URL = process.env.NOLZA_CAPTURE_URL || "http://localhost:3017/tests/defense-mechanism";
const outDir = path.resolve("marketing", "defense-mechanism-short", "captures");
const edgePath =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const debugPort = Number(process.env.EDGE_DEBUG_PORT || 9333);
const ANSWER_SEQUENCE = [1, 0, 0, 1, 0, 0, 2, 2, 0, 1, 3, 0, 1, 0, 1, 2];

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
  for (let i = 0; i < 80; i += 1) {
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

async function waitFor(cdp, expression, timeout = 10000) {
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

(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  const userDataDir = path.resolve(
    "marketing",
    "defense-mechanism-short",
    `edge-profile-${Date.now()}`,
  );
  let edge;
  let cdp;
  let exitCode = 0;
  edge = spawn(edgePath, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "--mute-audio",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    cdp = connect(await waitForDebugger());
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.send("Page.navigate", { url: BASE_URL });
    await waitFor(cdp, "document.readyState === 'complete'");
    await evalJs(cdp, "localStorage.setItem('nolza_locale', 'ko'); localStorage.removeItem('nolza:test:defense-mechanism:v1'); location.reload(); true;");
    await waitFor(cdp, "document.readyState === 'complete'");
    await waitFor(cdp, "document.body && (document.body.innerText.includes('방어기제 테스트') || document.body.innerText.includes('Defense Mechanism Test'))");
    await sleep(600);
    await shot(cdp, "01_intro");

    await evalJs(cdp, "Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('테스트 시작하기') || b.textContent.includes('Start the test')).click(); true;");
    await sleep(450);
    await shot(cdp, "02_question");

    for (let i = 0; i < 3; i += 1) {
      await evalJs(cdp, `document.querySelectorAll('.answers button')[${ANSWER_SEQUENCE[i]}].click(); true;`);
      await sleep(360);
      await shot(cdp, `03_answer_${i + 1}`);
    }

    for (let i = 3; i < 16; i += 1) {
      await waitFor(cdp, "document.querySelectorAll('.answers button').length >= 4 || document.body.innerText.includes('정리하는 중')");
      const clicked = await evalJs(cdp, `(() => {
        const buttons = document.querySelectorAll('.answers button');
        if (!buttons.length) return false;
        buttons[${ANSWER_SEQUENCE[i]}].click();
        return true;
      })()`);
      if (!clicked.result.value) break;
      await sleep(250);
    }

    await sleep(180);
    await shot(cdp, "04_loading");
    await sleep(1200);
    await shot(cdp, "05_result");

    const resultTitle = await evalJs(cdp, "document.querySelector('.result-card h2')?.textContent?.trim() || ''")
      .then((res) => res.result.value)
      .catch(() => "");
    fs.writeFileSync(
      path.resolve("marketing", "defense-mechanism-short", "capture-meta.json"),
      JSON.stringify({ baseUrl: BASE_URL, resultTitle: resultTitle?.trim() || null }, null, 2),
      "utf8",
    );
  } catch (error) {
    exitCode = 1;
    throw error;
  } finally {
    if (cdp) cdp.close();
    if (edge) edge.kill();
  }

  process.exitCode = exitCode;
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
