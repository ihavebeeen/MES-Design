import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const folder = dirname(fileURLToPath(import.meta.url));
const repo = resolve(folder, '../..');
const tests = readdirSync(folder).filter(n => n.endsWith('.test.mjs')).sort().map(n => resolve(folder, n));
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], { cwd: repo, encoding: 'utf8', windowsHide: true });
const output = (result.stdout ?? '') + (result.stderr ?? '');
const number = name => Number(new RegExp(`^# ${name} (\\d+)$`, 'm').exec(output)?.[1] ?? 0);
const sourceHashes = Object.fromEntries(readdirSync(folder).filter(n => /\.(mjs|json)$/.test(n)).sort().map(name => [name, createHash('sha256').update(readFileSync(resolve(folder, name))).digest('hex')]));
const report = { checkedAt: new Date().toISOString(), kind: 'figma-sync-tool-tests', nodeVersion: process.version,
  exitCode: result.status, tests: number('tests'), passed: number('pass'), failed: number('fail'), skipped: number('skipped'), sourceHashes,
  githubLiveDeliveryVerified: false, actualFigmaComponentSyncVerified: false };
const out = resolve(repo, 'component-library/.figma-sync');
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, 'verification.tap'), output);
writeFileSync(resolve(out, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, sourceHashes: undefined }));
if (result.status !== 0 || report.tests === 0) { console.error(output); process.exitCode = 1; }
