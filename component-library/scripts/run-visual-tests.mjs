import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const previewURL = new URL(baseURL);
const port = previewURL.port || (previewURL.protocol === "https:" ? "443" : "80");
const nextEntry = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const playwrightEntry = path.join(projectRoot, "node_modules", "@playwright", "test", "cli.js");
const nextLockPath = path.join(projectRoot, ".next", "dev", "lock");

if (!existsSync(nextEntry) || !existsSync(playwrightEntry)) {
  throw new Error("Next.js 또는 Playwright 실행 파일을 찾지 못했습니다. npm ci를 먼저 실행하세요.");
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function isReady() {
  try {
    const response = await fetch(`${baseURL}/visual-regression/table`, { signal: AbortSignal.timeout(2_000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitUntilReady(server) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`시각 테스트 서버가 준비 전에 종료됐습니다(${server.exitCode}).`);
    if (await isReady()) return;
    await wait(500);
  }
  throw new Error(`시각 테스트 서버가 120초 안에 준비되지 않았습니다: ${baseURL}`);
}

function readOwnedNextPid(startedAt) {
  try {
    const info = JSON.parse(readFileSync(nextLockPath, "utf8"));
    const samePort = Number(info.port) === Number(port);
    const startedByThisRun = Number(info.startedAt) >= startedAt - 1_000;
    return samePort && startedByThisRun && Number.isInteger(info.pid) ? info.pid : undefined;
  } catch {
    return undefined;
  }
}

function isProcessRunning(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function stopOwnedServer(server, nextPid) {
  const ownedPids = [...new Set([nextPid, server?.pid].filter(Boolean))];
  if (process.platform === "win32") {
    // 이 실행이 만든 명령 PID와 Next lock에 기록된 실제 서버 PID만 종료한다.
    for (const pid of ownedPids) {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        // 이미 종료된 테스트 전용 프로세스면 할 일이 없다.
      }
    }
  } else {
    if (!server?.pid) return;
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      // 이미 종료된 테스트 전용 프로세스 그룹이면 할 일이 없다.
    }
  }

  const deadline = Date.now() + 5_000;
  while (ownedPids.some(isProcessRunning) && Date.now() < deadline) await wait(100);
  for (const pid of ownedPids.filter(isProcessRunning)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // 종료 확인 사이에 사라진 프로세스다.
    }
  }
}

let ownedServer;
let ownedNextPid;
let testRunner;
let interrupted = false;

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    interrupted = true;
    testRunner?.kill(signal);
    void stopOwnedServer(ownedServer, ownedNextPid);
    process.exitCode = signal === "SIGINT" ? 130 : 143;
  });
}

function runPlaywright() {
  return new Promise((resolve, reject) => {
    testRunner = spawn(process.execPath, [playwrightEntry, "test", ...process.argv.slice(2)], {
      cwd: projectRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: baseURL,
        PLAYWRIGHT_MANAGED_SERVER: "1",
        NO_COLOR: "1",
        FORCE_COLOR: "0",
      },
    });
    testRunner.once("error", reject);
    testRunner.once("exit", (code) => resolve(code ?? 1));
  });
}

try {
  if (!(await isReady())) {
    const serverStartedAt = Date.now();
    const serverCommand = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : process.execPath;
    const serverArgs = process.platform === "win32"
      ? ["/d", "/s", "/c", "npm.cmd", "run", "dev", "--", "--hostname", previewURL.hostname, "--port", port]
      : [nextEntry, "dev", "--hostname", previewURL.hostname, "--port", port];
    ownedServer = spawn(serverCommand, serverArgs, {
      cwd: projectRoot,
      detached: true,
      stdio: "ignore",
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    });
    ownedServer.unref();
    await waitUntilReady(ownedServer);
    ownedNextPid = readOwnedNextPid(serverStartedAt);
    if (process.platform === "win32" && !ownedNextPid) {
      throw new Error("이 실행이 시작한 Next.js 서버 PID를 확인하지 못했습니다.");
    }
  } else {
    console.log(`[visual] 기존 로컬 서버를 사용합니다: ${baseURL}`);
  }

  if (!interrupted) {
    process.exitCode = await runPlaywright();
  }
} finally {
  await stopOwnedServer(ownedServer, ownedNextPid);
}
