import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main as generate } from './request.mjs';

export function chooseTarget({ local, remote, isAncestor }) {
  if (!local && !remote) throw new Error('main 브랜치를 찾을 수 없습니다.');
  if (!remote || local === remote) return local;
  if (!local || isAncestor(local, remote)) return remote;
  if (isAncestor(remote, local)) return local;
  throw new Error('local main과 origin/main이 갈라졌습니다. 자동 병합하지 않습니다. 감지 기준을 확인하세요.');
}

export function watch({ repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..'), fetchRemote = true } = {}) {
  const git = args => execFileSync('git', ['-c', `safe.directory=${repo.replaceAll('\\', '/')}`, '-C', repo, ...args], { encoding: 'utf8', windowsHide: true, timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  let remoteFresh = false, warning = null;
  if (fetchRemote) {
    try { git(['fetch', '--no-tags', 'origin', 'main']); remoteFresh = true; }
    catch { warning = 'GitHub 최신 조회 실패. 현재 로컬 main과 저장된 origin/main까지만 검사했습니다.'; }
  }
  const get = ref => { try { return git(['rev-parse', '--verify', ref + '^{commit}']); } catch { return null; } };
  const target = chooseTarget({ local: get('refs/heads/main'), remote: get('refs/remotes/origin/main'), isAncestor: (a, b) => {
    try { git(['merge-base', '--is-ancestor', a, b]); return true; } catch { return false; }
  } });
  return { ...generate(['--repo', repo, '--target', target]), remoteFresh, warning };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some(a => a !== '--no-fetch')) throw new Error('지원 옵션: --no-fetch');
    console.log(JSON.stringify(watch({ fetchRemote: !process.argv.includes('--no-fetch') })));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
