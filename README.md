# MES Design System

클라우드 MES의 Figma 디자인 시스템과 실제 화면설계서를 React 코드로 옮기는 저장소입니다.

이 프로젝트의 목표는 컴포넌트 카탈로그를 만드는 데서 끝나지 않습니다. 검증된 디자인 토큰, 컴포넌트, 화면 패턴을 AI가 조합하여 새로운 MES 화면을 빠르고 일관되게 생성할 수 있는 기반을 구축합니다.

## 프로젝트 목표

1. Figma의 디자인 토큰과 UI 컴포넌트를 재사용 가능한 코드로 구현합니다.
2. 실제 MES 화면에서 반복되는 레이아웃과 상호작용을 화면 패턴으로 정리합니다.
3. AI가 기존 디자인 언어 안에서 새로운 화면을 생성하도록 구조화된 규칙과 검증 절차를 제공합니다.
4. Figma 근거, 코드로 검증된 값, 임시 판단값을 명확하게 구분합니다.

## 현재 상태

| 항목 | 현재 규모 |
|---|---:|
| UI 컴포넌트 구현 파일 | 62개 |
| 아이콘 TSX 파일 | 36개 |
| 원본 SVG 에셋 | 75개 |
| 구현된 화면 패턴 | 3개 |
| 디자인 시스템 문서 | 11개 |
| 최근 production build 생성 페이지 | 81개 |

현재 구현된 대표 패턴은 다음과 같습니다.

- 리스트형 등록 모달
- 검사항목 체크리스트 모달
- 그룹화 리스트 관리 화면

TypeScript 검사와 production build는 통과합니다. ESLint에는 렌더 중 ref 변경, 미사용 import, 빈 interface 등 기존 정리 대상이 남아 있습니다.

## 기술 스택

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI
- class-variance-authority
- Lucide React 및 MES 전용 SVG 아이콘

컴포넌트 구조는 shadcn/ui 스타일의 `cn()` 헬퍼, variant 구성, Radix UI primitive 조합 방식을 사용합니다. 실제 디자인 값은 MES Figma를 기준으로 별도 구현합니다.

## 저장소 구조

```text
MES-Design/
  AGENTS.md
  README.md
  docs/
    AI_MES_화면_생성_아키텍처.md
    디자인_토큰_사용_규칙.md
    UI_컴포넌트_총망라_체크리스트.md
    ...
  component-library/
    src/
      app/
      components/
        ui/
        icons/
      lib/
    package.json
```

주요 코드 위치:

- `component-library/src/app/globals.css`: 색상, 간격, radius, shadow, typography 토큰
- `component-library/src/components/ui/`: 실제 UI 컴포넌트
- `component-library/src/components/icons/`: MES 전용 아이콘 컴포넌트
- `component-library/src/app/_components/sidebar-data.ts`: 문서 사이트 라우트와 내비게이션 데이터
- `component-library/src/app/_components/client-page.tsx`: 컴포넌트 예제와 패턴 화면

## 로컬 실행

```powershell
cd component-library
npm install
npm run dev
```

기본 개발 서버는 Next.js가 안내하는 로컬 주소에서 확인할 수 있습니다.

검증 명령:

```powershell
npx tsc --noEmit
npm run lint
npm run build
```

## 문서 사이트 구조

문서 사이트는 다음 세 영역으로 구성됩니다.

- `/foundations/*`: 디자인 토큰과 기초 규칙
- `/components/*`: 개별 UI 컴포넌트와 상태·변형
- `/patterns/*`: 실제 MES 업무 화면 조합 패턴

각 컴포넌트 페이지는 단순 미리보기가 아니라 다음 정보를 함께 제공하는 것을 목표로 합니다.

- Figma 기준 node
- 크기 및 variant
- 상태와 상호작용
- 토큰 사용 근거
- 코드 사용 예시
- 확정값과 임시 판단값의 구분

## 구현 원칙

### Figma 근거 우선

- 구체적인 수치와 상태를 말할 때 실제 Figma node ID를 기록합니다.
- 비슷한 컴포넌트의 값을 다른 컴포넌트에 추론 적용하지 않습니다.
- Figma Description에 업무 동작이 있으면 시각 정보와 함께 구현 근거로 사용합니다.

### 재사용 우선

- 새로운 화면은 기존 토큰과 컴포넌트를 우선 조합합니다.
- 화면 내부에서 공통 UI를 다시 구현하지 않습니다.
- 기존 조합으로 표현할 수 없는 요구사항만 신규 컴포넌트 또는 패턴 후보로 분류합니다.

### 불확실성 기록

- Figma에서 확인하지 못한 값은 `판단값` 또는 `임시`로 표시합니다.
- 시각 결과를 직접 확인하지 않았다면 검증 완료로 기록하지 않습니다.
- 새로 발견된 반복 문제와 해결 규칙은 문서와 `AGENTS.md`에 누적합니다.

## AI 기반 MES 화면 생성

향후 화면 생성 흐름은 다음과 같습니다.

```text
사용자 요구사항
  -> ScreenSpec
  -> Schema Validation
  -> MES Archetype 선택
  -> Component Registry 조회
  -> React/Next.js 페이지 생성
  -> TypeScript·Lint·Build·시각 검증
```

AI가 자연어에서 곧바로 JSX를 생성하지 않고, 타입 안전한 `ScreenSpec`을 먼저 작성하도록 구성합니다. `ScreenSpec`은 생성 과정의 중간 표현이며 최종 산출물은 일반적인 React 코드로 유지합니다.

초기 화면 Archetype:

- `entity-list`
- `list-with-editor`
- `master-detail`
- `form-editor`
- `dashboard`
- `workflow`

구체적인 구조, AI 강제 규칙, Registry 계약, Figma 인덱싱 방식 및 구현 단계는 [AI 기반 MES 화면 생성 아키텍처](./docs/AI_MES_화면_생성_아키텍처.md)를 참고합니다.

## 문서

- [AI 기반 MES 화면 생성 아키텍처](./docs/AI_MES_화면_생성_아키텍처.md): AI 화면 생성 파이프라인, ScreenSpec, Registry 및 검증 계약
- [디자인 토큰 사용 규칙](./docs/디자인_토큰_사용_규칙.md): 색상, 간격, radius 등 토큰 적용 규칙
- [UI 컴포넌트 총망라 체크리스트](./docs/UI_컴포넌트_총망라_체크리스트.md): 데스크톱 컴포넌트 범위와 구현 상태
- [모바일 컴포넌트 체크리스트](./docs/모바일_컴포넌트_체크리스트.md): 모바일·태블릿 컴포넌트 범위
- [신규 컴포넌트 설계 프로세스](./docs/신규_컴포넌트_설계_프로세스.md): 신규 컴포넌트 설계 절차
- [컴포넌트 기능 변형 심층분석](./docs/컴포넌트_기능_변형_심층분석.md): 주요 컴포넌트의 기능 및 variant 분석
- [리스트형 등록 모달 패턴 가이드](./docs/리스트형_등록_모달_패턴_가이드.md): 등록 모달 조합 및 동작 규칙
- [아이콘 매핑표](./docs/아이콘_매핑표.md): SVG 에셋과 React 아이콘 매핑
- [Table 수정 대기목록](./docs/Table_수정_대기목록.md): Table 보류 항목 및 검증 기록
- [Figma 재현 작업 실수 기록](./docs/외부_에이전트_작업_실수_기록_Figma재현.md): 반복 오류와 예방 규칙
- [AI 에이전트 구조적 한계 기록](./docs/AI_에이전트_구조적_한계_기록.md): AI 작업에서 반복되는 실패 유형과 대응 원칙

## 다음 단계

1. 기존 문서와 ESLint 오류를 정리하여 기준선을 안정화합니다.
2. 현재 컴포넌트 62개를 AI가 조회할 수 있는 Component Registry로 구조화합니다.
3. `entity-list`, `list-with-editor`, `master-detail` Archetype을 우선 구현합니다.
4. 거래처 리스트를 첫 번째 Golden Example과 ScreenSpec으로 등록합니다.
5. 동일한 Archetype을 사용해 신규 MES 화면을 생성하고 검증합니다.
