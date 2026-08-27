import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = "3217";
const baseUrl = `http://127.0.0.1:${port}`;
const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", port], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try { if ((await fetch(`${baseUrl}/tools/password-generator`)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Timed out waiting for the production server.");
}

function render(path) {
  const profile = mkdtempSync(join(tmpdir(), "devbite-browser-"));
  try {
    return execFileSync(chrome, [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=2500",
      "--dump-dom",
      `${baseUrl}${path}`,
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } finally { rmSync(profile, { recursive: true, force: true }); }
}

try {
  await waitForServer();
  const security = render("/tools/password-generator");
  if (!security.includes("Generated passwords") || !security.includes("Processed locally")) {
    throw new Error("Security browser smoke test did not render the interactive password workspace.");
  }
  const data = render("/tools/csv-viewer");
  if (!data.includes("Search table") || !data.includes("Alice") || !data.includes("Platform")) {
    throw new Error("Data browser smoke test did not render the interactive CSV grid.");
  }
  const sql = render("/tools/sql-formatter");
  if (!sql.includes("Dialect-aware scope") || !sql.includes("Process locally") || !sql.includes("SELECT u.id")) {
    throw new Error("SQL browser smoke test did not render the interactive formatter workspace.");
  }
  process.stdout.write("Phase 2 browser smoke tests passed: Security, SQL and Data.\n");
} finally {
  server.kill("SIGTERM");
}
