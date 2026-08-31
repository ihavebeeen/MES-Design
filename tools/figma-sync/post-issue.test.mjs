import test from 'node:test';
import assert from 'node:assert/strict';
import { syncIssue } from './post-issue.mjs';

const request = { fileKey: 'MES', requestId: 'abc', status: 'pending-review', affected: [1], unlinkedAssets: [] };
const existing = (state = 'open', id = 'abc') => ({ number: 7, state, user: { login: 'github-actions[bot]' }, body: `<!-- mes-figma-sync:MES -->\n<!-- request-id:${id} -->` });
function apiMock(items = []) {
  const calls = [];
  return { calls, api: async (method, path, body) => { calls.push({ method, path, body }); return method === 'GET' ? items : { number: 8 }; } };
}

test('first request creates an Issue', async () => {
  const mock = apiMock();
  assert.equal((await syncIssue({ request, markdown: 'request', ...mock })).action, 'created');
  assert.equal(mock.calls[1].method, 'POST');
});
test('same request never edits an existing issue or posts duplicate comments', async () => {
  const mock = apiMock([existing()]);
  assert.equal((await syncIssue({ request, markdown: 'new timestamp', ...mock })).action, 'unchanged');
  assert.equal(mock.calls.length, 1);
});
test('new request updates the existing bot issue', async () => {
  const mock = apiMock([existing('open', 'previous')]);
  assert.equal((await syncIssue({ request, markdown: 'updated', ...mock })).action, 'updated');
  assert.equal(mock.calls[1].path, '/issues/7');
});
test('a user-closed identical request is not reopened', async () => {
  const mock = apiMock([existing('closed')]);
  assert.equal((await syncIssue({ request, markdown: 'same', ...mock })).action, 'unchanged');
  assert.equal(mock.calls.length, 1);
});
test('human-written markers cannot hijack a bot request', async () => {
  const mock = apiMock([{ ...existing(), user: { login: 'person' } }]);
  assert.equal((await syncIssue({ request, markdown: 'request', ...mock })).action, 'created');
});
test('no pending changes does not create empty issues', async () => {
  const mock = apiMock();
  assert.equal((await syncIssue({ request: { ...request, status: 'no-changes' }, markdown: '', ...mock })).action, 'no-request');
});
test('API delivery errors propagate and are not marked successful', async () => {
  await assert.rejects(syncIssue({ request, markdown: '', api: async () => { throw new Error('403'); } }), /403/);
});
test('issue lookup paginates instead of duplicating an older request', async () => {
  const calls = [];
  const api = async (method, path) => { calls.push(path); assert.equal(method, 'GET'); return path.endsWith('page=1') ? Array.from({ length: 100 }, (_, i) => ({ number: i })) : [existing()]; };
  assert.equal((await syncIssue({ request, markdown: '', api })).action, 'unchanged');
  assert.equal(calls.length, 2);
});
