import test from 'node:test';
import assert from 'node:assert/strict';
import { inboxFields, makeInboxCode } from './inbox-code.mjs';
import { chooseTarget } from './watch.mjs';

const request = { fileKey: 'MES', status: 'pending-review', sourceCommit: 'b'.repeat(40), requestId: 'abc', affected: [], unlinkedAssets: [], unmappedChanges: [], reviewOnlyChanges: [] };
const fieldNames = Object.keys(inboxFields(request));
const config = { fileKey: 'MES', repositoryUrl: 'https://github.com/test/mes', inbox: { pageId: '1:1', frameId: '1:2', fieldNodeIds: Object.fromEntries(fieldNames.map((name, i) => [name, `2:${i}`])) } };

function figmaMock() {
  const page = { id: '1:1', type: 'PAGE', name: '11 코드 변경 요청' };
  const frame = { id: '1:2', type: 'FRAME', parent: page, name: 'MES Sync / 자동 요청 요약', width: 1200, height: 1000, screenshot: async () => {} };
  const nodes = fieldNames.map((key, i) => ({ id: `2:${i}`, type: 'TEXT', name: 'sync/' + key, parent: frame, characters: '', textAutoResize: 'NONE', layoutSizingVertical: 'FIXED', x: 32, y: 32 + 80 * i, width: 1136, height: 32,
    getStyledTextSegments: () => [{ fontName: { family: 'Pretendard', style: 'Regular' } }] }));
  const map = new Map([page, frame, ...nodes].map(n => [n.id, n]));
  return { fileKey: 'MES', nodes, getNodeByIdAsync: async id => map.get(id), setCurrentPageAsync: async () => {}, loadFontAsync: async () => {} };
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
test('request guidance prioritizes user edits without bypassing code approval', () => {
  const guard = inboxFields(request).guard;
  assert.match(guard, /사용자 수정본 최우선/);
  assert.match(guard, /코드 변경은 검토·승인 후 반영/);
});
test('generated Figma code only updates known request fields and is idempotent', async () => {
  const figma = figmaMock(), run = new AsyncFunction('figma', makeInboxCode(config, request));
  const first = await run(figma);
  assert.equal(first.actualComponentsModified, false);
  assert.equal(first.mutatedNodeIds.length, 8);
  assert.deepEqual((await run(figma)).mutatedNodeIds, []);
});
test('moved fields are rejected instead of editing other Figma content', async () => {
  const figma = figmaMock(); figma.nodes[0].parent = { id: 'OTHER' };
  await assert.rejects(new AsyncFunction('figma', makeInboxCode(config, request))(figma), /위치/);
  assert.ok(figma.nodes.every(n => n.characters === ''));
});
test('payload quotes stay text, not executable plugin instructions', async () => {
  const r = { ...request, unlinkedAssets: [{ name: '\";throw new Error(\"INJECTED\");//' }] };
  const figma = figmaMock();
  await new AsyncFunction('figma', makeInboxCode(config, r))(figma);
  assert.ok(figma.nodes.some(n => n.characters.includes('INJECTED')));
});
test('missing inbox IDs fail before generating a script', () => {
  assert.throws(() => makeInboxCode({ ...config, inbox: {} }, request), /누락/);
});
test('watch chooses newer main without checkout or merge; divergence is blocked', () => {
  assert.equal(chooseTarget({ local: 'local', remote: 'remote', isAncestor: a => a === 'local' }), 'remote');
  assert.equal(chooseTarget({ local: 'local', remote: 'remote', isAncestor: a => a === 'remote' }), 'local');
  assert.equal(chooseTarget({ local: 'local', remote: null }), 'local');
  assert.throws(() => chooseTarget({ local: 'local', remote: 'remote', isAncestor: () => false }), /갈라/);
});
