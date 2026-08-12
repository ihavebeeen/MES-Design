# AI UI 표준 후보 판정 결과

> 판정일: 2026-08-12
> 상태: resolved

## 승인된 Section·Frame

- `frame.standard-section`
- `section.search-table-composition`
- `section.form-grid`
- `section.editable-row-list`
- `section.inspection-items`
- `summary.table-total-row`
- `summary.result-total-card`

각 항목은 둘 이상의 원본 화면 또는 검증된 업무 Recipe에서 반복되는 구조와 책임을 확인했다. 승인된 항목은 `patterns.json`과 실제 공용 코드에 함께 등록했다.

## 승인된 Behavior

- `selection.reveal-inline-editor`
- `selection.enable-actions`
- `selection.master-detail`
- `dismiss.restore-committed`
- `row.mutation-policy`

Behavior는 모양이 아니라 stable ID, 상태 전이, 이벤트, 취소 복원처럼 상호작용 계약을 소유한다.

## 공용 승격하지 않은 항목

- `summary.quantity-status-card`: 선발행 라벨 화면 한 건의 Recipe 로컬 조합
- gray entry card: 화면별 정보 위계가 달라 공용 Frame으로 묶지 않음
- collapsible Frame / section toggle: 생성 후보 한 건뿐이며 원본 반복 근거 없음
- list region: `section.search-table-composition`에 통합
- before/after comparison: 생산수량 재등록 Recipe 로컬 조합
- visual-only selection: Behavior가 아닌 Table 시각 상태
- row.inherit-previous: 이지모드 ScreenSpec의 거래처 기본값 규칙

공용 승격 거절은 구현 삭제를 의미하지 않는다. 해당 화면에서는 사용할 수 있지만 다른 화면을 생성할 때 자동 근거로 사용하지 않는다는 뜻이다.

## 파일럿 결과

- 우측 슬라이드: `completed.receiving`
- 중앙 팝업: `batch-work-order`
- 생성 후보 재구성: `easy-mode-receiving`

세 화면 모두 Shell과 본문 Pattern을 분리했고, 중앙 팝업에서는 체크 선택 후 편집 컨트롤 노출과 숫자 입력을 자동 테스트한다. 전체 시각 회귀 테스트 23건이 통과했다.
