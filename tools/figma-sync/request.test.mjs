import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, relative, resolve } from 'node:path';
import { buildRequest, main, markInboxDelivered, markNotified, recordApplied, renderRequest, saveRequest } from './request.mjs';

const P = 'component-library/';
const UI = P + 'src/components/ui/';
const ICON = P + 'src/components/icons/';
const REG = P + 'src/design-system/registry/components.json';
const ledger = () => ({ schemaVersion: 1, assets: {} });

function fixture(t) {
  const repo = mkdtempSync(resolve(tmpdir(), 'mes-figma-sync-test-'));
  const git = (...args) => execFileSync('git', ['-c', `safe.directory=${repo.replaceAll('\\', '/')}`, '-C', repo, ...args], { encoding: 'utf8', windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const write = (path, value) => { const full = resolve(repo, path); mkdirSync(dirname(full), { recursive: true }); writeFileSync(full, typeof value === 'string' ? value : JSON.stringify(value)); };
  git('init', '-b', 'main');
  const commit = () => { git('add', '.'); git('-c', 'user.name=Figma Sync Test', '-c', 'user.email=figma-sync-test@example.invalid', 'commit', '--allow-empty', '-m', 'fixture'); return git('rev-parse', 'HEAD'); };
  const components = [{ id: 'button', name: 'Button', source: 'src/components/ui/button.tsx' }, { id: 'header', name: 'Header', source: 'src/components/ui/header.tsx' }];
  write(REG, { components });
  write(UI + 'button.tsx', 'export const Button = "main32";');
  write(UI + 'header.tsx', 'import { Button } from "./button"; export const Header = Button;');
  write(ICON + 'menu.tsx', 'export const IconMenu = "menu";');
  write(P + 'src/app/globals.css', ':root { --blue: #1277ff; }');
  write(P + 'package.json', { dependencies: { react: '19' }, scripts: { build: 'next build' } });
  write('docs/rules.md', 'Keep source hierarchy.');
  const baseline = commit();
  const config = { schemaVersion: 1, fileKey: 'TestFile', repositoryUrl: 'https://github.com/test/mes', baselineCommit: baseline, registryPath: REG,
    globalFiles: [P + 'src/app/globals.css', P + 'package.json'], reviewFiles: ['docs/rules.md'], protectedRules: [{ id: 'header-28', assetIds: ['Header'], rule: '사용자28px 유지' }],
    assets: [{ id: 'Button', name: 'Button', kind: 'component', sources: [UI + 'button.tsx'], figmaNodeIds: ['1:1'] },
      { id: 'Header', name: 'Header', kind: 'component', sources: [UI + 'header.tsx'], figmaNodeIds: ['1:2'] },
      { id: 'IconMenu', name: 'IconMenu', kind: 'icon', sources: [ICON + 'menu.tsx'], figmaNodeIds: ['1:3'] }] };
  const build = applied => buildRequest({ repo, config, applied: applied ?? ledger() });
  t.after(() => {
    const rel = relative(resolve(tmpdir()), repo);
    if (rel.startsWith('..') || !basename(repo).startsWith('mes-figma-sync-test-')) throw new Error('테스트 임시 폴더 범위 검증 실패');
    rmSync(repo, { recursive: true, force: true });
  });
  return { repo, git, write, commit, config, components, build };
}

function evidence(request, ids) {
  return { fileKey: request.fileKey, requestId: request.requestId, sourceCommit: request.sourceCommit, reviewer: 'test-reviewer', verifiedAt: '2026-08-31T12:00:00Z',
    assets: ids.map(id => ({ id, figmaNodeIds: request.affected.find(a => a.id === id).figmaNodeIds, note: 'Test attestation only',
      checks: { geometry: true, paint: true, instances: true, visual: true, manualEditsReviewed: true } })) };
}

test('unchanged baseline creates no update and never claims Figma was edited', t => {
  const f = fixture(t), r = f.build();
  assert.equal(r.status, 'no-changes');
  assert.equal(r.actualFigmaUpdated, false);
  assert.equal(saveRequest(r, resolve(f.repo, '.out')).needsNotification, false);
});

test('uncommitted and untracked edits are excluded from automatic requests', t => {
  const f = fixture(t);
  f.write(UI + 'button.tsx', 'DIRTY'); f.write(UI + 'new.tsx', 'UNTRACKED');
  assert.equal(f.build().status, 'no-changes');
});

test('direct changes reach consumers and preserve manual header protection', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'export const Button = "new";'); f.commit();
  const r = f.build();
  assert.deepEqual(r.affected.map(a => [a.id, a.reason]), [['Button', 'direct-source-change'], ['Header', 'dependency-change']]);
  assert.deepEqual(r.affected[1].protectedRuleIds, ['header-28']);
  assert.match(renderRequest(r), /사용자28px 유지/);
});

test('alias imports and transitive barrel exports are traced', t => {
  const f = fixture(t);
  f.write(ICON + 'index.ts', 'export { IconMenu } from "./menu";');
  f.write(UI + 'button.tsx', 'import { IconMenu } from "@/components/icons"; export const Button = IconMenu;');
  f.config.baselineCommit = f.commit();
  f.write(ICON + 'menu.tsx', 'export const IconMenu = "scaled";'); f.commit();
  assert.equal(f.build().affected.length, 3);
});

test('public SVG changes affect importing icons', t => {
  const f = fixture(t);
  f.write(P + 'public/icons/menu.svg', '<svg>old</svg>');
  f.write(ICON + 'menu.tsx', 'export const IconMenu = <img src="/icons/menu.svg"/>;');
  f.config.baselineCommit = f.commit();
  f.write(P + 'public/icons/menu.svg', '<svg>new</svg>'); f.commit();
  assert.equal(f.build().affected[0].id, 'IconMenu');
});

test('shared CSS fans out, package script-only changes do not', t => {
  const f = fixture(t);
  f.write(P + 'package.json', { dependencies: { react: '19' }, scripts: { build: 'other build' } }); f.commit();
  assert.equal(f.build().status, 'no-changes');
  f.write(P + 'src/app/globals.css', ':root { --blue: red; }'); f.commit();
  assert.equal(f.build().affected.length, 3);
});

test('dependency version changes request a shared review', t => {
  const f = fixture(t);
  f.write(P + 'package.json', { dependencies: { react: '20' } }); f.commit();
  assert.equal(f.build().affected.length, 3);
});

test('new registered assets and unregistered sources remain explicitly unlinked', t => {
  const f = fixture(t);
  f.write(UI + 'new.tsx', 'export const New = 1;');
  f.write(REG, { components: [...f.components, { id: 'new', name: 'New', source: 'src/components/ui/new.tsx' }] }); f.commit();
  const r = f.build();
  assert.equal(r.unlinkedAssets[0].name, 'New');
  assert.equal(r.unmappedChanges[0].path, UI + 'new.tsx');
});

test('source deletion and rename request review without Figma deletion', t => {
  const f = fixture(t);
  f.git('mv', UI + 'button.tsx', UI + 'renamed.tsx'); f.commit();
  const r = f.build();
  assert.equal(r.affected.find(a => a.id === 'Button').reason, 'source-removed-review-only');
  assert.ok(r.unmappedChanges.some(c => c.path.endsWith('/renamed.tsx')));
  assert.equal(r.requiresApproval, true);
});

test('same content on a later unrelated commit keeps request fingerprint', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const first = f.build();
  f.write('README.md', 'Unrelated README'); f.commit();
  assert.equal(f.build().requestId, first.requestId);
});

test('generating does not mark notified; acknowledgement is explicit and guards races', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const r = f.build(), out = resolve(f.repo, '.out');
  assert.equal(saveRequest(r, out).needsNotification, true);
  assert.equal(saveRequest(r, out).needsNotification, true);
  assert.throws(() => markNotified(out, 'wrong'), /변경/);
  markNotified(out, r.requestId);
  assert.equal(saveRequest(r, out).needsNotification, false);
});

test('reversion produces a one-time cleared notification without claiming applied', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const r = f.build(), out = resolve(f.repo, '.out'); saveRequest(r, out); markNotified(out, r.requestId);
  f.write(UI + 'button.tsx', 'export const Button = "main32";'); f.commit();
  const reverted = f.build();
  assert.equal(reverted.status, 'no-changes');
  assert.equal(saveRequest(reverted, out).needsNotification, true);
  assert.equal(reverted.actualFigmaUpdated, false);
});

test('Figma delivery and user notification have independent retry markers', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const r = f.build(), out = resolve(f.repo, '.out'); saveRequest(r, out);
  markNotified(out, r.requestId);
  assert.equal(saveRequest(r, out).needsInboxDelivery, true);
  assert.throws(() => markInboxDelivered(out, 'stale'), /변경/);
  markInboxDelivered(out, r.requestId);
  assert.equal(saveRequest(r, out).needsInboxDelivery, false);
  assert.equal(saveRequest(r, out).needsNotification, false);
});

test('archived backup cleanup and complete screen changes do not generate new assets', t => {
  const f = fixture(t);
  f.write(UI + 'old.tsx.removed-test', 'archived'); f.write(P + 'src/app/new-screen/page.tsx', 'screen'); f.commit();
  assert.equal(f.build().status, 'no-changes');
});

test('partial verified application advances only the selected asset', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const request = f.build();
  const next = recordApplied({ repo: f.repo, config: f.config, request, evidence: evidence(request, ['Button']), ledger: ledger() });
  assert.deepEqual(f.build(next).affected.map(a => a.id), ['Header']);
  assert.deepEqual(Object.keys(next.assets), ['Button']);
});

test('missing visual/manual-edit evidence cannot mark application complete', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const request = f.build(), proof = evidence(request, ['Button']);
  proof.assets[0].checks.manualEditsReviewed = false;
  assert.throws(() => recordApplied({ repo: f.repo, config: f.config, request, evidence: proof, ledger: ledger() }), /미충족/);
});

test('wrong Figma file or missing node evidence cannot advance baseline', t => {
  const f = fixture(t); f.write(UI + 'button.tsx', 'new'); f.commit();
  const request = f.build(), proof = evidence(request, ['Button']);
  proof.fileKey = 'OtherFile';
  assert.throws(() => recordApplied({ repo: f.repo, config: f.config, request, evidence: proof, ledger: ledger() }), /일치/);
  proof.fileKey = request.fileKey; proof.assets[0].figmaNodeIds = [];
  assert.throws(() => recordApplied({ repo: f.repo, config: f.config, request, evidence: proof, ledger: ledger() }), /누락/);
});

test('review-only files have separate attestations and can clear without asset writes', t => {
  const f = fixture(t); f.write('docs/rules.md', 'Updated rule'); f.commit();
  const request = f.build();
  const proof = { ...evidence(request, []), reviewedFiles: [{ path: 'docs/rules.md', note: 'Reviewed: no Figma appearance change needed' }] };
  const next = recordApplied({ repo: f.repo, config: f.config, request, evidence: proof, ledger: ledger() });
  assert.equal(f.build(next).status, 'no-changes');
});

test('registry-only metadata edits affect their mapped source, not every asset', t => {
  const f = fixture(t); f.components[0].rules = ['New rule']; f.write(REG, { components: f.components }); f.commit();
  const r = f.build();
  assert.deepEqual(r.affected.map(a => a.id), ['Button']);
  assert.equal(r.affected[0].metadataChanged, true);
});

test('missing baseline fails closed instead of silently resetting to HEAD', t => {
  const f = fixture(t); f.config.baselineCommit = '0'.repeat(40);
  assert.throws(() => f.build());
});

test('malformed duplicate mappings are rejected', t => {
  const f = fixture(t); f.config.assets.push(f.config.assets[0]);
  assert.throws(() => f.build(), /중복/);
});

test('CLI loads portable repo mapping and denies output outside the repository', t => {
  const f = fixture(t);
  f.write('tools/figma-sync/config.json', f.config); f.write('tools/figma-sync/applied.json', ledger());
  assert.equal(main(['--repo', f.repo]).status, 'no-changes');
  assert.equal(JSON.parse(readFileSync(resolve(f.repo, 'tools/figma-sync/applied.json'))).schemaVersion, 1);
  assert.throws(() => main(['--repo', f.repo, '--out', '../escape']), /밖 경로/);
});
