#!/usr/bin/env node
// Usage: npm run design:check -- [--url <base>]
// Runs the Impeccable detector over src/ and over the rendered pages at
// desktop and mobile widths. Without --url it starts `next start` on a free
// port, so run `npm run build` first. Exits 2 on findings, 1 if a scan failed.

import { spawn, spawnSync } from "node:child_process";
import net from "node:net";

const pages = ["/", "/login", "/signup", "/tokens"];
const viewports = ["1280x800", "390x844"];

const args = process.argv.slice(2);
const urlIndex = args.indexOf("--url");
let base = urlIndex === -1 ? null : args[urlIndex + 1].replace(/\/$/, "");

const env = { ...process.env, IMPECCABLE_NO_TELEMETRY: process.env.IMPECCABLE_NO_TELEMETRY ?? "1" };

function detect(targets, extra = []) {
  const flags = ["--no-advisory", ...extra];
  console.log(`\n$ impeccable detect ${[...extra, ...targets].join(" ")}`);
  const { status } = spawnSync("npx", ["impeccable", "detect", ...flags, ...targets], { stdio: "inherit", env });
  return status ?? 1;
}

function freePort() {
  return new Promise((resolve) => {
    const server = net.createServer().listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitFor(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not respond within ${timeoutMs / 1000}s.`);
}

let server = null;
if (!base) {
  const port = await freePort();
  base = `http://localhost:${port}`;
  server = spawn("npx", ["next", "start", "-p", String(port)], { stdio: "ignore", env, detached: true });
}

const statuses = [];
try {
  if (server) await waitFor(base);
  statuses.push(detect(["src"]));
  for (const viewport of viewports) {
    statuses.push(detect(pages.map((p) => base + p), ["--viewport", viewport]));
  }
} catch (error) {
  console.error(error.message);
  statuses.push(1);
} finally {
  // Kills the whole group so the next-server child doesn't outlive us.
  if (server) process.kill(-server.pid);
}

if (statuses.includes(1)) process.exitCode = 1;
else if (statuses.includes(2)) process.exitCode = 2;
else console.log("\nDesign check passed.");
