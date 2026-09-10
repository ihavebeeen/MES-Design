# Figma 라이브러리 · Code Connect 도입 계획

작성일: 2026-08-24  
대상 저장소: `ihavebeeen/MES-Design`  
대상 Figma 라이브러리: `qEAQNTqXf76bYydyupti2V` (`컴포넌트 라이브러리`)

## 1. 먼저 구분해야 하는 것

Figma에서 화면을 편집 가능하게 만드는 일과 Code Connect는 서로 다른 일이다.

- **Figma 컴포넌트 라이브러리**: 디자이너가 Figma 캔버스에서 Button, Input, Modal Header 등의 인스턴스를 꺼내 화면을 조합하게 한다.
- **Code Connect**: 이미 존재하는 Figma 컴포넌트를 React 컴포넌트 경로와 연결한다. Dev Mode와 Figma MCP가 임의 JSX 대신 실제 코드 컴포넌트 이름·경로·prop 예시를 반환하게 한다.
- **Figma 화면 생성기**: MES 화면 계약을 해석하고 Figma 라이브러리 인스턴스를 조합하여 편집 가능한 화면을 만든다. Code Connect만으로 화면이 자동 생성되지는 않는다.

따라서 최종 구조는 다음 세 층이어야 한다.

1. Figma Variables / Styles ↔ 코드 토큰
2. Figma Components / Variants ↔ React Components / Props
3. Figma 화면 조합 ↔ MES Shell · Section · Behavior · ActionSet 계약

HTML이나 localhost 화면을 Figma에 통째로 붙여 넣는 방식은 빠른 참고용일 수는 있어도 공식 자산으로 사용하지 않는다. 공식 화면은 Figma 컴포넌트 인스턴스 조합이어야 한다.

## 2. 현재 조사 결과

### 코드

- 웹 레지스트리: 88개 (`stable` 40개, `provisional` 48개)
- 모바일 레지스트리: 컴포넌트 18개, 파운데이션 6개, 패턴 12개
- CSS 변수: 214개
- 현재 Code Connect 설정 및 `.figma.ts` 템플릿: 없음

### Figma

- 페이지: `MES`, `MES Mobile`, `CEMS`, `FEMS`
- MES 페이지: Component Set 66개, 독립 Component 18개
- `Button`, `Input Textbox`, `Mobile Buttons`, `modal-header` 등은 이미 팀 라이브러리에 게시되어 있음
- 로컬 Variable Collection: 10개, 변수 109개
- 조사된 109개 변수 모두 code syntax가 비어 있고 scope가 `ALL_SCOPES`
- Text Style은 없고 Effect Style은 `SHADOW` 1개가 확인됨
- 변수 이름과 Collection 이름에 중복·임시명이 많고, 대부분 publishing hidden 상태임

즉, 현재 Figma는 “컴포넌트는 상당수 존재하지만 코드 토큰과 연결된 정식 라이브러리 구조”는 아니다.

## 3. 현재 Code Connect 차단 사유

Figma API가 다음 조건 미충족을 반환했다.

> Organization 또는 Enterprise 플랜의 Dev/Full seat가 필요함

이 문제는 GitHub MFA와 무관하다. 현재 계정/팀 플랜 또는 seat 조건이 충족되기 전에는 실제 Code Connect 매핑 저장·검증을 할 수 없다.

플랜 조건이 당장 어렵더라도 Figma 라이브러리 정리와 편집 가능한 화면 생성은 먼저 진행할 수 있다. 이후 조건이 충족되면 준비된 node↔code 장부를 사용해 Code Connect를 붙인다.

## 4. 1차 매핑 판정

| Figma 자산 | Node | 코드 | 판정 | 이유 |
|---|---:|---|---|---|
| Button | `163:8344` | `Button` | 템플릿 매핑 전 정규화 | Figma `type/size/status`와 코드 `variant/size/disabled + CSS hover` 구조가 다름 |
| Input Textbox | `163:6495` | `Input`, `Select`, `SearchInput` | Figma 분리 필요 | 하나의 Figma Set이 서로 다른 코드 컴포넌트 3종 이상을 함께 포함 |
| checkbox | `163:7154` | `Checkbox` | API 정규화 필요 | Figma 단일 `Property 1`에 선택·색·크기·상태 의미가 섞여 있음 |
| mes/icon-radio | `163:7143` | `Radio` | API 정규화 필요 | Figma variant 이름과 코드의 `checked/disabled/size` 의미축이 다름 |
| page-top-tab-item | `157:18051` | `PageTopTabItem` | 직접 연결 우선 후보 | 상태축과 코드 역할이 비교적 명확함 |
| modal-header | `158:19454` | 직접 대응 없음 | 코드 컴포넌트 추출 필요 | 현재 CenterModal/SideSlidePanel 내부 구현에 흩어져 있음 |
| Mobile Buttons | `163:51128` | `MobileButton` | 템플릿 매핑 후보 | Figma `type/size`와 코드 `tone/size` 값 변환 필요 |
| Tab Bar - after login | `163:51332` | `MobileTabBar` | 연결 후보 | active 상태를 prop으로 연결 가능 |
| header | `163:51373` | `MobileHeader` | 연결 후보 | variant 명칭 정규화 필요 |
| Input Textbox (Mobile) | `163:51492` | `MobileInput` | 연결 후보 | state/size 명칭 정규화 필요 |
| Selectbox (Mobile) | `163:51522` | `MobileSelect` | 코드 API 확장 후 연결 | 코드가 Figma의 readonly/disabled/focus 상태를 아직 표현하지 못함 |
| Toggle | `163:51463` | `MobileToggle` | 직접 연결 후보 | on/off ↔ checked 대응이 명확함 |
| mobile-tab-item | `163:51475` | `MobileTab` | 연결 후보 | default/active 상태와 `aria-selected`를 코드 API로 제공 |
| Step List - Horizontal | `185:47116` | `MobileStep` | 연결 후보 | 리스트 단위 컴포넌트로 대응 |
| mobile CTA | `191:29305` | `MobileCta` | 코드 API 확장 후 연결 | Figma의 세 번째 CTA 유형이 코드에 없음 |
| 검사 버튼 리스트 | `185:45044` | `MobileQaGroup` | 연결 후보 | 선택값에 따른 ○/△/✕ 그룹 상태를 prop으로 연결 가능 |

기계 판정 원본은 `component-library/src/design-system/registry/figma-code-connect-candidates.json`에 둔다.

## 5. 코드에만 있는 자산 처리 규칙

코드에 존재한다고 전부 Figma 컴포넌트로 만들지 않는다.

- **Figma 컴포넌트로 이관**: 반복 사용되고 독립적인 property API가 있는 안정 컴포넌트
- **Figma 패턴으로 이관**: 여러 컴포넌트 조합이며 반복되는 업무 맥락이 있는 구조
- **이관 제외**: 미리보기 전용 wrapper, 테스트 fixture, 한 화면에서만 쓰는 임시 구조

현재 우선 검토 대상:

- 컴포넌트 후보: `DialogHeader`, `MobileCompactField`
- 패턴 후보: `MobileFormSection`, `MobileInspectionQuestionList`, `MobileTwoDepthMenu`, `MobileDateNavigator`
- 이관 제외 후보: `MobileDevice`, `*Preview`, visual-test 전용 자산
- Figma에 추가 검토할 Button 코드 전용값: `softMain`, `softDanger`

새 컴포넌트나 variant는 “코드에 존재한다”만으로 승인하지 않는다. 실제 반복 근거와 기존 패턴으로 표현할 수 없는 이유가 있어야 한다.

## 6. 권장 진행 순서

### Phase 1 — 토큰 정규화

기존 10개 Collection을 바로 뜯어고치지 않는다. 같은 Figma 파일 안에 `MES v2` 이름의 새 Collection을 만들고, 코드 CSS 변수의 정확한 이름을 WEB code syntax로 설정한다.

- `MES v2 / Primitives`
- `MES v2 / Semantic Color`
- `MES v2 / Spacing & Radius`
- `MES v2 / Typography`

기존 컴포넌트를 한 번에 재바인딩하지 않고, 이관한 컴포넌트부터 새 변수에 연결한다.

### Phase 2 — Figma 라이브러리 구조

같은 파일 안에 다음 페이지를 추가하는 방식을 권장한다.

- `MES v2 / Foundations`
- `MES v2 / Web Components`
- `MES v2 / Mobile Components`
- `MES v2 / Patterns`
- `MES v2 / Deprecated`

기존 페이지와 컴포넌트는 보존하며, 검증된 v2 자산만 단계적으로 게시한다.

### Phase 3 — 파일럿 컴포넌트

먼저 다음 8개를 이관·검증한다.

1. Web Button
2. Web Input
3. Web Checkbox
4. Web Radio
5. MobileButton
6. MobileHeader
7. MobileInput
8. MobileToggle

각 컴포넌트는 Figma node 구조, 코드 prop, 토큰 binding, screenshot을 개별 검증한다.

### Phase 4 — Code Connect

Figma 플랜/seat 조건이 충족된 뒤 진행한다.

1. 파일럿 node와 코드 경로를 단순 매핑
2. prop 변환이 필요한 컴포넌트는 `.figma.ts` parserless template 작성
3. Dev Mode에서 실제 React snippet 확인
4. Figma MCP가 `componentName`, `source`, snippet을 반환하는지 확인
5. 전체 안정 컴포넌트로 확대

### Phase 5 — 편집 가능한 Figma 화면 생성

화면 요청을 바로 좌표 기반 도형으로 그리지 않는다.

1. MES MCP가 `ScreenRequest`를 Shell·Section·Behavior·ActionSet 계약으로 해석
2. 계약의 component/pattern ID를 Figma component key로 변환
3. Figma 라이브러리 instance를 생성하고 variant/property 설정
4. 원본 또는 요구사항과 screenshot·크기·overflow 비교
5. 새 자산이 필요하면 proposal로 격리 후 승인

이 흐름이 완성되면 같은 저장소를 clone한 다른 PC와 다른 AI 도구도 동일한 Figma 자산과 조합 규칙을 사용할 수 있다.

## 7. 다음 승인 지점

Phase 1부터는 Figma 파일을 실제로 변경하므로 아래 두 조건을 먼저 확정한다.

1. Code Connect 플랜/seat를 확보할지, 우선 Figma 라이브러리만 정리할지
2. 기존 파일 안에 `MES v2` 페이지·Collection을 추가하는 권장안을 사용할지

권장안은 **현재 파일 안에 MES v2를 격리해 만들고, Code Connect는 seat 확보 후 붙이는 방식**이다.
