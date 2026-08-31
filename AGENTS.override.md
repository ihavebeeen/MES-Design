# MES Design System — AI 실행 규칙

이 파일은 화면 생성·수정에 적용하는 짧은 우선 지침이다. 공통 현재 규칙은 `AGENTS.md`, 기계 판독 상태는 저장소 레지스트리를 따른다.

## 목적

이 프로젝트는 Figma 화면을 단순 복제하는 코드 모음이 아니다. 기존 MES UI를 근거로 컴포넌트, 섹션 패턴, 동작 패턴, 셸, 조합 문법을 정교화하고 그 계약으로 신규 UI 생성과 기존 UI 감사를 자동화한다.

## 화면 작업의 필수 진입점

- 화면, 팝업, 테이블 흐름을 생성하거나 수정할 때 `.agents/skills/generate-mes-ui/SKILL.md`를 먼저 따른다.
- `mes-ui` MCP가 연결되어 있으면 등록 자산 조회, 계약 해석, 결정형 생성, 구현 감사에 해당 MCP 도구를 우선 사용한다. MCP가 없을 때만 동일 기능의 npm 명령을 사용한다.
- `intent: new`에서는 업무명이나 가장 가까운 메뉴명으로 `mes_get_web_generation_context`를 조회한다. 업무 정보와 페이지·팝업·섹션 맥락은 참고용이며 과거의 주요/보조 분류·배치·추가 방식을 강제하지 않는다. 일치 사례가 없어도 생성할 수 있다. Figma 대조·미검증 수치는 읽지 않는다.
- `intent: reproduce | normalize | audit`에서만 `mes_get_reproduction_audit_context`를 조회해 특정 화면의 실제 웹·Figma·불일치 근거를 확인한다.
- 자연어 또는 Figma를 바로 JSX로 옮기지 않는다. 먼저 `ScreenRequest`를 만들고 `npm run screen:resolve`로 계약을 확정한다.
- 신규·구조 변경은 생성 스킬이 연결한 `screen-intake-policy.json`을 읽는다. 화면 전체 맥락을 먼저 확보하고 중요한 미정 사항만 질문한다. 답과 근거는 기존 `requirements`·`evidence.notes`에 보존하며, 답 하나로 Shell·Table을 자동 선택하지 않는다.
- 가중치·자유도 요청은 생성 스킬의 가중치 절과 [설계](./docs/AI_UI_맥락_규칙.md#design-system-weights)를 읽는다. 기본 1, 영역·스타일/컴포넌트/배치를 분리하고 신규 자산 허용을 별도로 확인한다. 현재 수치별 생성·검사 완화는 설계 단계다. 기존 검사 조건을 메모나 수치로 우회하지 않으며, 지원 범위를 벗어난 요청은 대안 또는 실행 기능 추가를 합의한다.
- 가장 가까운 등록 화면의 `getImplementationContext(screenId)`를 기준으로 시작한다.
- 가장 가까운 화면의 명세를 사용할 때는 순서형 `composition.sections`를 읽는다. 신규 요청에서 다른 구성을 선택할 수 있으며 그 순서를 명시한다. 평면 `sectionRefs`만 보고 섹션을 재배치하지 않는다.
- 각 의미 있는 자산은 정확히 일치하는 승인 자산을 먼저 찾고, 없으면 가장 가까운 후보가 의미·동작·선택 수·상태·접근성·부모 맥락을 보존하는지 판정한다. 보존할 수 없을 때만 신규 자산 proposal로 이동한다.
- 등록 컴포넌트와 패턴을 우선 사용한다. `<button>`, `<input>`, `<select>`, `<textarea>` 같은 원시 상호작용 요소를 화면 코드에 직접 만들지 않는다.
- 별도 폴더·임시 HTML·채팅 시안·localhost도 동일한 MES 적용 범위다. 저장소 수정 금지/기존 화면과 다른 배치는 공용 자산 대체 허가가 아니다. 생성 스킬의 `references/delivery-gate.md`에 따라 최종 파일 검사 → 내부 QA → `screen:handoff`를 거친다. 신규는 선택한 MES 자산/규칙과 렌더링·동작을 확인하고, 원본 재현·정규화·감사는 원본도 대조한다. 검사 누락·오류·차단·미확인은 전달 통과가 아니다. 도구/권한 제약은 대안과 필요한 승인을 먼저 확인한다.
- Experimental 후보와 `influence: quarantined` 생성 화면은 근거로 사용하지 않는다.

## 근거와 정규화

- 신규 UI는 업무 결과와 실제 웹 조합 문법을 먼저 선택한다. 시각적으로 비슷한 완성 Figma 화면을 먼저 찾아 조합을 결정하지 않는다.
- 기존 화면 재현은 Figma의 콘텐츠, 위계, 상태, 배치, 측정값을 먼저 대조한다.
- 실제 웹은 반복 사용 위치와 연결 구조를 찾는 근거로만 사용한다. 개발 웹의 단일 구현값을 컴포넌트 기본값이나 표준 셸로 자동 승격하지 않는다.
- 3px/9px/13px 같은 고립값이나 유사 화면 사이 불일치는 자동으로 원본 또는 오류라고 단정하지 않는다. `source-error`, `implementation-error`, `intentional-exception`, `normalization-candidate` 중 하나로 판정 근거를 남긴다.
- 셸 종류, 섹션 순서, 링크/배지 의미, 선택 상태와 입력 전환 같은 맥락은 시각적 유사성보다 우선한다.
- 새로운 패턴이 필요해도 먼저 격리된 proposal로 등록한다. 단건 화면 조각을 안정 컴포넌트로 바로 승격하지 않는다.

## 구현 및 검증

`component-library/`에서 다음 순서로 실행한다.

```bash
npm ci
npm run screen:resolve -- <request.json> --out <contract.json>
# generation template이 등록된 계약에서만 실행
npm run screen:generate -- <contract.json> --out <implementation.tsx>
npm run screen:audit -- <contract.json> <implementation.tsx>
npm run check:design-system
npm run lint:design-system
npm run build
```

- 대상 viewport에서 배치·overflow·MES 스타일·동작을 확인한다. 캡처는 불일치 확인이나 요청된 증빙에 사용하며 매번 의무로 만들지 않는다. 짧은 확인은 자동 저장하고 동일 렌더링의 기록을 재사용한다. 원본 재현·정규화는 원본 대조를 생략하지 않는다.
- Checkbox/Radio/Input/Select/취소/X/행 추가·삭제는 실제 상태가 변해야 한다. no-op handler는 검증 통과가 아니다.
- resolver의 `decisionTrace`가 선택·제외 근거를 설명해야 하며, 구조화된 각 섹션은 같은 순서의 `data-section-id`로 구현 감사에 노출한다.
- 경고 한 건으로 화면 전체를 실패시키지 않는다. `blocker`, `warning`, `info`로 분리하고 blocker만 즉시 중단한다.
- 요청 범위 밖 변경은 먼저 필요성을 설명하고 승인받는다.
- 팝업 자체 수정은 `verificationScope: surface`, 부모 선택/저장 연결 작업은 `connected-flow`로 구분한다. 배경을 몰라도 팝업은 MES 공통 미리보기 틀에서 확인·전달할 수 있다. 연동 검증에만 `hostPage`가 필수다. 미확인/실패 차단은 요청 범위에 적용하며, 실제 렌더링되는 부분의 MES 자산 검사는 어느 범위에서도 유지한다. 연동 요청을 임의로 단독 확인으로 축소하지 않는다.

## 완료 표현

- `구현됨`: 코드와 계약이 존재하지만 원본 대조 또는 전체 검증이 남음.
- `검증됨`: 선언한 범위의 구현 검사, MES 규칙 대조, 브라우저 배치·상호작용 확인을 통과함. 원본 재현·정규화는 원본 대조를 포함한다. 캡처·시각 회귀는 실제 실행 여부를 별도로 밝히고 미실행을 실행했다고 표현하지 않는다.
- `배치 완료`: 시작 전에 선언한 배치 전체가 검증됨.
- `전체 완료`: 레지스트리의 queued, in-progress, 미승인, 보류, TODO가 모두 0일 때만 사용.

최종 보고에는 이번 범위 상태, 검증 근거, 남은 작업, 전체 프로젝트 상태를 구분한다.

## 변경 안전

- 작업 전 `git status`를 확인하고 사용자 변경을 보존한다.
- 파일 수정은 의미 단위로 커밋하되, 검증되지 않은 내용을 완료라고 커밋 메시지나 보고에 쓰지 않는다.
- 원격 push는 인증과 사용자 의도를 확인한 뒤 수행한다.
