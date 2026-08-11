# AI UI 표준 후보 제안 1차

> Section 제안: `component-library/src/design-system/registry/section-pattern-proposals.json`  
> Behavior 제안: `component-library/src/design-system/registry/behavior-pattern-proposals.json`  
> 상태: **proposed-not-approved**

수동 감사 결과를 표준 후보 형태로 작성했다. 이 문서는 구현 완료 보고서가 아니라 승인 검토 목록이다. 현행 `patterns.json`, 공용 UI 컴포넌트와 화면 코드는 변경하지 않았다.

## Section·Frame 제안 8개

1. `frame.standard-section`
2. `section.search-table-composition`
3. `section.form-grid`
4. `section.editable-row-list`
5. `section.inspection-items`
6. `summary.table-total-row`
7. `summary.result-total-card`
8. `summary.quantity-status-card`

각 제안은 코드 source와 Figma node, 소유 책임, slots, states, variants, 금지 조건과 기존 코드 이관 영향을 기록한다.

## Behavior 제안 5개

1. `selection.reveal-inline-editor`
2. `selection.enable-actions`
3. `selection.master-detail`
4. `dismiss.restore-committed`
5. `row.mutation-policy`

Behavior는 UI 모양이 아니라 이벤트와 상태 전이 계약으로 작성했다. 특히 취소 복원은 cancel, X, Esc, backdrop을 같은 dismiss 경로로 묶는 것을 필수 조건으로 둔다.

## 계속 보류하는 항목

- gray entry card Frame
- collapsible Frame
- list region
- before/after comparison
- visual-only selection
- 직전 행 값 계승
- section 접기/펼치기

보류 항목은 나쁜 구현이라는 뜻이 아니다. 반복 근거가 부족하거나 현재 후보 간 차이가 아직 variant로 설명되지 않았다는 뜻이다.

## 승인 뒤 파일럿 순서

1. `frame.standard-section`, `section.form-grid`, `dismiss.restore-committed`를 먼저 확정
2. 검증된 우측 슬라이드 팝업 `completed.receiving` 한 개 이관
3. `section.search-table-composition`, selection subtype을 확정
4. 검증된 중앙 팝업 한 개 이관
5. 기존 시각 회귀·상호작용·overflow 결과와 비교

이지모드 입고등록은 표준 추출 근거에서 제외하고, 확정된 조합 문법이 후보 화면을 얼마나 개선하는지 검증하는 대상으로만 사용한다.

## 승인 시 결정할 사항

- 8개 Section·Frame 제안을 전부 승인할지, 파일럿 3개만 먼저 승인할지
- `SectionBand`를 바로 제거할지, 호환 wrapper로 유지할지
- label width 100/108px을 하나로 정규화할지 variant로 유지할지
- 첫 중앙 팝업 파일럿을 어느 원본으로 선택할지

승인 전에는 proposal registry의 상태를 바꾸거나 구현 파일을 추출하지 않는다.
