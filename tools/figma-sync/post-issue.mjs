import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function syncIssue({ request, markdown, api }) {
  const marker = `<!-- mes-figma-sync:${request.fileKey} -->`;
  const digest = `<!-- request-id:${request.requestId} -->`;
  const matches = [];
  for (let page = 1; ; page++) {
    if (page > 100) throw new Error('Issue 검색 상한 초과. 중복 방지를 위해 생성을 중단합니다.');
    const items = await api('GET', `/issues?state=all&per_page=100&page=${page}`);
    matches.push(...items.filter(i => !i.pull_request && i.user?.login === 'github-actions[bot]' && i.body?.includes(marker)));
    if (items.length < 100) break;
  }
  const open = matches.find(i => i.state === 'open');
  if (open?.body.includes(digest) || (!open && matches.some(i => i.body.includes(digest)))) return { action: 'unchanged', number: open?.number ?? null };
  if (!open && request.status === 'no-changes') return { action: 'no-request' };
  const suffix = '\n\n전체 변경 근거는 이 실행의 figma-sync-request 아티팩트(request.json/request.md)를 확인하세요.';
  const body = `${marker}\n${digest}\n${markdown.slice(0, 59000)}${markdown.length > 59000 ? '\n(요약 길이 제한: 전체 목록은 아티팩트)' : ''}${suffix}`;
  const title = request.status === 'no-changes' ? '[Figma] 현재 기준 대기 변경 없음 — 검토 기록 확인' : `[Figma 수정 요청] 연결 자산 ${request.affected.length}개 · 미연결 ${request.unlinkedAssets.length}개`;
  if (open) {
    await api('PATCH', `/issues/${open.number}`, { title, body });
    return { action: 'updated', number: open.number };
  }
  const created = await api('POST', '/issues', { title, body });
  return { action: 'created', number: created.number };
}

async function main() {
  if (process.env.GITHUB_ACTIONS !== 'true' || !process.env.GITHUB_TOKEN) throw new Error('GitHub Actions의 저장소 토큰이 필요합니다.');
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const request = JSON.parse(readFileSync(resolve(root, 'component-library/.figma-sync/request.json'), 'utf8'));
  const markdown = readFileSync(resolve(root, 'component-library/.figma-sync/request.md'), 'utf8');
  const repository = process.env.GITHUB_REPOSITORY;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || request.repositoryUrl !== `https://github.com/${repository}`) throw new Error('요청의 저장소와 실행 저장소가 다릅니다.');
  const api = async (method, path, body) => {
    const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
      method, signal: AbortSignal.timeout(30000),
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}. Actions의 issues:write 권한과 Issues 활성화를 확인하세요. 요청 아티팩트는 보존됩니다.`);
    return response.json();
  };
  console.log(JSON.stringify(await syncIssue({ request, markdown, api })));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
