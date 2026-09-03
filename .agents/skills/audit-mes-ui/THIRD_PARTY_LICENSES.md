# 출처와 라이선스 기록

확인일: 2026-09-03. 아래 공개 저장소의 `main` 및 공식 문서를 읽고 **판단 원리와 역할 분리만 참조**했다. 외부 SKILL의 문장·코드·템플릿·이미지는 이 스킬에 복사하지 않았다. MES 질문·모드·보고 양식은 사용자 요구와 현재 저장소 계약을 기준으로 별도로 작성했다.

이 파일은 출처 기록이며 MES 저장소의 라이선스를 변경하거나 공개 배포를 허가하지 않는다. 아래 라이선스는 **원본**에 적용된다. 추후 외부 파일/문장을 실제 포함·개작해 배포할 때는 해당 시점의 라이선스 전문, 저작권/NOTICE, 변경 고지 등 필요한 조건을 별도로 확인하고 보존한다. 출처 링크 하나로 모든 재배포 의무를 대신한다고 가정하지 않는다.

## 신뢰성의 범위

- GitHub 별/포크는 관심의 지표다. 실제 설치/사용자 수, 특정 스킬의 품질 실험 또는 MES 적합성의 증명이 아니다.
- 공식 공급자 스킬도 그대로 적용하면 범위 과잉이 생긴다. **채택 이유와 제외 이유를 함께** 기록한다.
- 현재 파일은 날짜가 지정된 조사 결과이지 upstream의 특정 commit을 vendoring한 번들이 아니다. 업데이트 때 출처 변경을 다시 확인한다.
- 이 MES 스킬의 효용은 실제 사용/회귀 사례로 검증해야 한다. 구조 검사 통과를 UX 품질의 실증 검증으로 표현하지 않는다.

## S1 Anthropic

- 원본: [knowledge-work-plugins / design-critique](https://github.com/anthropics/knowledge-work-plugins/blob/main/design/skills/design-critique/SKILL.md).
- 라이선스: [Apache-2.0](https://github.com/anthropics/knowledge-work-plugins/blob/main/LICENSE).
- 공개 신호: [저장소](https://github.com/anthropics/knowledge-work-plugins)는 확인 시 약 23.8k stars. **전체 플러그인 저장소** 수치이며 design-critique 개별 사용량은 확인하지 못했다.
- 채택: 디자인 단계에 맞는 피드백, 시선/읽기 순서, 구체적 문제와 이유, 보존할 장점.
- 반영: `SKILL.md`의 모드 우선 분류, `poc-review.md`의 읽기 순서·시각적 구별·여백 질문과 이유가 연결된 장단점 보고.
- 제외: 모든 단계에 같은 범주별 표/접근성 판정을 출력하는 형식. POC에는 사용자 지정 질문과 3/3/1 상한을 적용한다.

## S2 Impeccable

- 원본: [pbakaus/impeccable](https://github.com/pbakaus/impeccable), [critique](https://github.com/pbakaus/impeccable/blob/main/skill/reference/critique.md), [audit](https://github.com/pbakaus/impeccable/blob/main/skill/reference/audit.md).
- 라이선스: [Apache-2.0](https://github.com/pbakaus/impeccable/blob/main/LICENSE); [NOTICE](https://github.com/pbakaus/impeccable/blob/main/NOTICE.md)도 확인했다. 플랫폼별 참조 파일은 가져오지 않았다.
- 공개 신호: 확인 시 약 65.0k stars. 개별 audit의 MES 품질 벤치마크를 확인한 것은 아니다.
- 채택: 디자인 비평과 코드 수준 검사 구분, 제품 맥락·그룹화·위계 판단을 자동 탐지와 구분, 중요한 수정부터 제시.
- 반영: 모드별 참조 분리, 구현 감사에서 디자인 판단 후 진단, POC의 배치·표현 선택에 대한 절충 검토. 최소 수정은 가장 중요한 문제를 선택한 뒤 적용하며, 쉬운 수정부터 고르는 규칙이 아니다.
- 제외: 모든 평가의 점수 합산, 선택지/그룹 개수의 고정 상한, 보편적인 폰트·색상 취향 규칙, detector/별도 에이전트/브라우저 주입/스냅샷 저장 강제. MES 밀도·전문 용어·기존 자산을 대체하지 않는다.

## S3 NN/g

- 원본: [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [Severity Ratings](https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/).
- 이용 방식: 공식 UX 원칙을 개념 참조했다. 오픈소스 SKILL로 취급하지 않으며 기사·포스터·도표를 복제하지 않는다.
- 채택/반영: #2 업무에 익숙한 의미 → 업무 대상/용어, #4 일관성 → 기존 필터·표·액션 역할, #6 인지 단서 → 관계를 화면에서 읽기, #7 효율 → 숙련자의 비교 밀도, #8 불필요한 정보 경쟁 → 중복 필드 검토. `poc-review.md`의 질문에 연결한다.
- 구현 모드에서는 상태·회복 및 영향/빈도/회복 가능성을 참조한다. 해당 원칙을 “필드 몇 개 이하”, “한 건은 카드”, “항상 여백 확대” 같은 수치 처방으로 바꾸지 않는다.

## S4 GOVUK

- 원본: [How the alpha phase works](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works).
- 라이선스/출처: 페이지 표시 [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/), © Crown copyright. 문장/서식은 복제하지 않았다.
- 채택: 초기 시안이 답해야 할 질문에 집중하고 운영 코드의 전체 기술 검사와 구별하는 관점.
- 반영: POC에서 증적/기능 부재를 실패로 처리하지 않음.
- 한계: GOV.UK alpha가 이 회사의 POC와 같은 절차라는 주장이 아니다. “디자인·배치를 빠르게 확인하는 POC”라는 정확한 정의와 기능 제외 목록은 **사용자 정책**이다. 접근성/운영 검사를 프로젝트에서 영구 면제한다는 뜻도 아니다.

## S5 W3C

- 원본: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Easy Checks — A First Review](https://www.w3.org/WAI/test-evaluate/preliminary/).
- 이용 방식: 공식 표준/평가 설명을 참조하고 해당 페이지의 저작권·문서 이용 조건을 따른다. 표준 전문·표·자료는 포함하지 않았다.
- 채택: 요청한 접근성 검사를 성공 기준과 연결하고, 부분/자동 검사로 전체 적합성을 주장하지 않음.
- 반영: `mes-audit-rubric.md`의 접근성 근거와 `report-contract.md`의 미확인 분리.
- 제외: POC에서 키보드/초점/스크린리더 검사를 기본 강제하는 것. 접근성 전용 요청은 별도 범위로 다룬다.

## S6 OpenAI

- 원본: [role-specific-plugins / product-design / audit](https://github.com/openai/role-specific-plugins/blob/main/plugins/product-design/skills/audit/SKILL.md), [design-qa](https://github.com/openai/role-specific-plugins/blob/main/plugins/product-design/skills/design-qa/SKILL.md).
- 라이선스: 현재 참조 저장소의 [MIT License](https://github.com/openai/role-specific-plugins/blob/main/LICENSE)를 확인했다. 이전 기록의 `openai/plugins` 경로 및 “root license 미확인”은 현재 출처로 대체한다.
- 채택: 관찰한 대상과 결론 연결, 제품 평가와 원본 대비 구현 QA의 구별.
- 반영: 공통 근거 규칙, 구현 모드의 같은 상태 비교 및 한계 보고.
- 제외: 모든 POC에 흐름 완주·새 캡처·증적 기록을 강제하거나 QA 실패를 디자인 방향의 실패로 취급하는 것. 평가 요청에서 자동 수정을 시작하지 않는다.

## 이전/비채택 후보

### atuizz/codex-ui-ux-skill

- [원본](https://github.com/atuizz/codex-ui-ux-skill), [MIT](https://github.com/atuizz/codex-ui-ux-skill/blob/main/LICENSE).
- 확인 시 1 star, README의 with-skill/baseline 전체 비교 벤치마크는 미완료 표시였다.
- 업무 맥락을 먼저 파악하는 관점은 참고할 수 있으나 **널리 사용되고 검증된 스킬의 주 근거로 삼지 않는다**. 종전의 포괄적 기능/상태/모바일 게이트는 POC에 적용하지 않는다.

### UI UX Pro Max

- [원본](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [MIT](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/LICENSE).
- 확인 시 약 124.3k stars. 다양한 스타일·팔레트·타이포·차트 등을 제공하는 생성 중심 자료로 검토했다.
- 이번 AUDIT에는 DB·검색 엔진·스타일 처방을 가져오지 않았다. 기존 MES 시안의 디자인 평가를 범용 스타일 추천으로 바꾸는 것은 이번 목적과 다르다.

## MES 자체 정책과 출처 경계

세 모드의 정확한 이름/기본값, POC 제외 목록, 3/3/1 결과 형식, 부산물 팝업 질문, 승인 자산/ScreenRequest/receipt/승격 권한은 외부 스킬의 권위가 아니라 사용자 요구와 이 저장소 계약에서 나온다.

POC 심화 규칙인 검토 범위와 출력 개수의 분리, 장점의 업무상 근거, 디자인 선택의 절충, 영향 우선 선정 후 최소 수정은 사용자와 합의한 보완 방향이다. 위 S1–S3의 기존 개념 참조를 MES 질문으로 구체화한 것이며 외부 문장/체크리스트를 추가 수입한 것은 아니다. 기능 검사 제외와 짧은 보고 형식은 유지한다.

부산물 생산일자 제거는 모든 MES 화면의 규칙이 아니다. 같은 의미의 필드라는 근거와 현재 시안이 있을 때만 판단한다. 한 건 표 역시 금지 규칙이 아니다. 이 경계는 [회귀 사례](evals/scenarios.md)에서 함께 확인한다.
