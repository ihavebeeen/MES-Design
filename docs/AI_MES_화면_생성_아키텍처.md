docs\AI_MES_화면_생성_아키텍처.md
This file uses 'LF' line endings, but Git is configured to convert them to 'CRLF' the next time the file is checked out.

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
