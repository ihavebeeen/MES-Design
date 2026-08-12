# AI 기반 MES 화면 생성 아키텍처

> 상태: 제안 확정, 기반 레지스트리와 검증 일부 구현
> 작성일: 2026-08-07
> 운영 원칙 보완: 2026-08-11
> 대상 저장소: `MES-Design/component-library`
> Figma 원본: `F4n5Zr04PAbiRjfIFQAo6v` (`클라우드MES`)
> 기준 화면설계서 노드: `8247:18600` (`웹 화면설계서 (최종)`)

AI의 Shell·Section·Behavior·ActionSet 조합 단위와 승인 절차는 [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)을 우선 적용한다. 이 문서의 Archetype은 현재 Registry에서 화면 단위 **Recipe**의 호환 명칭이며, 재사용의 최소 단위는 아니다. 화면 레지스트리의 복수 `patternRefs` 이관은 완료됐다.

## 1. 결정

이 프로젝트의 최종 목적은 디자인 시스템 컴포넌트를 전시하는 데 있지 않다.
Figma와 코드로 확정된 MES 디자인 언어를 AI가 조합하여, 새로운 MES 화면을 빠르고 일관되게 생성하는 체계를 만든다.

이를 위해 디자인 시스템을 사람용 설명서가 아니라 다음 다섯 가지 실행 가능한 자산으로 확장한다.

1. **Component Registry**: 컴포넌트의 API, 능력, 상태, 제약, Figma 근거를 구조화한다.
2. **Pattern Grammar Registry**: shell, content, behavior 단위의 반복 구성과 사용 조건을 구조화한다.
3. **ScreenSpec DSL**: 사용자 요구사항과 React 코드 사이의 타입 안전한 중간 표현을 정의한다.
4. **Pattern Decision**: 기존 패턴의 재사용·조합·확장·신규 제안·정규화 판단과 근거를 기록한다.
5. **Validation Pipeline**: 생성 결과가 디자인 시스템과 승인된 조합 문법을 준수하는지 자동 검증한다.

최종 산출물은 JSON 런타임 렌더러가 아니라 일반적인 React/Next.js 페이지 코드다.
ScreenSpec은 생성 과정의 중간 언어 및 추적 가능한 설계 기록으로만 사용한다.

## 2. 목표와 비목표

### 2.1 목표

- 짧은 업무 요구사항으로 새로운 MES 화면을 생성한다.
- 생성 화면은 기존 토큰, 컴포넌트, 패턴을 우선 재사용한다.
- Figma 근거와 AI 판단값을 기계적으로 구분한다.
- 화면의 기본 상태뿐 아니라 로딩, 빈 상태, 오류, 선택, 편집, 권한 상태를 포함한다.
- 생성 이후 TypeScript, 린트, 빌드, 구조 규칙 및 시각 결과를 검증한다.
- 생성된 코드는 사람이 직접 유지보수할 수 있어야 한다.
- 동일 요구사항은 가능한 한 동일한 화면 구조와 컴포넌트 조합으로 수렴해야 한다.

### 2.2 비목표

- Figma 전체 파일을 매 작업마다 AI 컨텍스트에 주입하지 않는다.
- 모든 화면을 하나의 범용 JSON 렌더러로 실행하지 않는다.
- Figma 근거가 없는 값을 기존 화면과 비슷하다는 이유만으로 확정하지 않는다.
- 기존 컴포넌트로 표현 가능한 UI를 화면 내부에서 다시 구현하지 않는다.
- 초기 단계부터 모든 MES 화면 유형을 한 번에 자동화하지 않는다.

## 3. Source of Truth 우선순위

충돌이 발생하면 다음 순서로 판단한다.

1. **대상 화면의 구체적인 Figma 노드 및 Description**
2. **Figma 컴포넌트 정의 노드와 변수 정의**
3. **검증 완료된 코드 컴포넌트와 Golden Example**
4. **Component/Archetype Registry의 제약 조건**
5. **프로젝트 문서에 기록된 규칙**
6. **AI의 판단값**

AI 판단값은 최하위 근거다. 판단값을 사용한 경우 반드시 `decision` 레코드로 남긴다.

```ts
type DesignDecision = {
  id: string;
  scope: "screen" | "pattern" | "component" | "token";
  property: string;
  value: unknown;
  reason: string;
  evidence: "figma" | "code" | "document" | "ai-inference";
  figmaNodeId?: string;
  expiresWhen?: string;
};
```

## 4. 전체 파이프라인

```text
User Intent
  -> Requirement Normalizer
  -> ScreenSpec
  -> Schema Validator
  -> Archetype Resolver
  -> Component Resolver
  -> React Code Generator
  -> Static Validation
  -> Runtime/Visual Validation
  -> Generated Screen + Validation Report
```

### 4.1 Requirement Normalizer

자연어 요구사항을 바로 JSX로 변환하지 않는다. 먼저 아래 정보를 ScreenSpec 후보로 정규화한다.

- 화면 목적과 업무 엔티티
- 화면 유형
- 검색 조건
- 데이터 표현 방식
- 사용자 액션
- 선택 및 편집 규칙
- 팝업/패널 전환
- 로딩/빈 상태/오류/권한 상태
- Figma 기준 노드
- 미확정 요구사항

### 4.2 Resolver

Resolver는 ScreenSpec과 Registry를 입력받아 사용할 Archetype과 Component를 결정한다.

- 가장 가까운 기존 Archetype을 먼저 선택한다.
- Registry에 등록되지 않은 컴포넌트는 자동 선택하지 않는다.
- Registry의 `constraints`와 ScreenSpec이 충돌하면 생성에 실패해야 한다.
- 화면과 패턴을 1:1로 고정하지 않고 shell, content, behavior 패턴을 조합한다.
- 기존 조합으로 표현할 수 없는 요구사항은 바로 구현하지 않고 조합 판정 게이트로 보낸다.

### 4.3 조합 판정 게이트

등록된 컴포넌트를 사용했다는 사실만으로 디자인 시스템 준수로 판정하지 않는다. AI는 코드를 만들기 전에 조합 근거를 다음 형태로 제출해야 한다.

```ts
type PatternDecision = {
  screenId: string;
  selectedPatterns: {
    shell: string[];
    content: string[];
    behavior: string[];
  };
  existingCandidates: string[];
  delta: {
    intent: string;
    informationHierarchy: string;
    interaction: string;
    stateTransition: string;
    visualOnly: boolean;
  };
  decision: "reuse" | "compose" | "extend" | "propose-new" | "normalize";
  evidence: string[];
  confidence: number;
  approval: "automatic" | "required" | "approved" | "rejected";
};
```

판정 기준:

1. 목적과 상태 전이가 같고 필드·크기만 다르면 `extend`로 처리한다.
2. 기존 패턴 여러 개로 설명할 수 있으면 `compose`로 처리한다.
3. 기존 패턴이 선언한 적용 범위인데 표현하지 못하면 기존 패턴의 불완전성으로 보고 확장하거나 더 작은 문법으로 분해한다.
4. 사용자 행동, 상태 전이 또는 정보 위계가 본질적으로 다를 때만 `propose-new`를 허용한다.
5. 특정 화면의 시각적 차이에 업무·상태 근거가 없으면 `normalize`하며 신규 패턴으로 만들지 않는다.

AI는 후보와 근거를 제안할 수 있지만 신규 패턴이나 기존 패턴의 의미 변경을 스스로 승인하지 않는다. 초기 운영에서는 사용자가 최종 승인한다. 승인 사례가 충분히 쌓인 뒤에도 기존 검증 패턴의 동일한 재사용만 자동 승인하고, 구조적 확장은 사람 검토를 유지한다.

`propose-new` 또는 미승인 `extend` 결과는 생성 시안 검토함에 격리하며 `patterns.json`과 `screens.json`의 다음 생성 근거로 사용할 수 없다.

### 4.4 Code Generator

Generator는 최종적으로 평범한 React/Next.js 코드를 만든다.

- 생성 결과는 ScreenSpec 없이도 실행 가능해야 한다.
- 컴포넌트 import 경로는 Registry에서 가져온다.
- 스타일 값은 디자인 토큰 또는 명시적 Figma 근거를 사용한다.
- 화면별 업무 로직과 범용 UI 컴포넌트를 분리한다.
- Mock data, loading, empty, error 상태를 개발 단계에서 확인 가능하게 만든다.

## 5. Component Registry

단순 파일 목록이 아니라 AI가 선택 결정을 내릴 수 있는 계약이어야 한다.

```ts
type ComponentRegistryEntry = {
  id: string;
  name: string;
  importPath: string;
  exportName: string;
  category:
    | "action"
    | "input"
    | "data-display"
    | "feedback"
    | "overlay"
    | "navigation"
    | "layout";
  status: "verified" | "provisional" | "deprecated";
  capabilities: string[];
  variants: Record<string, readonly string[]>;
  requiredStates: string[];
  slots?: string[];
  constraints: Record<string, unknown>;
  useWhen: string[];
  doNotUseWhen: string[];
  figma: {
    fileKey: string;
    definitionNodeIds: string[];
    verifiedInstanceNodeIds?: string[];
  };
  examples: {
    id: string;
    sourcePath: string;
    description: string;
  }[];
};
```

예시:

```ts
defineComponent({
  id: "table",
  name: "Table",
  importPath: "@/components/ui/table",
  exportName: "Table",
  category: "data-display",
  status: "verified",
  capabilities: [
    "single-selection",
    "multi-selection",
    "editable-cell",
    "empty-state",
    "fixed-header",
  ],
  variants: {
    density: ["compact", "default"],
    selection: ["none", "single", "multi"],
  },
  requiredStates: ["default", "loading", "empty", "error"],
  constraints: {
    selectionColumnPosition: "left",
    sharedColumnGrid: true,
  },
  useWhen: ["entity-list", "master-detail", "editable-grid"],
  doNotUseWhen: ["short-key-value-summary"],
  figma: {
    fileKey: "F4n5Zr04PAbiRjfIFQAo6v",
    definitionNodeIds: [],
  },
  examples: [],
});
```

## 6. MES Archetype Registry

Archetype은 레이아웃 템플릿이 아니라 화면 구조, 상호작용, 상태 전이를 포함한 업무 UI 계약이다.

초기 Archetype은 다음 여섯 종류로 제한한다.

| ID | 용도 | 대표 구조 |
|---|---|---|
| `entity-list` | 거래처, 품목, 창고 등 기준정보 조회 | 검색/그룹 필터 + 테이블 + 하단 액션 |
| `list-with-editor` | 목록과 등록/수정 작업 | 목록 + CenterModal 또는 SideSlidePanel |
| `master-detail` | 품목별 설비 등 종속 데이터 편집 | 좌측 Master + 우측 Detail + 선택 연동 |
| `form-editor` | 단일 엔티티 등록/상세 편집 | 섹션형 Form + 저장/취소 |
| `dashboard` | 생산, 품질, 설비 현황 | 조건 영역 + KPI + Chart/Table |
| `workflow` | 작업지시, 검사, 승인 | 단계/상태 + 업무 액션 + 이력 |

```ts
type ArchetypeRegistryEntry = {
  id: string;
  version: number;
  intentTags: string[];
  requiredRegions: string[];
  optionalRegions: string[];
  allowedComponents: string[];
  requiredStates: string[];
  behaviorRules: string[];
  referenceScreens: {
    id: string;
    figmaNodeId: string;
    sourcePath?: string;
  }[];
};
```

첫 번째 Golden Example은 아래 화면을 사용한다.

- 화면: 거래처 등록 리스트
- Archetype: `entity-list`
- Figma node: `10590:25574`
- 원본 크기: `1920 x 960`

## 7. ScreenSpec DSL

ScreenSpec은 AI가 생성해야 하는 첫 번째 산출물이다. JSX 생성은 ScreenSpec 검증 성공 이후에만 수행한다.

```ts
type ScreenSpec = {
  schemaVersion: 1;
  id: string;
  title: string;
  route: string;
  domain: string;
  entity: string;
  archetype: string;
  shell: "mes-desktop-v2";
  viewport: {
    width: number;
    height: number;
  };
  query?: QuerySpec;
  content: ContentSpec;
  actions: ActionSpec[];
  overlays?: OverlaySpec[];
  states: ScreenStateSpec[];
  permissions?: PermissionSpec[];
  dataContract?: DataContractSpec;
  evidence: EvidenceSpec[];
  decisions: DesignDecision[];
};
```

예시:

```ts
export default defineScreen({
  schemaVersion: 1,
  id: "settings.partner.list",
  title: "거래처 리스트",
  route: "/settings/partners",
  domain: "settings",
  entity: "partner",
  archetype: "entity-list",
  shell: "mes-desktop-v2",
  viewport: { width: 1920, height: 960 },
  query: {
    dateRange: { enabled: true, label: "조회기준일자" },
    grouping: ["level1", "level2", "level3"],
    keyword: { enabled: true },
  },
  content: {
    type: "table",
    selection: "multi",
    columns: [
      { key: "code", label: "거래처코드", dataType: "text" },
      { key: "name", label: "거래처", dataType: "text" },
      { key: "salesOwner", label: "영업담당", dataType: "text" },
    ],
  },
  actions: [
    { id: "search", placement: "query", priority: "primary" },
    { id: "create", placement: "bottom-right", priority: "primary" },
    { id: "delete", placement: "bottom-right", priority: "secondary" },
  ],
  states: [
    { id: "loading" },
    { id: "empty" },
    { id: "error" },
    { id: "row-selected" },
  ],
  evidence: [
    {
      type: "figma-screen",
      fileKey: "F4n5Zr04PAbiRjfIFQAo6v",
      nodeId: "10590:25574",
    },
  ],
  decisions: [],
});
```

## 8. AI 실행 규칙

다음 규칙은 권고가 아니라 생성기의 강제 규칙이다.

1. AI는 화면 코드를 작성하기 전에 **MUST** ScreenSpec을 생성한다.
2. ScreenSpec은 코드 생성 전에 스키마 검증을 **MUST** 통과한다.
3. AI는 Registry에 등록된 컴포넌트를 **MUST** 우선 사용한다.
4. 등록된 컴포넌트를 사용했다는 이유만으로 디자인 시스템 준수라고 보고하면 **MUST NOT** 된다.
5. AI는 같은 화면 내부에서 기존 컴포넌트와 중복되는 UI를 **MUST NOT** 재구현한다.
6. AI는 shell, content, behavior 패턴 후보를 조회하고 PatternDecision을 **MUST** 생성한다.
7. AI는 화면과 패턴을 1:1로 가정하면 **MUST NOT** 된다.
8. 미등록 조합, 신규 wrapper 또는 정보 위계 변경은 승인 전 표준 패턴에 반영하면 **MUST NOT** 된다.
9. Figma 화면을 구현할 때 대상 화면의 구체적인 node ID를 **MUST** 기록한다.
10. 비슷한 컴포넌트의 값을 다른 컴포넌트에 추론 적용하면 **MUST NOT** 된다.
11. Figma에서 확인하지 못한 값은 `evidence: "ai-inference"`인 decision으로 **MUST** 기록한다.
12. 모든 데이터 화면은 `loading`, `empty`, `error` 상태를 **MUST** 제공한다.
13. 선택 및 편집이 있는 화면은 선택 전/후와 저장 성공/실패 상태를 **MUST** 정의한다.
14. 생성 후 TypeScript와 production build를 **MUST** 실행한다.
15. 시각 검증을 수행하지 못한 경우 검증 완료라고 **MUST NOT** 보고한다.

## 9. 제안 디렉터리 구조

아래 구조는 아직 구현되지 않은 목표 구조다.

```text
component-library/
  src/
    mes-system/
      registry/
        components.ts
        tokens.ts
        archetypes.ts
      schema/
        screen.ts
        query.ts
        content.ts
        action.ts
        state.ts
      archetypes/
        entity-list.ts
        list-with-editor.ts
        master-detail.ts
        form-editor.ts
        dashboard.ts
        workflow.ts
      specs/
        settings.partner.list.ts
      generator/
        resolve-archetype.ts
        resolve-components.ts
        generate-page.ts
      validation/
        validate-spec.ts
        validate-registry.ts
        validate-generated-screen.ts
  docs/
    ai/
      figma-node-index.json
      golden-examples.json
      generation-report.schema.json
```

## 10. Figma 인덱싱 전략

Figma 전체 캔버스를 매번 읽지 않는다. 파일을 다음 단위로 인덱싱한다.

- `component`: 재사용 가능한 컴포넌트 정의
- `screen`: 실행 가능한 화면 프레임
- `state`: 동일 화면의 상태 변형
- `overlay`: 모달, 패널, 팝오버
- `annotation`: Description 및 업무 규칙

```ts
type FigmaIndexEntry = {
  id: string;
  kind: "component" | "screen" | "state" | "overlay" | "annotation";
  fileKey: string;
  nodeId: string;
  name: string;
  archetype?: string;
  relatedNodeIds?: string[];
  codeRefs?: string[];
  tags: string[];
  verifiedAt: string;
};
```

AI는 작업에 필요한 node만 조회한다. 전체 파일 메타데이터는 탐색용으로만 사용하고 구현 근거로 사용하지 않는다.

## 11. 검증 계약

### 11.1 정적 검증

- ScreenSpec schema validation
- Component/Archetype Registry reference validation
- TypeScript `noEmit`
- ESLint
- Next.js production build
- 금지된 raw color, 임의 spacing, 임의 radius 탐지
- 화면 내부 중복 컴포넌트 탐지
- `npm run check:patterns`: pattern에서 raw `button/input/select/table`, 직접 `lucide-react`, 기존 컴포넌트의 재구현 이름을 금지
- ScreenSpec이 참조한 shell, content, behavior 패턴과 실제 코드 구조의 일치 검사
- 등록 컴포넌트만 사용했더라도 미승인 wrapper·배치·상태 조합이 있으면 실패하는 조합 문법 검사
- `propose-new`와 미승인 `extend`가 표준 Registry에 유입되지 않는 격리 검사

### 11.2 동작 검증

- 검색 실행
- 선택 전/후 상태
- 단일/다중 선택 규칙
- 입력 활성화/비활성화
- 저장, 취소, 삭제
- 모달 및 패널 열기/닫기
- loading/empty/error 상태
- 권한별 action 노출

### 11.3 시각 검증

- 기준 viewport로 로컬 화면을 캡처한다.
- Figma 기준 화면과 전체 레이아웃을 비교한다.
- 고정 영역, overflow, table column grid를 별도로 확인한다.
- 차이가 있는 경우 `layout`, `token`, `component`, `content`, `state`로 분류한다.
- 비교 도구가 없거나 화면을 직접 보지 못한 경우 `visual: not-verified`로 기록한다.

```ts
type GenerationReport = {
  screenId: string;
  specValidation: "passed" | "failed";
  typecheck: "passed" | "failed" | "not-run";
  lint: "passed" | "failed" | "not-run";
  build: "passed" | "failed" | "not-run";
  visual: "passed" | "failed" | "not-verified";
  decisions: DesignDecision[];
  deviations: {
    category: "layout" | "token" | "component" | "content" | "state";
    description: string;
  }[];
};
```

## 12. 구현 단계

### Phase 0. 기준선 정리

- 문서의 미해결 merge marker 제거
- 현재 lint 오류 분류 및 정리
- 기존 컴포넌트와 패턴의 실제 개수 확정
- 전시용 코드와 재사용 UI 코드의 경계 확인

완료 조건:

- TypeScript, lint, build가 모두 통과한다.
- Registry 생성을 시작할 신뢰 가능한 파일 목록이 존재한다.

### Phase 1. Registry 구축

- 현재 UI 컴포넌트를 Registry에 등록한다.
- `verified`와 `provisional`을 구분한다.
- Figma 정의 node와 코드 파일을 연결한다.
- 각 컴포넌트의 capability와 constraint를 작성한다.

완료 조건:

- AI가 파일 검색 없이 Registry만으로 컴포넌트를 선택할 수 있다.
- Registry 참조 무결성 검사가 통과한다.

### Phase 2. Archetype 및 Golden Example

- `entity-list`, `list-with-editor`, `master-detail`부터 구현한다.
- 거래처 리스트를 첫 번째 `entity-list` Golden Example로 등록한다.
- 기존 패턴 3개를 가장 가까운 Archetype에 연결한다.

완료 조건:

- 기존 화면을 ScreenSpec으로 손실 없이 표현할 수 있다.
- 동일 ScreenSpec에서 반복 생성한 구조가 안정적으로 수렴한다.

### Phase 3. ScreenSpec 및 Generator

- TypeScript/Zod 기반 ScreenSpec schema를 구현한다.
- Resolver와 코드 생성기를 구현한다.
- 생성 결과에 validation report를 포함한다.

완료 조건:

- 유효하지 않은 spec은 코드 생성 전에 실패한다.
- 생성 페이지가 기존 디자인 시스템 컴포넌트만 사용한다.
- 생성 페이지가 TypeScript 및 build 검사를 통과한다.

### Phase 4. 신규 화면 실증

- Figma에 없는 신규 MES 요구사항 하나를 선택한다.
- 자연어 요구사항에서 ScreenSpec을 생성한다.
- 기존 Archetype과 Component Registry만으로 화면을 생성한다.
- 디자인 및 업무 규칙 적합성을 검토한다.

완료 조건:

- 신규 화면이 기존 MES와 시각적·구조적으로 일관된다.
- 임의 판단값이 모두 추적 가능하다.
- 수정 요청이 ScreenSpec 변경으로 재현 가능하다.

### Phase 5. 확장

- `form-editor`, `dashboard`, `workflow` Archetype을 추가한다.
- 모바일/태블릿은 별도의 shell과 viewport 계약으로 확장한다.
- 반복 생성 결과를 기반으로 Registry와 규칙을 버전 관리한다.

## 13. 첫 번째 파일럿

### 기준 화면

- 이름: 거래처 리스트
- Figma node: `10590:25574`
- viewport: `1920 x 960`
- Archetype: `entity-list`

### 파일럿 목표

1. 거래처 리스트를 ScreenSpec으로 표현한다.
2. 현재 구현 컴포넌트와 Figma node를 Registry에 연결한다.
3. 동일 Spec으로 거래처 리스트 구조를 재구성한다.
4. 같은 Archetype으로 `창고 리스트` 후보 화면을 생성한다.
5. 두 화면의 공통 구조와 업무별 차이를 Registry/Spec 수준에서 설명할 수 있게 한다.

### 성공 기준

- 생성 코드에 화면 전용으로 복제한 공통 UI가 없다.
- 임의 색상, 간격, radius가 없다.
- 기본/로딩/빈 상태/오류/선택 상태가 존재한다.
- TypeScript, lint, build가 통과한다.
- 기준 viewport 스크린샷을 확인한다.
- 모든 Figma 비근거 값이 decision으로 남는다.

## 14. 향후 AGENTS.md에 반영할 최소 규칙

구현이 시작되면 아래 규칙만 요약하여 `AGENTS.md`에 추가한다.

```text
Before generating a MES screen:
1. Read the Component Registry and Archetype Registry.
2. Produce and validate a ScreenSpec.
3. Reuse registered components; do not recreate equivalent UI locally.
4. Record concrete Figma node IDs for every measured design claim.
5. Record unsupported assumptions as decisions with evidence=ai-inference.
6. Implement loading, empty, error, and interaction-specific states.
7. Run typecheck, lint, build, and visual verification.
8. Never report visual verification unless the rendered result was observed.
```

## 15. 최종 형태

완성된 시스템에서 사용자는 업무 요구사항을 제공한다.

```text
설비별 생산량 관리 화면을 만든다.
좌측은 품목 목록, 우측은 선택한 품목의 공정과 연결된 설비 목록이다.
선택한 설비의 시간당 생산량을 수정할 수 있고 전체 일괄 적용을 지원한다.
```

AI는 다음 순서로 처리한다.

1. `master-detail` Archetype 선택
2. 요구사항을 ScreenSpec으로 변환
3. Registry에서 Table, Input, Button, Modal/Panel 등 선택
4. 미확정 조건을 decision으로 분리
5. React 페이지 생성
6. 정적/동작/시각 검증
7. ScreenSpec, 코드, GenerationReport를 함께 저장

이 구조를 통해 바이브코딩의 입력 속도는 유지하면서, 결과물은 MES 디자인 시스템과 검증 규칙 안에서 일관되게 생성한다.
