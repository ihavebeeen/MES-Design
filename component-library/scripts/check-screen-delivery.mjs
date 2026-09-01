import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { auditScreenFile, auditScreenImplementation } from "./audit-screen-implementation.mjs";
import { generateScreenTsx } from "./generate-screen-tsx.mjs";
import { createScreenPreviewPlan, writeScreenPreview } from "./generate-screen-preview.mjs";
import { readRegistryBundle, resolveScreenRequest } from "./resolve-screen-request.mjs";
import { digest, implementationRoot } from "./screen-implementation-graph.mjs";
import { assertStaticPass, recordScreenReview, reviewPaths, verifyScreenHandoff, visualChecks } from "./screen-handoff.mjs";

const root = implementationRoot;
mkdirSync(resolve(root, "src/generated-previews"), { recursive: true });
const directory = mkdtempSync(resolve(root, "src/generated-previews/gate-regression-"));
const id = directory.split(/[\\/]/).at(-1).toLowerCase();
const request = JSON.parse(readFileSync(resolve(root, "tests/fixtures/screen-requests/deterministic-side-slide.json"), "utf8"));
request.requestId = id;
request.output.route = `/preview/${id}`;
const contract = resolveScreenRequest(request);
const original = generateScreenTsx(contract);
const sourcePath = resolve(directory, "screen.tsx");
const contractPath = resolve(directory, "contract.json");
writeFileSync(sourcePath, original);
writeFileSync(contractPath, JSON.stringify(contract));
const plan = createScreenPreviewPlan(contract, sourcePath);
const paths = reviewPaths(contract);
assert.equal(existsSync(paths.directory), false, "다른 작업의 검증 기록 보존");
assert.equal(existsSync(dirname(plan.absolutePath)), false, "다른 작업의 미리보기 보존");
const write = (value) => writeFileSync(sourcePath, value);
const json = (path, value) => writeFileSync(path, JSON.stringify(value));
let count = 0;
function check(label, run) { run(); count += 1; console.log(`[screen:delivery] ${label}`); }
const cli = (script, args) => spawnSync(process.execPath, [resolve(root, "scripts", script), ...args], { cwd: root, encoding: "utf8" });
try {
  check("정상 MES 컴포넌트와 DS 내부 원시 HTML 통과", () => assertStaticPass(auditScreenFile(contract, sourcePath)));
  check("실제 import alias 사용 통과", () => assert.equal(auditScreenImplementation(contract, original.replace("{ SideSlidePanel }", "{ SideSlidePanel as Panel }").replaceAll("<SideSlidePanel", "<Panel").replaceAll("</SideSlidePanel", "</Panel")).blockerCount, 0));
  check("실제 namespace import 사용 통과", () => assert.equal(auditScreenImplementation(contract, original.replace("{ SideSlidePanel }", "* as PanelKit").replaceAll("<SideSlidePanel", "<PanelKit.SideSlidePanel").replaceAll("</SideSlidePanel", "</PanelKit.SideSlidePanel")).blockerCount, 0));
  check("등록 파일의 존재하지 않는 export 이름 차단", () => {
    const source = original.replace('import { Button } from "@/components/ui/button";', 'import { Button } from "@/components/ui/input";');
    assert.ok(auditScreenImplementation(contract, source).findings.some((f) => f.code === "component.invalid-export"));
  });
  check("이름/주석/미사용 import는 셸 사용 근거 아님", () => {
    const source = original.slice(0, original.indexOf("export interface")) + `\n// SideSlidePanel\nexport const Fake = () => <div>자체 시안</div>`;
    assert.ok(auditScreenImplementation(contract, source).findings.some((f) => f.code === "shell.missing"));
  });
  check("동일 이름의 로컬 대체 컴포넌트 차단", () => {
    const source = original.replace('import { SideSlidePanel } from "@/components/ui/side-slide-panel";', "const SideSlidePanel = (props: any) => <div>{props.children}</div>;");
    assert.ok(auditScreenImplementation(contract, source).findings.some((f) => f.code === "shell.missing"));
  });
  check("shadow된 import 차단", () => {
    const source = original.replace("return (\n    <SideSlidePanel", "const SideSlidePanel = (props: any) => <div>{props.children}</div>;\n  return (\n    <SideSlidePanel");
    assert.notEqual(source, original);
    assert.ok(auditScreenImplementation(contract, source).findings.some((f) => f.code === "shell.missing"));
  });
  check("HTML/CSS 대체·원시 날짜·버튼 차단", () => {
    write('export const Fake = () => <html><style>{".box{color:red}"}</style><body><button>저장</button><input type="date" /></body></html>');
    assert.throws(() => writeScreenPreview(plan), /최종 구현 검사/);
    assert.equal(existsSync(plan.absolutePath), false);
  });
  check("검사 실행 실패는 실패 결과로 기록", () => {
    write(original + '\nimport Missing from "./missing-file";');
    assert.throws(() => writeScreenPreview(plan), /import를 확인/);
    assert.equal(JSON.parse(readFileSync(paths.audit)).status, "error");
  });
  check("하위 로컬 파일의 원시 컨트롤 차단", () => {
    writeFileSync(resolve(directory, "helper.tsx"), 'export const Helper = () => <button>대체</button>;');
    write(original + '\nimport {Helper} from "./helper"; export const Extra = () => <Helper />;');
    assert.ok(auditScreenFile(contract, sourcePath).findings.some((f) => f.code === "native.button"));
  });
  check("자체 CSS 및 inline style 우회 차단", () => {
    writeFileSync(resolve(directory, "fake.css"), ".fake { color: red; }");
    write(original + '\nimport "./fake.css";');
    assert.ok(auditScreenFile(contract, sourcePath).findings.some((f) => f.code === "style.external-css"));
    assert.ok(auditScreenImplementation(contract, original + '\nconst Fake = () => <div style={{color:"red"}}/>;').findings.some((f) => f.code === "style.inline"));
  });
  check("구문 오류·동적 HTML 주입 차단", () => {
    assert.ok(auditScreenImplementation(contract, original + '\nconst x = <div').blockerCount > 0);
    assert.ok(auditScreenImplementation(contract, original + '\nconst x = React.createElement("input");').findings.some((f) => f.code === "source.dynamic-render"));
  });
  check("전체 페이지 공통 메뉴·탭 누락 차단", () => {
    const req = JSON.parse(readFileSync(resolve(root, "tests/fixtures/screen-requests/deterministic-entity-list.json")));
    const c = resolveScreenRequest(req);
    assert.ok(auditScreenImplementation(c, generateScreenTsx(c).replace("<PageTopTabItem", "<div")).findings.some((f) => f.code === "shell.page-chrome"));
  });
  check("실제 Button asChild=false API 및 단일 링크 조합 통과", () => {
    for (const jsx of ['<Button asChild={false}>저장</Button>', '<Button asChild><a href="/items">품목</a></Button>']) {
      const result = auditScreenImplementation(contract, original + `\nconst Supported = () => ${jsx};`);
      assert.equal(result.blockerCount, 0, JSON.stringify(result.findings));
    }
  });
  check("가짜/미지원 asChild·동적 자식·원시 컨트롤 위장 차단", () => {
    for (const jsx of ['<Input asChild={false}/>', '<Button asChild><input /></Button>', '<Button asChild><div role="button">가짜</div></Button>', '<Button asChild={enabled}><a href="/">링크</a></Button>', '<Button asChild><a href="javascript:alert(1)">링크</a></Button>']) {
      assert.ok(auditScreenImplementation(contract, original + `\nconst Unsupported = () => ${jsx};`).findings.some((f) => f.code === "source.render-override"));
    }
  });
  check("배치용 style·실제 MES 토큰·비상호작용 접근성 속성 통과", () => {
    const result = auditScreenImplementation(contract, original + '\nconst Layout = () => <div role="region" aria-label="입력" tabIndex={-1} style={{display:"flex", minWidth:0, width:"100%", color:"var(--mes-gray-130)"}}/>;');
    assert.equal(result.blockerCount, 0, JSON.stringify(result.findings));
  });
  check("미등록 토큰·동적 style·원시 역할/이벤트 위장 차단", () => {
    for (const jsx of ['<div style={{color:"var(--not-mes)"}}/>', '<div style={unknown}/>', '<div style={{fontSize:"99px"}}/>', '<div role="button" onClick={() => save()}/>', '<div tabIndex={0}/>']) {
      assert.ok(auditScreenImplementation(contract, original + `\nconst Fake = () => ${jsx};`).blockerCount > 0);
    }
  });
  check("페이지 패턴별 요구와 별도로 공통 메뉴·탭 누락 차단", () => {
    const req = JSON.parse(readFileSync(resolve(root, "tests/fixtures/screen-requests/deterministic-entity-list.json")));
    const c = resolveScreenRequest(req);
    const registry = readRegistryBundle();
    // A content pattern cannot waive the shared MES desktop frame.
    for (const p of registry.patterns.filter((p) => c.composition.selectedPatternRefs.includes(p.id) && p.placement === "page")) {
      p.requiredComponents = p.requiredComponents.filter((id) => !["sidebar", "page-top-tab-item"].includes(id));
    }
    const source = generateScreenTsx(c).replace("<PageTopTabItem", "<div").replace("<Sidebar", "<div");
    assert.ok(auditScreenImplementation(c, source, registry).findings.some((f) => f.code === "shell.page-chrome"));
    assert.ok(auditScreenImplementation(c, source, readRegistryBundle()).findings.some((f) => f.code === "shell.page-chrome"));
  });
  write(original);
  check("배경 없는 팝업 자체는 실제 파일 검사·미리보기·범위 한정 전달 가능", () => {
    const req = structuredClone(request);
    delete req.hostPage;
    const c = resolveScreenRequest(req);
    assert.equal(auditScreenImplementation(c, original).blockerCount, 0);
    assertStaticPass(auditScreenFile(c, sourcePath));
    const surface = createScreenPreviewPlan(c, sourcePath);
    assert.equal(surface.verification.scope, "surface");
    writeScreenPreview(surface);
    assert.throws(() => verifyScreenHandoff(surface), /시각 대조 결과/);
    // Synthetic reviewer record tests scope enforcement, not actual visual QA.
    recordScreenReview(surface, { reviewer: "scope-regression-only", rendered: true, interactions: true });
    const result = verifyScreenHandoff(surface);
    assert.equal(result.verification.parentIntegration, "out-of-scope");
    assert.match(result.limitation, /저장 연동은 확인하지 않았습니다/);
    const surfaceContractPath = resolve(directory, "surface-contract.json");
    json(surfaceContractPath, c);
    const delivery = cli("screen-handoff.mjs", [surfaceContractPath, sourcePath]);
    assert.equal(delivery.status, 0, delivery.stderr);
    assert.equal(JSON.parse(delivery.stdout).verification.scope, "surface");
    write(original + '\nconst Bad = () => <input type="date"/>;');
    assert.throws(() => writeScreenPreview(surface), /최종 구현 검사/);
    write(original); writeScreenPreview(surface);
    assert.throws(() => recordScreenReview(surface, { reviewer: "scope-regression-only", rendered: true, interactions: true, unchecked: ["수량 입력 미확인"] }), /미확인 항목/);
    rmSync(surface.absolutePath);
    rmSync(paths.visual);
  });
  check("연동을 요청했을 때만 배경 누락 차단, 잘못된 범위도 차단", () => {
    const req = { ...request, verificationScope: "connected-flow" };
    delete req.hostPage;
    const c = resolveScreenRequest(req);
    assert.ok(c.quality.issues.some(f => f.code === "request.verification-scope"));
    assert.ok(auditScreenFile(c, sourcePath).blockerCount > 0);
    assert.throws(() => createScreenPreviewPlan(c, sourcePath), /hostPage/);
    assert.ok(resolveScreenRequest({ ...request, verificationScope: "skip" }).quality.issues.some(f => f.code === "request.verification-scope"));
  });
  check("팝업 자체 확인 기록은 연동 확인으로 재사용 불가", () => {
    const surface = createScreenPreviewPlan(resolveScreenRequest({ ...request, verificationScope: "surface" }), sourcePath);
    writeScreenPreview(surface);
    recordScreenReview(surface, { reviewer: "scope-regression-only", rendered: true, interactions: true });
    const saved = readFileSync(paths.visual, "utf8");
    rmSync(surface.absolutePath);
    writeScreenPreview(plan);
    assert.equal(readFileSync(paths.visual, "utf8"), saved);
    assert.throws(() => verifyScreenHandoff(plan), /현재 미리보기|확인 범위/);
    rmSync(paths.visual);
  });
  check("배경 경로/알 수 없는 옵션/페이지 중첩은 요청 단계에서 차단", () => {
    for (const host of [{ ...request.hostPage, sourcePath: "../outside.tsx" }, { ...request.hostPage, skipCheck: true }, { ...request.hostPage, saveBehavior: "invent" }]) {
      assert.ok(resolveScreenRequest({ ...request, hostPage: host }).quality.issues.some(f => f.code === "request.host-page"));
    }
    const req = JSON.parse(readFileSync(resolve(root, "tests/fixtures/screen-requests/deterministic-entity-list.json")));
    assert.ok(resolveScreenRequest({ ...req, hostPage: request.hostPage }).quality.issues.some(f => f.code === "request.host-page"));
  });
  check("엔티티 목록 연결 팝업은 진입 동작과 액션 예외 근거를 계약에서 확정", () => {
    const entityRequest = { ...request, hostPage: { ...request.hostPage, pagePatternRef: "section.page-query-table" } };
    assert.ok(resolveScreenRequest(entityRequest).quality.issues.some((f) => f.code === "request.host-entry-behavior"));
    assert.ok(resolveScreenRequest({ ...entityRequest, hostPage: { ...entityRequest.hostPage, entryBehavior: "explicit-action" } }).quality.issues.some((f) => f.code === "request.host-entry-evidence"));
    const resolved = resolveScreenRequest({ ...entityRequest, hostPage: { ...entityRequest.hostPage, entryBehavior: "row-double-click" } });
    assert.equal(resolved.quality.issues.some((f) => f.code.startsWith("request.host-entry")), false);
    assert.equal(resolved.implementation.hostPagePatternContract.patternId, "section.page-query-table");
    assert.ok(resolved.implementation.hostPagePatternContract.implementationMarkers.includes("EntityListPattern"));
  });
  check("팝업 단독 검수는 선택한 배경 패턴의 진입 동작을 요구하지 않는다", () => {
    const entityRequest = { ...request, verificationScope: "surface", hostPage: { ...request.hostPage, pagePatternRef: "section.page-query-table" } };
    const resolved = resolveScreenRequest(entityRequest);
    assert.equal(resolved.quality.issues.some((f) => f.code.startsWith("request.host-entry")), false);
  });
  check("미등록 배경 패턴은 구현 전에 차단한다", () => {
    const unresolved = resolveScreenRequest({ ...request, hostPage: { ...request.hostPage, pagePatternRef: "section.unknown" } });
    assert.ok(unresolved.quality.issues.some((f) => f.code === "request.host-page-pattern"));
  });
  check("배경의 가짜 메뉴/탭·누락 export와 코드 변경 검사", () => {
    const host = readFileSync(resolve(root, request.hostPage.sourcePath), "utf8");
    const hostPath = resolve(directory, "host.tsx");
    const c = resolveScreenRequest({ ...request, hostPage: { ...request.hostPage, sourcePath: `src/generated-previews/${id}/host.tsx` } });
    writeFileSync(hostPath, host);
    const before = auditScreenFile(c, sourcePath);
    assert.equal(before.blockerCount, 0, JSON.stringify(before.findings));
    writeFileSync(hostPath, host.replace("생성 흐름 검증용 페이지", "변경된 배경"));
    const after = auditScreenFile(c, sourcePath);
    assert.notEqual(before.fingerprint, after.fingerprint);
    assert.notEqual(before.renderFingerprint, after.renderFingerprint);
    writeFileSync(hostPath, host.replace("<Sidebar ", "<div ").replace("<PageTopTabItem ", "<div "));
    assert.ok(auditScreenFile(c, sourcePath).findings.some(f => f.code === "host.page-chrome"));
    writeFileSync(hostPath, host.replace("export function ApplicationHostFixture", "function ApplicationHostFixture"));
    assert.ok(auditScreenFile(c, sourcePath).findings.some(f => f.code === "host.entry-export"));
    writeFileSync(hostPath, 'export const ApplicationHostFixture = () => <input type="date"/>;');
    assert.ok(auditScreenFile(c, sourcePath).findings.some(f => f.code === "native.input"));
  });
  check("검사 결과 없으면 전달 차단", () => {
    rmSync(paths.audit);
    assert.throws(() => verifyScreenHandoff(plan), /검사 결과가 없습니다/);
  });
  check("검사 도중 파일 읽기 오류 시 과거 통과 무효", () => {
    writeScreenPreview(plan);
    rmSync(sourcePath);
    assert.throws(() => writeScreenPreview(plan));
    assert.equal(JSON.parse(readFileSync(paths.audit)).status, "error");
    write(original);
    assert.throws(() => verifyScreenHandoff(plan), /누락\/오류\/차단/);
  });
  writeScreenPreview(plan);
  check("정적 통과만으로 시각 미확인 전달 금지", () => assert.throws(() => verifyScreenHandoff(plan), /전달 차단/));

  // Synthetic evidence exercises the gate schema, NOT an actual screen visual pass.
  const artifactPath = resolve(paths.directory, "synthetic-test-capture.png");
  writeFileSync(artifactPath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64"));
  const artifact = { path: artifactPath, sha256: digest(readFileSync(artifactPath)) };
  const receipt = JSON.parse(readFileSync(paths.audit));
  const visual = { schemaVersion: 1, implementationFingerprint: receipt.fingerprint, previewFingerprint: receipt.previewFingerprint,
    reviewer: "regression-schema-fixture-only", comparedAt: new Date().toISOString(), viewport: { width: 1440, height: 900 },
    baseline: { kind: "approved-mes", reference: "synthetic-test-only", artifacts: [artifact] }, renderedArtifacts: [artifact],
    checks: Object.fromEntries(visualChecks.map((name) => [name, { status: "passed", note: "synthetic gate test" }])), warningResolutions: [], unchecked: [] };
  json(paths.visual, visual);
  check("검사+현재 코드+시각 기록의 연결 형식 통과 (실제 시각 QA 아님)", () => assert.equal(verifyScreenHandoff(plan).status, "handoff-ready"));
  check("실패를 제약으로 기록해도 차단", () => {
    json(paths.visual, { ...visual, checks: { ...visual.checks, spacing: { status: "failed", note: "prototype" } } });
    assert.throws(() => verifyScreenHandoff(plan), /spacing 미검증\/실패/);
    json(paths.visual, visual);
  });
  check("코드 변경 시 이전 통과 재사용 차단", () => {
    write(original + "\n// changed");
    assert.throws(() => verifyScreenHandoff(plan), /변경됐습니다/);
    write(original);
  });
  check("다른 출력 파일에 이전 통과 재사용 차단", () => {
    const copy = resolve(directory, "copy.tsx"); writeFileSync(copy, original);
    assert.throws(() => verifyScreenHandoff(createScreenPreviewPlan(contract, copy)), /변경됐습니다/);
  });
  check("하위 파일 변경 시 이전 통과 재사용 차단", () => {
    const helper = resolve(directory, "dependency.ts");
    writeFileSync(helper, "export const value = 1;");
    write(original + '\nimport {value} from "./dependency";');
    writeScreenPreview(plan);
    const updated = JSON.parse(readFileSync(paths.audit));
    json(paths.visual, { ...visual, implementationFingerprint: updated.fingerprint, comparedAt: new Date().toISOString() });
    assert.equal(verifyScreenHandoff(plan).status, "handoff-ready");
    writeFileSync(helper, "export const value = 2;");
    assert.throws(() => verifyScreenHandoff(plan), /변경됐습니다/);
    write(original); json(paths.audit, receipt); json(paths.visual, visual);
  });
  check("별도 미리보기 wrapper 및 변조 계획 차단", () => {
    assert.throws(() => writeScreenPreview({ ...plan, source: '<input type="date" />' }), /계획이 변경/);
    writeFileSync(plan.absolutePath, plan.source + "\n// changed wrapper");
    assert.throws(() => verifyScreenHandoff(plan), /wrapper/);
    writeFileSync(plan.absolutePath, plan.source);
  });
  check("Next 암묵적 layout에 숨긴 원시 컨트롤 차단", () => {
    const layout = resolve(dirname(plan.absolutePath), "layout.tsx");
    writeFileSync(layout, 'export default function Layout({children}: any) { return <><input type="date"/>{children}</>; }');
    assert.throws(() => verifyScreenHandoff(plan), /최종 구현 검사/);
    rmSync(layout);
  });
  check("시각 캡처 변경 시 차단", () => {
    writeFileSync(artifactPath, "changed");
    assert.throws(() => verifyScreenHandoff(plan), /캡처 누락\/변경/);
  });
  const observation = { reviewer: "synthetic-regression-only", rendered: true, interactions: true };
  check("신규 UI는 캡처·7개 서술 없이 짧은 실제 확인 형식으로 통과", () => {
    const recorded = recordScreenReview(plan, observation);
    assert.equal(recorded.schemaVersion, 2);
    assert.deepEqual(recorded.captures, []);
    assert.equal(recorded.note, "");
    assert.equal(recorded.checks, undefined);
    assert.equal(verifyScreenHandoff(plan).status, "handoff-ready");
  });
  check("같은 코드 재검사는 과거 시각 확인을 변경 없이 재사용", () => {
    const saved = JSON.parse(readFileSync(paths.visual));
    saved.comparedAt = new Date(Date.now() - 60000).toISOString();
    json(paths.visual, saved);
    const before = readFileSync(paths.visual, "utf8");
    writeScreenPreview(plan);
    assert.equal(verifyScreenHandoff(plan).status, "handoff-ready");
    assert.equal(readFileSync(paths.visual, "utf8"), before);
  });
  check("검사 결과 갱신과 렌더링 변경을 구분", () => {
    const before = readFileSync(paths.visual, "utf8");
    const staleAudit = JSON.parse(readFileSync(paths.audit));
    json(paths.audit, { ...staleAudit, fingerprint: "old-checker-fingerprint" });
    assert.throws(() => verifyScreenHandoff(plan), /재검사/);
    writeScreenPreview(plan);
    assert.equal(verifyScreenHandoff(plan).status, "handoff-ready");
    assert.equal(readFileSync(paths.visual, "utf8"), before);
  });
  check("짧은 확인도 실패/미확인은 차단하고 이전 성공 무효화", () => {
    assert.throws(() => recordScreenReview(plan, { ...observation, interactions: false }), /미확인\/실패/);
    assert.throws(() => verifyScreenHandoff(plan), /미확인\/실패/);
    assert.throws(() => recordScreenReview(plan, { ...observation, unchecked: ["날짜 입력 미확인"] }), /미확인 항목/);
    assert.throws(() => recordScreenReview(plan, { ...observation, captures: ["does-not-exist.png"] }));
    assert.throws(() => verifyScreenHandoff(plan), /전달 차단/);
    recordScreenReview(plan, observation);
  });
  check("코드 변경 후 정적 재검사만으로 이전 시각 확인 재사용 불가", () => {
    write(original + "\n// new render source");
    writeScreenPreview(plan);
    assert.throws(() => verifyScreenHandoff(plan), /영향을 받은 부분/);
    recordScreenReview(plan, observation);
    assert.equal(verifyScreenHandoff(plan).status, "handoff-ready");
    write(original); writeScreenPreview(plan); recordScreenReview(plan, observation);
  });
  check("원본 재현은 원본 대조 필요, 별도 캡처 복사는 불필요", () => {
    const reproduction = resolveScreenRequest({ ...request, intent: "reproduce" });
    const reproductionPlan = createScreenPreviewPlan(reproduction, sourcePath);
    writeScreenPreview(reproductionPlan);
    assert.throws(() => recordScreenReview(reproductionPlan, observation), /원본 대조/);
    recordScreenReview(reproductionPlan, { ...observation, sourceCompared: true });
    assert.equal(verifyScreenHandoff(reproductionPlan).status, "handoff-ready");
    writeScreenPreview(plan); recordScreenReview(plan, observation);
  });
  check("CLI가 짧은 확인을 자동 기록하고 재전달에서 재사용", () => {
    assert.equal(cli("screen-handoff.mjs", [contractPath, sourcePath, "--reviewed"]).status, 0);
    const before = readFileSync(paths.visual, "utf8");
    assert.equal(cli("screen-handoff.mjs", [contractPath, sourcePath]).status, 0);
    assert.equal(readFileSync(paths.visual, "utf8"), before);
    assert.notEqual(cli("screen-handoff.mjs", [contractPath, sourcePath, "--unknown"]).status, 0);
  });
  check("다른 CLI 진입점도 HTML 및 검사 실패 차단", () => {
    const html = resolve(directory, "standalone.html"); writeFileSync(html, '<button>자체 UI</button>');
    assert.notEqual(cli("generate-screen-preview.mjs", [contractPath, html]).status, 0);
    assert.notEqual(cli("audit-screen-implementation.mjs", [contractPath, html]).status, 0);
    assert.notEqual(cli("screen-handoff.mjs", [contractPath, html]).status, 0);
    write('<input type="date" />');
    assert.notEqual(cli("generate-screen-preview.mjs", [contractPath, sourcePath]).status, 0);
    assert.notEqual(cli("screen-handoff.mjs", [contractPath, sourcePath]).status, 0);
  });
  check("외부 출력/다른 route 미리보기 차단", () => {
    assert.throws(() => createScreenPreviewPlan(contract, resolve(root, "../outside.tsx")), /안에 있어야/);
    assert.throws(() => createScreenPreviewPlan({ ...contract, request: { ...contract.request, output: { ...contract.request.output, route: "/other" } } }, sourcePath), /route/);
  });
  check("심볼릭 링크를 통한 외부 출력 경로 차단", () => {
    const link = resolve(directory, "outside-link");
    symlinkSync(resolve(root, ".."), link, "junction");
    try { assert.throws(() => createScreenPreviewPlan(contract, resolve(link, "screen.tsx")), /심볼릭 링크/); }
    finally { unlinkSync(link); }
  });
  check("생성 CLI의 별도 출력 옵션도 최종 검사 우회 불가", () => {
    const req = JSON.parse(readFileSync(resolve(root, "tests/fixtures/screen-requests/deterministic-entity-list.json")));
    req.generation.pageTitle = '<input type="date" />';
    const unsafeContract = resolve(directory, "unsafe-contract.json");
    json(unsafeContract, resolveScreenRequest(req));
    const alternateOutput = resolve(directory, "alternate.tsx");
    const result = cli("generate-screen-tsx.mjs", [unsafeContract, "--out", alternateOutput]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /검사 차단/);
    assert.equal(existsSync(alternateOutput), false);
  });
  console.log(`[screen:delivery] ${count}개 통과. 시각 판정의 진실성/직접 실행 서버는 이 테스트의 강제 범위 밖입니다.`);
} finally {
  // These exact paths are owned by this run (mkdtemp + matching request id).
  for (const [target, parent] of [[directory, "src/generated-previews"], [dirname(plan.absolutePath), "src/app/preview"], [paths.directory, ".mes-ui-preview"]]) {
    assert.ok(resolve(target).replaceAll("\\", "/").startsWith(`${resolve(root, parent).replaceAll("\\", "/")}/`), "cleanup 대상이 테스트 작업 영역을 벗어났습니다.");
  }
  rmSync(directory, { recursive: true, force: true });
  if (existsSync(dirname(plan.absolutePath))) rmSync(dirname(plan.absolutePath), { recursive: true });
  if (existsSync(paths.directory)) rmSync(paths.directory, { recursive: true });
}
