# MES Design System

MES 서비스의 디자인 토큰, UI 컴포넌트, 업무 패턴과 완성 화면을 React 코드로 관리하는 저장소입니다.

이 프로젝트의 목적은 단순한 컴포넌트 카탈로그가 아닙니다. 검증된 디자인 자산을 AI가 조회하고 조합하여, 새로운 MES 화면을 빠르게 만들면서도 기존 서비스의 디자인과 동작 규칙을 유지하는 기반을 구축합니다.

## 핵심 원칙

1. 원본 Figma 프레임의 크기, 배치, 문구, 줄바꿈과 상태를 구현의 합격 기준으로 삼습니다.
2. 구현 전에 화면의 모든 요소를 조사하고 기존 토큰·컴포넌트·variant에 매핑합니다.
3. 대응 컴포넌트나 variant가 없으면 화면에 임시 마크업을 만들지 않고 공용 자산으로 먼저 추가·등록합니다.
4. 원본 화면 코드는 등록된 Button, Input, Select, Radio, Checkbox, Table 등을 조합해서만 작성합니다.
5. Figma의 최초안, 수정안, 반응형안과 상태 예시는 각각 복제하지 않고 `기준 화면 + 상태 + breakpoint + 보조 팝업`으로 정규화합니다.
6. Figma에서 확인한 값과 구현 과정에서 추정한 값을 구분해 기록합니다.
7. TypeScript, 레지스트리 검사, 컴포넌트 재사용 검사, 상호작용 검사, 시각 회귀 테스트와 빌드로 결과를 검증합니다.

## 현재 구성

| 자산 | 등록 수 |
|---|---:|
| UI 컴포넌트 | 73 |
| 화면·팝업·테이블 패턴 | 20 |
| AI 조회용 화면 정의 | 17 |
| 시각 회귀 기준 케이스 | 3 |
| Playwright 시각 회귀 테스트 | 4 |
| 정적 생성 페이지 | 88 |

대표 구현 범위:

- MES 파운데이션과 시맨틱 토큰
- Button, Input, Select, Radio, Checkbox, Filter, SearchInput, Table 등 공용 UI
- 중앙 팝업과 우측 슬라이드 팝업 패턴
- 그룹화 리스트, 마스터–상세, 분석 대시보드 패턴
- 투입품목 설정/조회, BOM 복사, 운전일지, 생산·입고 등록 등 업무 팝업
- 양식관리, 생산실적 반응형, 캐비티 배열, 재고 추가·편집, 발주 정보
- 생산분석 최신 화면과 카드 설정 상태

## 원본 화면 정규화

장기간 누적된 디자인에는 같은 화면의 일부 수정안과 상태 예시가 함께 존재합니다. 이를 독립 화면으로 중복 구현하지 않고 다음 기준으로 분류합니다.

- 업무 목적과 데이터 흐름이 같으면 같은 화면으로 봅니다.
- 선택 전/후, 비어 있음/데이터 있음, 입력 활성/비활성은 상태로 관리합니다.
- 1280·786·375 시안은 하나의 반응형 화면으로 관리합니다.
- 목록에서 열리는 상세·설정 화면은 상위 화면의 보조 팝업으로 연결합니다.
- 최신 수정안을 기준 화면에 반영하고 이전안은 판단 근거로 보존합니다.

현재 정규화된 원본 화면은 문서 사이트의 `/patterns/original-mes-screen-assets/`에서 확인할 수 있습니다.

자세한 분류 근거는 [원본 화면 정규화 기록](./docs/원본_화면_정규화_기록.md)을 참고하세요.

## 원본 화면 코드화 절차

```text
Figma 기준 프레임 확정
  → 레이아웃·문구·줄바꿈·상태·상호작용 전수 조사
  → 기존 Component Registry와 1:1 매핑
  → 누락 컴포넌트 또는 variant를 공용 자산으로 구현·등록
  → 등록된 컴포넌트만 사용해 원본 화면 조합
  → 기준 크기 스크린샷 대조
  → 선택·입력·필터·팝업 등 상호작용 검증
  → TypeScript·레지스트리·재사용·시각 회귀·빌드 검사
```

원본 화면 구현은 “유사한 패턴을 만드는 작업”이 아닙니다. 기준 프레임과 픽셀·문구·상태가 일치해야 하며, 화면 내부에 `Fixture` 전용 컨트롤이나 공용 컴포넌트를 우회한 HTML 컨트롤을 남기지 않습니다. 수정안이 여러 개라면 먼저 각각의 차이가 상태인지, breakpoint인지, 실제 최신 변경인지 판별한 뒤 기준 화면에 반영합니다.

## 저장소 구조

```text
MES-Design/
├─ AGENTS.md
├─ README.md
├─ docs/
│  ├─ AI_MES_화면_생성_아키텍처.md
│  ├─ 디자인_시스템_레지스트리_및_시각회귀_테스트.md
│  ├─ 원본_화면_정규화_기록.md
│  └─ ...
└─ component-library/
   ├─ scripts/
   ├─ tests/visual/
   └─ src/
      ├─ app/
      ├─ components/
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
- `component-library/src/design-system/registry/`: AI 조회용 컴포넌트·패턴·화면 레지스트리
- `component-library/src/lib/sidebar-data.ts`: 문서 사이트 메뉴와 정적 경로 데이터
- `component-library/src/app/[...slug]/client-page.tsx`: 문서 사이트의 실제 콘텐츠

## 로컬 실행

```powershell
cd component-library
npm install
npm run dev
```

개발 서버가 시작되면 다음 경로를 확인합니다.

- `/foundations/`: 디자인 토큰과 기초 규칙
- `/components/`: 개별 UI 컴포넌트와 상태
- `/patterns/`: MES 업무 화면과 조합 패턴
- `/patterns/original-mes-screen-assets/`: 정규화된 원본 화면 자산

## 검증 명령

```powershell
# TypeScript
npm exec tsc -- --noEmit

# 패턴의 공용 컴포넌트 재사용 + 레지스트리 무결성
npm run check:design-system

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
사용자 요구사항
  → ScreenSpec 작성
  → Screen Registry 조회
  → Pattern Registry 조회
  → 필요한 Component Registry 조회
  → 기존 컴포넌트로 React 화면 조합
  → TypeScript·레지스트리·재사용 검사
  → 상호작용 및 시각 회귀 검증
```

AI가 임의의 JSX를 바로 생성하는 대신, 화면 정의에서 필요한 패턴과 컴포넌트를 먼저 찾도록 구성합니다.

레지스트리 역할:

- `components.json`: 컴포넌트 API, 상태, 소스 위치
- `patterns.json`: 기존 공용 화면 패턴
- `screens.json`: 기존 대표 화면과 상태 규칙
- `source-assets.json`: 정규화된 원본 화면, Figma node, 상태와 breakpoint 규칙
- `visual-regression.json`: 대표 시각 회귀 기준

## 구현 규칙

### 기존 컴포넌트 우선

- 패턴 파일에서 HTML `button`, `input`, `select`, `table`을 직접 구성하지 않습니다.
- 기존 컴포넌트로 표현할 수 없는 요소는 신규 prop 또는 신규 컴포넌트로 구현하고 `components.json`에 등록한 뒤 화면에서 사용합니다.
- 원본 화면 구현 파일에서 `Fixture*` 컴포넌트를 사용하지 않습니다.
- 선택 상태, 행 배경, 입력 활성화와 같은 동작은 화면에 보이는 외형과 함께 구현합니다.

### Figma 근거 기록

- 전체 Figma URL 대신 추적에 필요한 node ID를 레지스트리에 기록합니다.
- Description에 정의된 업무 동작도 시각 정보와 동일한 구현 근거로 사용합니다.
- HUG 또는 Auto Layout만 보고 추정하지 않고 부모·자식 프레임 크기와 실제 화면 결과를 함께 비교합니다.
- 기준 프레임의 문구, 줄바꿈, 열 너비와 모달 크기도 임의로 보정하지 않고 실제 렌더링과 대조합니다.

### 상태를 화면 복제본으로 만들지 않기

- 체크 전/후 화면을 별도 컴포넌트로 만들지 않습니다.
- 모달의 empty/populated 상태를 별도 페이지로 분리하지 않습니다.
- 동일 화면의 반응형 프레임을 별도 화면 ID로 등록하지 않습니다.

## 문서

- [AI 기반 MES 화면 생성 아키텍처](./docs/AI_MES_화면_생성_아키텍처.md)
- [디자인 시스템 레지스트리 및 시각 회귀 테스트](./docs/디자인_시스템_레지스트리_및_시각회귀_테스트.md)
- [원본 화면 정규화 기록](./docs/원본_화면_정규화_기록.md)
- [디자인 토큰 사용 규칙](./docs/디자인_토큰_사용_규칙.md)
- [완성 화면 기반 UI 감사](./docs/완성화면_기반_UI_감사_20274-73333.md)
- [UI 컴포넌트 총망라 체크리스트](./docs/UI_컴포넌트_총망라_체크리스트.md)
- [컴포넌트 Optional Prop 레지스트리](./docs/컴포넌트_OPTIONAL_PROP_레지스트리.md)
- [외부 에이전트 Figma 재현 실수 기록](./docs/외부_에이전트_작업_실수_기록_Figma재현.md)

## 다음 단계

1. 남은 원본 화면을 동일한 정규화 기준으로 화면 자산에 추가합니다.
2. 원본 화면별 대표 상태를 시각 회귀 테스트에 순차 등록합니다.
3. ScreenSpec 스키마와 코드 생성기를 레지스트리에 연결합니다.
4. 새 MES 화면 생성 시간을 측정해 AI 화면 생성 품질을 평가합니다.
