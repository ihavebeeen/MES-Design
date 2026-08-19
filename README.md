# MES Design System

> 2026-08-12: 화면 단위 `patternId` 구조를 `Shell + Section + Behavior + ActionSet + Recipe`의 복수 `patternRefs` 조합 문법으로 이관했습니다. 현재 판정 결과와 검증 범위는 [AI UI 조합 문법 이관 완료](./docs/AI_UI_조합_문법_이관_완료.md)를 참고하세요.

MES 서비스의 디자인을 코드로 보존하고, 그 코드에서 일관된 UI 규칙을 추출·검증하여, 장기적으로 새로운 MES 화면을 AI로 자동 생성하기 위한 디자인 시스템 저장소입니다.

이 프로젝트의 결과물은 Figma 화면을 React로 옮긴 코드만이 아닙니다. 사람이 장기간 제작·수정한 Figma를 관찰 자료로 삼아 반복되는 토큰, 컴포넌트, 레이아웃과 업무 패턴을 찾아내고, 의도적인 예외와 단순한 불일치를 구분하여 MES의 표준 규칙을 계속 정교하게 다듬습니다. 여기서 디자인 시스템은 에셋과 개별 컴포넌트의 집합만을 뜻하지 않습니다. 컴포넌트를 어떤 맥락에서 선택하고, 어떻게 조합하며, 어떤 변형을 허용하고, 새로운 조합을 누가 어떤 근거로 승인하는지까지 포함합니다. AI는 최종적으로 원본 Figma를 직접 흉내 내거나 등록된 부품을 임의로 조립하는 것이 아니라, 검증된 조합 문법과 판단 절차 안에서 새 화면을 생성해야 합니다.

## 프로젝트가 만드는 것

이 저장소는 다음 네 가지를 함께 관리합니다.

1. **원본 증거**: Figma의 구조, 문구, 상태와 상호작용을 누락 없이 재현한 기준 화면
2. **디자인 규칙**: 색상, 간격, 크기, 타이포그래피와 상태에 대한 표준 토큰·컴포넌트 계약
3. **업무 패턴**: 목록, 테이블 편집, 중앙 팝업, 우측 슬라이드 팝업, 마스터–상세 등 반복 가능한 조합
4. **자동 생성 기반**: AI가 화면 요구사항을 규칙과 자산에 매핑하고 검증 가능한 코드로 생성하는 레지스트리와 테스트

## 핵심 원칙

1. 원본 Figma의 전체 구조, 정보 위계, 배치 컨셉, 문구, 상태와 업무 흐름은 엄격하게 보존합니다.
2. 원본 재현은 판단의 근거가 되는 증거층입니다. 먼저 있는 그대로 코드화하고, 표준화 과정에서 원본 근거를 조용히 덮어쓰지 않습니다.
3. 구현 전에 화면의 모든 요소를 조사하고 기존 토큰·컴포넌트·variant에 매핑합니다. 대응 자산이 없으면 공용 자산으로 먼저 추가·등록합니다.
4. 여러 화면에서 반복되는 값을 표준 후보로 봅니다. 특정 화면만 다른 간격·크기·색상을 사용한다면 새로운 variant로 즉시 등록하지 않고 불일치 가능성을 먼저 검토합니다.
5. 의도적인 예외가 아니라면 다수 화면과 공용 토큰에 맞춰 정규화합니다. 예를 들어 대부분의 동일 맥락에서 padding이 4px인데 한 화면만 3px이라면, 3px을 새 규칙으로 확장하기보다 UI 통일성을 해치는 이상값인지 판단합니다.
6. 관찰값, 표준값, 판단 근거와 확정 상태를 구분해 기록합니다. Figma에 있다는 사실만으로 모든 수치가 디자인 시스템의 표준이 되는 것은 아닙니다.
7. 새 화면은 원본 화면을 복사하지 않고 검증된 토큰·컴포넌트·패턴 레지스트리를 조합해 생성합니다.
8. 등록 컴포넌트를 사용했다는 사실만으로 디자인 시스템 준수로 판정하지 않습니다. 화면의 정보 위계, 배치, 상태 전이와 컴포넌트 조합도 등록된 패턴 문법 또는 승인된 판단으로 설명할 수 있어야 합니다.
9. 화면과 패턴을 1:1로 강제하지 않습니다. 하나의 화면은 shell, content, behavior 패턴을 조합할 수 있으며, 패턴 ID는 화면을 가두는 템플릿 이름이 아니라 조합 근거를 추적하는 계약입니다.
10. TypeScript, 레지스트리·재사용 검사, 패턴 조합 검사, 상호작용 검사, 시각 회귀 테스트와 빌드로 원본 충실도와 시스템 일관성을 함께 검증합니다.

## 현재 구성

| 자산 | 등록 수 |
|---|---:|
| UI 컴포넌트 | 82 |
| Shell·Section·Behavior·Recipe 패턴 | 57 |
| AI 조회용 화면 정의 | 28 |
| 격리된 Tier 3~5 실험 후보 | 9 |
| 시각 회귀 기준 케이스 | 31 |
| Playwright 시각·상호작용 테스트 | 47 |
| 정적 생성 페이지 | 117 |

대표 구현 범위:

- MES 파운데이션과 시맨틱 토큰
- Button, Input, Select, Radio, Checkbox, Filter, SearchInput, Table 등 공용 UI
- 중앙 팝업과 우측 슬라이드 팝업 패턴
- 그룹화 리스트, 마스터–상세, 분석 대시보드 패턴
- 투입품목 설정/조회, BOM 복사, 운전일지, 생산·입고 등록 등 업무 팝업
- 양식관리, 생산실적 반응형, 캐비티 배열, 재고 추가·편집, 발주 정보
- 설비별 토출량 설정, 표준단가 설정, 조 설정의 원본 상태·상호작용
- 생산분석 최신 화면과 카드 설정 상태
- 실제 업무 원본 승인 전까지 표준 생성에서 격리되는 Tier 3~5 기능 프로토타입 57종

## 원본에서 표준 규칙으로 가는 과정

Figma는 가장 중요한 입력 자료지만, 사람이 만든 모든 픽셀값을 그대로 표준으로 선언하지는 않습니다. 원본 충실도와 디자인 시스템 일관성을 다음 단계로 분리합니다.

| 단계 | 목적 | 결과 |
|---|---|---|
| 1. 원본 재현 | 화면의 구조·상태·문구와 실측값을 빠짐없이 보존 | Source Screen / Source Popup |
| 2. 규칙 추출 | 여러 화면에서 반복되는 값과 조합을 수집 | 토큰·컴포넌트·패턴 후보 |
| 3. 이상값 판별 | 단발성 값이 의도된 예외인지 제작 과정의 불일치인지 검토 | 유지 / 정규화 / 확인 필요 |
| 4. 표준 확정 | 검증된 값을 공용 API와 레지스트리 계약으로 고정 | Canonical Token / Component / Pattern |
| 5. 화면 생성 | 표준 자산만 조합하여 새 화면을 생성 | ScreenSpec 기반 React 화면 |
| 6. 회귀 검증 | 원본의 컨셉과 표준의 일관성이 모두 유지되는지 확인 | 시각·상호작용·규칙 검사 |

### 무엇을 엄격하게 따르고 무엇을 정규화하는가

엄격하게 보존하는 항목:

- 화면의 목적과 정보 구조
- 주요 영역의 배치 컨셉과 시각적 위계
- 컴포넌트의 의미와 사용자 업무 흐름
- 선택, 입력, 저장, 취소, 팝업 전환 등의 상태와 상호작용
- 반응형 화면에서 정보가 접히거나 재배치되는 원칙

반복 근거를 토대로 정규화하는 항목:

- padding, margin, gap과 같은 간격
- 버튼, 입력창, 행, 헤더의 높이와 너비 체계
- radius, border, shadow, 색상과 타이포그래피
- 동일 컴포넌트의 정렬, 아이콘 크기와 상태 표현
- 같은 성격의 팝업·테이블에서 반복되는 내부 레이아웃

이상값은 단순히 “다른 값”이라는 이유만으로 제거하지 않습니다. 동일 컴포넌트의 다른 인스턴스, 인접 화면, 토큰 스케일, 콘텐츠 밀도, 시각적 보정 필요성을 함께 확인합니다. 의도가 확인되면 예외 또는 variant로 기록하고, 근거가 없으며 다수 규칙과 충돌하면 표준값으로 정규화합니다.

```text
관찰값: padding 3px
반복 규칙: 동일 맥락 18개 화면에서 padding 4px
판단: 의도 근거 없음 + 기존 spacing token과 불일치
처리: 원본 증거에는 3px 기록, 표준 컴포넌트는 4px 사용
```

## 원본 화면 정규화

장기간 누적된 디자인에는 같은 화면의 일부 수정안과 상태 예시가 함께 존재합니다. 이를 독립 화면으로 중복 구현하지 않고 다음 기준으로 분류합니다.

- 업무 목적과 데이터 흐름이 같으면 같은 화면으로 봅니다.
- 선택 전/후, 비어 있음/데이터 있음, 입력 활성/비활성은 상태로 관리합니다.
- 1280·786·375 시안은 하나의 반응형 화면으로 관리합니다.
- 목록에서 열리는 상세·설정 화면은 상위 화면의 보조 팝업으로 연결합니다.
- 최신 수정안을 기준 화면에 반영하고 이전안은 판단 근거로 보존합니다.

정규화된 전체 화면은 문서 사이트의 `/patterns/original-mes-screen-assets/`에서 확인합니다. 중앙·우측 슬라이드·보조 팝업은 전체 화면과 섞지 않고 `/patterns/completed-popup-types/`에 위치와 본문 구조 기준으로 통합합니다. 원본 팝업은 선택 즉시 페이지 안에 렌더링되며, 실제 오버레이 동작은 보조 실행 버튼으로 별도 확인합니다.

자세한 분류 근거는 [원본 화면 정규화 기록](./docs/원본_화면_정규화_기록.md)을 참고하세요.

## 원본 화면 코드화 및 표준화 절차

```text
Figma 기준 프레임 확정
  → 레이아웃·문구·줄바꿈·상태·상호작용 전수 조사
  → 기존 Component Registry와 1:1 매핑
  → 누락 컴포넌트 또는 variant를 공용 자산으로 구현·등록
  → 등록된 컴포넌트만 사용해 원본 화면 조합
  → 기준 크기 스크린샷 대조
  → 선택·입력·필터·팝업 등 상호작용 검증
  → 다른 화면과 토큰·간격·상태 규칙 비교
  → 이상값을 유지 / 정규화 / 확인 필요로 분류
  → 표준 토큰·컴포넌트·패턴 계약 갱신
  → TypeScript·레지스트리·재사용·시각 회귀·빌드 검사
```

원본 화면 구현은 “유사한 패턴을 만드는 작업”이 아닙니다. 기준 프레임과 픽셀·문구·상태가 일치해야 하며, 화면 내부에 `Fixture` 전용 컨트롤이나 공용 컴포넌트를 우회한 HTML 컨트롤을 남기지 않습니다. 다만 원본 재현이 끝이라고 보지도 않습니다. 재현된 화면을 다른 화면과 비교하여 시스템 규칙을 추출하고, 반복 근거가 없는 미세한 차이는 표준 자산에 그대로 전파하지 않습니다. 수정안이 여러 개라면 각각의 차이가 상태인지, breakpoint인지, 최신 변경인지, 단순 불일치인지 판별합니다.

## 저장소 구조

```text
MES-Design/
├─ .agents/skills/generate-mes-ui/
├─ .cursor/rules/mes-ui.mdc
├─ .github/copilot-instructions.md
├─ AGENTS.override.md
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
├─ docs/
│  ├─ AI_MES_화면_생성_아키텍처.md
│  ├─ 디자인_판단_레지스트리_운영규칙.md
│  ├─ 디자인_값_자동감사_보고서.md
│  ├─ 디자인_시스템_레지스트리_및_시각회귀_테스트.md
│  ├─ 원본_화면_정규화_기록.md
│  └─ ...
└─ component-library/
   ├─ scripts/
   ├─ tests/visual/
   └─ src/
      ├─ app/
      ├─ components/
      │  ├─ experimental/
      │  ├─ icons/
      │  ├─ patterns/
      │  ├─ ui/
      │  └─ visual-tests/
      ├─ design-system/registry/
      └─ lib/
```

주요 위치:

- `component-library/src/app/globals.css`: 색상, 간격, radius, shadow, typography 토큰
- `component-library/src/components/ui/`: 공용 UI 컴포넌트
- `component-library/src/components/icons/`: MES 아이콘 컴포넌트
- `component-library/src/components/patterns/`: 업무 화면과 팝업 조합 패턴
- `component-library/src/components/experimental/`: 원본 근거가 아직 없는 조작 가능한 격리 프로토타입
- `component-library/src/design-system/registry/`: AI 조회용 컴포넌트·패턴·화면 레지스트리
- `component-library/src/design-system/registry/screen-request.schema.json`: 자연어를 JSX보다 먼저 고정하는 화면 요청 계약
- `component-library/src/design-system/registry/generation-templates.json`: 결정적 TSX를 지원하는 Recipe와 필수 조합 레지스트리
- `component-library/src/design-system/registry/experimental-candidates.json`: 실험 후보의 상태·제약·승격 조건 레지스트리
- `component-library/src/design-system/registry/composition-policy.json`: AI 조합 계층·판정·승인·마이그레이션 보류 공통 정책
- `component-library/src/design-system/registry/composition-inventory.json`: 현재 패턴 코드의 Shell·Section·Behavior 관찰 인벤토리
- `component-library/src/design-system/registry/composition-shell-ledger.json`: 28개 팝업 Recipe의 Shell·Body·ActionSet 관찰 장부
- `component-library/src/design-system/registry/composition-section-frame-ledger.json`: 혼합 파일 3개의 25개 Section Frame 관찰 장부
- `component-library/src/design-system/registry/composition-section-pattern-ledger.json`: P1 Section Pattern 5개 후보의 수동 판정 장부
- `component-library/src/design-system/registry/composition-behavior-ledger.json`: 선택·취소 복원·행 변경 Behavior 후보의 상태 전이 장부
- `component-library/src/design-system/registry/section-pattern-proposals.json`: Section·Frame 표준 후보와 부분 승인 상태
- `component-library/src/design-system/registry/behavior-pattern-proposals.json`: Behavior 표준 후보와 부분 승인 상태
- `component-library/src/design-system/registry/design-decisions.json`: 관찰값과 표준값의 사람 검토·판단 기록
- `component-library/src/design-system/registry/design-value-audit.json`: 코드에서 자동 수집한 값 분포와 검토 후보
- `component-library/src/design-system/registry/generated-screen-evaluations.json`: AI 생성 시안의 점수·성공/실패 사유·승격 여부
- `component-library/src/lib/sidebar-data.ts`: 문서 사이트 메뉴와 정적 경로 데이터
- `component-library/src/app/[...slug]/client-page.tsx`: 문서 사이트의 실제 콘텐츠

## 로컬 실행

```powershell
cd component-library
npm ci
npm run dev
```

개발 서버가 시작되면 다음 경로를 확인합니다.

- `/foundations/`: 디자인 토큰과 기초 규칙
- `/components/`: 개별 UI 컴포넌트와 상태
- `/generated-screens/`: 표준 화면과 격리된 AI 생성 시안 검토함
- `/experimental/experimental-decisions/`: Tier 3~5 최초 후보 57개의 승격·실험 유지·제외 판정 원장
- `/experimental/experimental-tier-3/`: 사용자 판정 후 유지된 Tier 3 기능 후보 2종
- `/experimental/experimental-tier-4/`: 사용자 판정 후 유지된 Tier 4 기능 후보 6종
- `/experimental/experimental-tier-5/`: 사용자 판정 후 유지된 Tier 5 기능 후보 1종
- `/patterns/`: MES 업무 화면과 조합 패턴
- `/patterns/original-mes-screen-assets/`: 정규화된 원본 화면 자산

## 검증 명령

```powershell
# TypeScript
npm exec tsc -- --noEmit

# 패턴의 공용 컴포넌트 재사용 + 레지스트리 무결성
npm run check:design-system

# JSON 판정 원장에서 사람이 읽는 Markdown 원장을 다시 생성
npm run audit:experimental-decisions

# 화면 요청을 레지스트리 기반 결정적 계약으로 변환
npm run screen:resolve -- tests/fixtures/screen-requests/receiving-side-panel.json

# 지원 Recipe의 계약을 동일한 TSX로 생성
npm run screen:generate -- path/to/contract.json --out path/to/implementation.tsx

# 계약과 실제 화면 구현의 원시 HTML·셸·등록 import 감사
npm run screen:audit -- path/to/contract.json path/to/implementation.tsx

# 화면 계약의 결정성 fixture 검사
npm run check:screen-contracts

# 로컬 MCP를 실제 클라이언트로 연결하여 조회·생성·감사·경로 차단 검사
npm run mcp:check

# 실험 후보 9종의 격리 정책·코드 연결 및 Tier 3~5 판정 무결성
npm run check:experimental

# 현재 코드의 디자인 값 분포와 검토 후보 갱신
npm run audit:design-values

# 패턴 코드의 Shell·Section·Behavior 관찰 인벤토리 갱신
npm run audit:composition

# 코드와 커밋된 감사 결과 사이의 drift 검사
npm run check:design-values

# 디자인 시스템 관련 코드 린트
npm run lint:design-system

# Playwright 시각 회귀 테스트
npm run test:visual

# 프로덕션 빌드
npm run build
```

Windows PowerShell 실행 정책으로 `npx`가 막히는 환경에서는 `npm exec` 또는 `npm.cmd`를 사용합니다.

## AI가 화면을 만드는 흐름

```text
Figma 원본과 기존 구현
  → 원본 화면 코드화
  → 반복 규칙·이상값 분석
  → 표준 Token / Component / Pattern 확정
  → Registry와 시각 회귀 기준 갱신

사용자 요구사항
  → 업무 목적·데이터·상태를 ScreenSpec으로 작성
  → Screen Registry 조회
  → 기존 Pattern 후보 조회
  → reuse / compose / extend / propose-new / normalize 판정
  → Pattern Decision 검증 및 필요한 경우 사람 승인
  → 필요한 Component Registry 조회
  → 승인된 조합 문법의 슬롯에 표준 컴포넌트를 배치
  → 금지된 임의 값·미등록 컴포넌트·미승인 조합 검사
  → 상호작용·일관성·시각 회귀 검증
```

AI가 임의의 JSX를 바로 생성하거나 특정 Figma 프레임을 복사하는 대신, 화면 정의에서 필요한 표준 패턴과 컴포넌트를 먼저 찾도록 구성합니다. 생성 결과에 새로운 수치, 변형 또는 조합이 필요하면 화면 안에 즉시 하드코딩하지 않고, 기존 규칙의 재사용·조합·확장으로 설명할 수 있는지 먼저 판별합니다. AI는 신규 조합을 제안할 수 있지만 스스로 정식 패턴으로 승인할 수 없으며, 승인 전 결과는 생성 시안 검토함에 격리합니다.

다른 컴퓨터와 다른 AI에서도 이 흐름을 반복할 수 있도록 저장소 전용 `.agents/skills/generate-mes-ui` Skill, 짧은 우선 지침 `AGENTS.override.md`, 로컬 STDIO MCP 서버를 함께 배포합니다. Codex는 `.codex/config.toml`, Claude Code는 `.mcp.json`을 통해 같은 `mes-ui` MCP를 실행합니다. 사용자는 clone 후 `component-library`에서 `npm ci`를 실행하고 프로젝트 MCP를 한 번 승인해야 합니다. 이후 AI는 `mes_list_design_system`, `mes_resolve_screen`, `mes_generate_screen`, `mes_audit_screen`을 공통 함수처럼 호출할 수 있습니다. 동일한 `ScreenRequest`와 동일한 커밋은 같은 registry fingerprint, pattern refs, component refs와 quality 판정을 생성합니다. `recipe.side-slide-form-editable-list`는 동일 계약에서 같은 TSX hash까지 생성합니다. 아직 지원 템플릿이 없는 Recipe의 TSX와 모든 화면의 최종 픽셀까지 같다는 보장은 없으며, 최종 시각 일치는 화면별 시각 회귀 테스트로 확인합니다.

### 패턴은 화면 템플릿이 아니라 조합 문법입니다

하나의 화면은 여러 패턴을 동시에 참조할 수 있습니다.

```text
이지모드 입고등록
  shell: 우측 슬라이드 팝업
  content: 행 단위 반복 입력
  behavior: 직전 행의 거래처만 계승
  action: 취소 시 원상복구 + 저장
```

새 요구사항은 다음 기준으로 판정합니다.

- 목적과 상태 전이는 같고 필드·크기만 다르면 기존 패턴의 variant로 확장합니다.
- 기존 패턴 여러 개로 자연스럽게 설명되면 새 패턴을 만들지 않고 조합합니다.
- 기존 패턴이 선언한 적용 범위인데 표현하지 못하면 해당 패턴의 불완전성으로 보고 확장하거나 분해합니다.
- 사용자 행동, 상태 전이 또는 정보 위계가 본질적으로 다르면 신규 패턴 후보로 제안합니다.
- 특정 원본에만 있는 시각적 차이이며 별도 의도가 없으면 신규 패턴으로 등록하지 않고 기존 규칙으로 정규화합니다.

AI는 기존 후보, 차이, 근거, 영향 범위와 권장 판정을 `PatternDecision`으로 제출합니다. 기존 조합을 그대로 재사용하는 저위험 작업은 자동 검증할 수 있지만, 신규 패턴과 기존 패턴의 의미 변경은 사용자의 승인을 받아야 합니다.

레지스트리 역할:

- `components.json`: 컴포넌트 API, 상태, 소스 위치
- `patterns.json`: 기존 공용 화면 패턴
- `PatternDecision`: 화면이 선택한 shell·content·behavior 패턴, 기존 후보와 차이, 재사용·조합·확장·신규 제안·정규화 판정
- `screens.json`: 기존 대표 화면과 상태 규칙
- `source-assets.json`: 정규화된 원본 화면, Figma node, 상태와 breakpoint 규칙
- `visual-regression.json`: 대표 시각 회귀 기준
- `design-decisions.json`: 관찰값, 표준값, 판단, 근거와 적용 범위
- `design-value-audit.json`: 코드에서 자동 수집된 사용 빈도와 단발성 값 검토 대기열
- `screen-request.schema.json`: AI가 작성하는 입력 계약
- `screen:resolve`: 등록 ID와 target 셸을 검증하고 stable fingerprint를 가진 구현 계약 생성
- `screen:generate`: 지원되는 Recipe 계약을 덮어쓰기 없이 결정적 TSX로 생성
- `screen:audit`: 구현이 계약 셸과 공용 컴포넌트를 지키는지 severity별로 검사
- `mes-ui` MCP: 위 조회·계약·생성·감사를 Codex와 Claude Code가 공통 호출하는 로컬 도구 인터페이스

장기적으로 각 판단 기록에는 다음 정보가 연결되어야 합니다.

- `observedValue`: Figma 또는 기존 화면에서 실제로 관찰한 값
- `canonicalValue`: 디자인 시스템에서 사용하기로 확정한 표준값
- `decision`: `keep`, `normalize`, `needs-review`
- `evidence`: 반복 횟수, 관련 화면·컴포넌트와 판단 근거
- `scope`: 전역 토큰, 특정 컴포넌트, 업무 패턴 또는 의도된 화면 예외

## 구현 규칙

### 기존 컴포넌트 우선

- 패턴 파일에서 HTML `button`, `input`, `select`, `table`을 직접 구성하지 않습니다.
- 기존 컴포넌트로 표현할 수 없는 요소는 신규 prop 또는 신규 컴포넌트로 구현하고 `components.json`에 등록한 뒤 화면에서 사용합니다.
- 원본 화면 구현 파일에서 `Fixture*` 컴포넌트를 사용하지 않습니다.
- 선택 상태, 행 배경, 입력 활성화와 같은 동작은 화면에 보이는 외형과 함께 구현합니다.

### Figma 근거와 표준값을 분리

- 전체 Figma URL 대신 추적에 필요한 node ID를 레지스트리에 기록합니다.
- Description에 정의된 업무 동작도 시각 정보와 동일한 구현 근거로 사용합니다.
- HUG 또는 Auto Layout만 보고 추정하지 않고 부모·자식 프레임 크기와 실제 화면 결과를 함께 비교합니다.
- 기준 프레임의 문구, 줄바꿈, 열 너비와 모달 크기도 임의로 보정하지 않고 실제 렌더링과 대조합니다.
- 원본에서 측정한 값과 디자인 시스템에서 채택한 값을 같은 필드로 덮어쓰지 않습니다.
- 미세한 차이가 발견되면 새 prop이나 arbitrary value를 추가하기 전에 기존 토큰 분포와 동일 컴포넌트의 다른 사용례를 확인합니다.
- 의도된 시각 보정은 예외의 적용 범위와 이유를 함께 기록하며, 설명할 수 없는 단발성 값은 표준 규칙으로 승격하지 않습니다.

### 상태를 화면 복제본으로 만들지 않기

- 체크 전/후 화면을 별도 컴포넌트로 만들지 않습니다.
- 모달의 empty/populated 상태를 별도 페이지로 분리하지 않습니다.
- 동일 화면의 반응형 프레임을 별도 화면 ID로 등록하지 않습니다.

### 팝업 취소 규칙

- `취소`, 우상단 `X`, `Esc`, 배경 클릭은 동일한 dismiss 경로를 사용합니다.
- dismiss 시 편집 중인 로컬 상태를 폐기하고 팝업을 닫습니다.
- 저장 전 임시 값이 상위 상태에 있다면 `onCancel`에서 원본 스냅샷으로 복원합니다.

## 문서

- [AI 기반 MES 화면 생성 아키텍처](./docs/AI_MES_화면_생성_아키텍처.md)
- [AI UI 조합 문법 공통 정책](./docs/AI_UI_조합_문법_공통정책.md)
- [AI UI 조합 인벤토리 1차](./docs/AI_UI_조합_인벤토리_1차.md)
- [AI UI Shell·슬롯 감사 1차](./docs/AI_UI_Shell_슬롯_감사_1차.md)
- [AI UI Section Frame 감사 1차](./docs/AI_UI_Section_Frame_감사_1차.md)
- [AI UI Section Pattern 후보 감사 1차](./docs/AI_UI_Section_Pattern_후보_감사_1차.md)
- [AI UI Behavior 후보 감사 1차](./docs/AI_UI_Behavior_후보_감사_1차.md)
- [AI UI 표준 후보 제안 1차](./docs/AI_UI_표준_후보_제안_1차.md)
- [AI UI 입고등록 파일럿 이관](./docs/AI_UI_입고등록_파일럿_이관.md)
- [AI UI 조합 문법 적용 TODO](./docs/AI_UI_조합_문법_적용_TODO.md)
- [AI 생성 화면 평가 및 승격 규칙](./docs/AI_생성화면_평가_및_승격_규칙.md)
- [디자인 시스템 레지스트리 및 시각 회귀 테스트](./docs/디자인_시스템_레지스트리_및_시각회귀_테스트.md)
- [원본 화면 정규화 기록](./docs/원본_화면_정규화_기록.md)
- [디자인 토큰 사용 규칙](./docs/디자인_토큰_사용_규칙.md)
- [디자인 판단 레지스트리 운영 규칙](./docs/디자인_판단_레지스트리_운영규칙.md)
- [디자인 값 자동감사 보고서](./docs/디자인_값_자동감사_보고서.md)
- [완성 화면 기반 UI 감사](./docs/완성화면_기반_UI_감사_20274-73333.md)
- [UI 컴포넌트 총망라 체크리스트](./docs/UI_컴포넌트_총망라_체크리스트.md)
- [컴포넌트 Optional Prop 레지스트리](./docs/컴포넌트_OPTIONAL_PROP_레지스트리.md)
- [외부 에이전트 Figma 재현 실수 기록](./docs/외부_에이전트_작업_실수_기록_Figma재현.md)
- [AI 화면 생성 이식성 가이드](./docs/AI_화면_생성_이식성_가이드.md)

## 다음 단계

1. 남은 원본 화면을 동일한 정규화 기준으로 화면 자산에 추가합니다.
2. 코드화된 화면에서 간격, 크기, 색상, 타이포그래피와 상태 사용 빈도를 수집해 이상값을 탐지합니다.
3. `observedValue / canonicalValue / decision / evidence / scope` 판단 기록을 레지스트리 스키마에 추가합니다.
4. 확인된 불일치를 표준 토큰·컴포넌트·패턴에 반영하고 대표 상태를 시각 회귀 테스트에 등록합니다.
5. 중앙 검색·선택 테이블처럼 반복 근거가 충분한 다음 Recipe를 결정적 TSX 템플릿으로 연결합니다.
6. 생성 시간뿐 아니라 원본 컨셉 충실도, 표준 컴포넌트 재사용률, 임의 값 발생 수와 수정 횟수로 AI 생성 품질을 평가합니다.
