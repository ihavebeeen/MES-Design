---
name: audit-mes-ui
description: Review MES screens, popups, and workflows in three distinct modes — POC visual/layout critique, implementation QA, or promotion readiness. Use for design feedback, UI/UX evaluation, audit, comparison, and acceptance requests. A POC review checks the design, not functional completeness. Evaluation alone does not authorize UI changes.
---

# Audit MES UI

**POC에서는 작동 여부보다 화면 디자인·배치·정보 위계의 적합성을 빠르고 명확하게 평가한다.** 이 저장소에서 POC의 목적은 작동하는 프로토타입을 증명하는 것이 아니라, 사용자가 시안을 보고 디자인 방향을 결정하도록 돕는 것이다. 정적 Figma·이미지·스크린샷도 충분한 평가 대상이다.

## 1. 자료 수집 전에 모드를 정한다

| 모드 | 평가 목적 | 적용 신호 | 읽을 기준 |
|---|---|---|---|
| `poc` | 디자인·배치·정보 관계·시각적 해결 방식 검토 | POC, 컨셉, 시안, 아이디어, 구조, 디자인 방향 피드백 | [POC 평가](references/poc-review.md)만 |
| `implementation` | 요청한 기능·상태·접근성·반응형·MES 컴포넌트 계약 확인 | 실제 동작 검사, 구현 QA, 원본 대비 구현 비교, 접근성 검사 | [구현 감사](references/mes-audit-rubric.md), [구현/승격 보고](references/report-contract.md) |
| `promotion` | 현재 증적과 사용자 검토를 포함한 운영 화면·표준 자산 승격 심사 | 승격 심사, 표준 편입, 운영 투입 가능 여부 판정 | 구현 감사·보고 기준과 [승격 심사](references/promotion-review.md) |

- 사용자가 POC라고 말하면 `poc`가 기본이다. 실행 코드·URL·receipt가 있다는 이유로 상위 모드로 바꾸지 않는다.
- 명시한 모드와 평가 목적을 우선한다. POC에 특정 키보드 검사 등을 추가 요청하면 POC 본문과 **그 추가 검사만** 분리한다. 전체 구현/승격 심사로 확대하지 않는다.
- POC와 승격을 모두 명시적으로 요청하면 결과도 둘로 나눈다. 구현 증적 부족이 POC 디자인의 결함이 되지 않는다.
- 모드가 없으면 질문에서 추론한다. 일반적인 “이 화면 어때?”나 정적 시안 피드백은 `poc`, 기능/코드 검사는 `implementation`이다. “감사”, “완성도”, 생성 결과라는 말만으로 `promotion`을 선택하지 않는다.
- 시작할 때 선택한 모드와 대상 범위를 한 문장으로 알린다. 이미 주어진 단계·요구를 재질문하지 않는다.

## 2. 필요한 근거만 고정한다

- 대상: 정확한 화면·팝업·Figma 노드·스크린샷·파일·흐름. 팝업 요청을 부모 화면 전체 감사로 늘리지 않는다.
- 질문: 이 화면에서 무엇을 보여주고 어떤 판단을 도우려는가? 사용자가 제시한 평가 질문을 우선한다.
- 범위: `surface`(해당 화면/팝업) 또는 `connected-flow`(선택 전달·저장 후 반영 등). POC에서는 흐름도 정보 연결이 어떻게 표현되는지만 평가하며 실제 전달·저장을 검사하지 않는다. 한 범위의 확인을 다른 범위의 통과로 확대하지 않는다.
- 근거: 현재 사용자 요구와 사용자 수정본을 우선한다. 실제 관찰, 코드 확인, 사용자 설명, 추정을 구분한다. Figma만 보고 실행 동작을, 코드만 보고 실제 시각 품질을 확인했다고 쓰지 않는다.
- 시각 판단에는 제공된 시안/캡처 또는 실제 렌더를 본다. 설명만 있으면 설명에 대한 개념 평가임을 밝히고 배치·여백을 관찰했다고 주장하지 않는다. 시각 자료가 꼭 필요하면 필요한 이미지/노드만 요청한다.

저장소 지침은 [AGENTS.override.md](../../../AGENTS.override.md)를 따른다. 생성·구현 전달 절차를 읽기 전용 POC 평가의 선행 조건으로 적용하지 않는다.

MES 근거는 요청에 관련된 부분만 확인한다:

- 정보/배치 의미가 문제이면 [AI UI 맥락 규칙](../../../docs/AI_UI_맥락_규칙.md)과 해당 `docs/components/` 문서.
- 구현 계약이면 `component-library/src/design-system/registry/`의 `components.json`, `component-usage-contracts.json`, `patterns.json`, `pattern-contracts.json`, `screen-specs.json` 중 대상 항목.
- 승격이면 승격 기준이 연결한 lifecycle·평가·검증 자료.

POC는 계약 파일·receipt·API·부모 페이지 없이도 제공된 시안과 업무 설명으로 평가할 수 있다. 모드를 정하기 전에 전체 레지스트리나 승격 문서를 읽지 않는다.

## 3. 지적의 품질을 확인한다

각 지적은 `구체적인 관찰 → 업무상 영향 → 가장 작은 개선`으로 설명한다. 내부적으로 다음을 구분하되 POC에 긴 findings 표를 출력하지 않는다:

- **확인된 문제**: 주어진 요구 또는 확인한 자료와 충돌한다.
- **설계상 절충/가설**: 다른 방식이 더 나을 수 있으나 효과를 단정할 근거가 부족하다. 전제와 확인할 질문을 밝힌다.
- **취향**: 업무상 이득이나 MES 근거를 설명할 수 없으면 결함으로 올리지 않는다.

비교에 필요한 밀도·전문 용어·익숙한 필터/표/액션을 “깔끔함”만으로 제거하지 않는다. 단건이면 표 금지, 선택지는 몇 개 이하, 모든 화면은 카드 같은 외부의 고정 처방을 MES 표준으로 가져오지 않는다. 반대로 원본이라는 이유만으로 중복·혼동까지 정당화하지 않는다.

구조 문제와 국소적 표현 문제를 분리한다. 헤더·필드·간격 변경으로 풀리는 문제를 전체 재설계로 부풀리지 않는다. 잘된 점은 수정 중 보존할 이유가 있는 것만 짚고, 동일 원인을 여러 지적으로 쪼개지 않는다.

자동 검사 통과는 좋은 UX의 증명이 아니다. 사용성 평가는 실제 사용자 테스트의 대체물이 아니며, 스크린샷이나 자동 검사만으로 WCAG 준수를 선언하지 않는다. 기본 출력에 총점은 없다.

## 4. 모드에 맞게 보고하고 멈춘다

- `poc`: 전용 짧은 형식으로 끝낸다. 구현 findings·Verdict·Promotion recommendation·증적 목록을 붙이지 않는다.
- `implementation`: 선언한 구현 범위의 문제·확인 내용·미확인 범위를 보고한다. 승격 권고를 만들지 않는다.
- `promotion`: 구현 결과와 별개로 현재 증적/승인 요건 및 승격 준비도를 보고한다. 추천은 승인 자체가 아니다.

평가만 요청받으면 UI·Figma·레지스트리를 바꾸지 않는다. 수정까지 요청받으면 확정한 지적만 `generate-mes-ui`로 전달하고 수정 후 **같은 모드·범위**에서 다시 평가한다. POC 의견은 GENERATE 전달 게이트를 면제하거나 운영 승격을 승인하지 않는다.

외부 근거와 채택/제외 내역은 [출처와 라이선스 기록](THIRD_PARTY_LICENSES.md)에 있다. 일반 평가마다 외부 스킬을 설치하거나 전문을 읽을 필요는 없다. 스킬 수정 시에는 [행동 회귀 사례](evals/scenarios.md)로 모드 경계와 판단을 점검한다.
