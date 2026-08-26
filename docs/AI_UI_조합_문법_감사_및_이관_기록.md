# AI UI 조합 문법 감사 및 이관 기록

이 문서는 2026-08-11~12에 수행한 조합 구조 감사, 후보 판정, 사용자 승인과 코드 이관 결과를 한곳에 보존한다. 현재 규칙의 원본은 이 문서가 아니라 레지스트리와 [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)이다.

## 감사가 필요했던 이유

초기 패턴은 화면 단위 이름에 가까웠다. 그 결과 중앙 팝업과 우측 슬라이드의 외곽, 내부 섹션, 테이블 조합, 선택 후 편집과 취소 복원 같은 책임이 한 컴포넌트에 섞였다. 등록된 Button과 Table을 사용해도 MES에 없던 배치가 만들어질 수 있었다.

감사 후 조합 단위를 다음처럼 바꿨다.

```text
ScreenSpec
  = Shell
  + SectionFrame / SectionPattern
  + Behavior
  + ActionSet
  + 화면별 데이터와 문구
```

## 1차 감사 범위

| 감사 | 당시 확인 내용 | 결론 |
|---|---|---|
| 자동 조합 인벤토리 | 41개 파일, 8,250줄의 구조·이름 후보 | 정규식 결과는 후보일 뿐 표준이 아님 |
| Shell·슬롯 | 실제 Recipe 28개: 중앙 19, 우측 8, 확인 1 | overlay·header·body·footer·dismiss를 Shell 책임으로 분리 |
| Section Frame | 혼합 파일 3개, 논리 Frame 25개 | padding·divider·background·scroll을 제목 컴포넌트와 분리 |
| Section Pattern | 검색 테이블, 폼 그리드, 편집 행, 검사항목, 요약 형태 | 화면 이름이 아니라 재사용 가능한 역할로 판정 |
| Behavior | 선택, 취소 복원, 행 추가·삭제·초기값 | 시각 패턴에 숨기지 않고 대상과 상태 전이로 분리 |

당시 자동 탐지는 반복 위치를 찾는 용도로만 사용했다. `composition-inventory.json`의 상태가 `observed-not-canonical`인 이유도 자동 발견과 승인된 표준을 구분하기 위해서다.

## 승인된 조합

### Section·Summary

- `frame.standard-section`
- `section.search-table-composition`
- `section.form-grid`
- `section.editable-row-list`
- `section.inspection-items`
- `summary.table-total-row`
- `summary.result-total-card`

### Behavior

- `selection.reveal-inline-editor`
- `selection.enable-actions`
- `selection.master-detail`
- `dismiss.restore-committed`
- `row.mutation-policy`

`취소`, 우상단 `X`, `Esc`, backdrop는 같은 dismiss 경로를 사용하고 저장 전 편집 상태를 폐기한다. 행 추가 정책은 초기값 생성, 추가 조건, 삽입 위치, 삭제 정책과 삭제 후 상태를 설정으로 가진다.

## 공용으로 승격하지 않은 항목

- 수량 상태 카드와 회색 입력 카드는 한정된 화면 근거만 있어 화면 로컬 조합으로 유지했다.
- 접이식 Frame은 확인된 사용례가 부족해 보류했다.
- `before-after`는 단독 표준 패턴으로 만들지 않았다.
- 선택됐지만 편집 상태가 바뀌지 않는 시각 표시만의 행은 별도 Behavior로 만들지 않았다.
- 직전 거래처 계승은 이지모드 입고등록의 `row.mutation-policy` 설정으로만 유지했다.
- 화면 높이는 콘텐츠와 Shell의 책임이므로 Section Frame 기본 API에 포함하지 않았다.

## 입고등록 파일럿

첫 파일럿은 입고등록 계열에 다음 세 계약만 우선 적용했다.

- `frame.standard-section`
- `section.form-grid`
- `dismiss.restore-committed`

900px 우측 슬라이드 Shell은 유지했고, 열린 시점의 committed snapshot과 편집 draft를 분리했다. 이 결과는 다른 화면을 자동 이관하는 근거로 사용하지 않고 후속 Recipe 감사의 기준으로만 사용했다.

## 이관 결과

- 모든 화면은 `Shell + Section + Behavior + ActionSet`을 복수 참조할 수 있다.
- 기존 화면 단위 패턴은 호환용 Recipe 계층으로 남기고 세분 패턴을 추가했다.
- 패턴 파일의 물리적 폴더 이동은 import churn만 커서 하지 않았다. 논리 분류는 Registry가 담당한다.
- 대표 ScreenSpec과 generation template이 Section 순서와 필수 조합을 소유한다.
- 빈 참조, 중복 ID, 미등록 참조와 미종결 제안은 레지스트리 검사에서 차단한다.

## 현재 원본

- `composition-policy.json`: 계층·승인·이관 정책
- `composition-inventory.json`: 자동 관찰 결과
- `composition-shell-ledger.json`: Shell 감사 장부
- `composition-section-frame-ledger.json`: Frame 감사 장부
- `composition-section-pattern-ledger.json`: Section 후보 판정
- `composition-behavior-ledger.json`: Behavior 후보 판정
- `section-pattern-proposals.json`, `behavior-pattern-proposals.json`: 제안과 종결 상태
- `patterns.json`, `pattern-contracts.json`, `screen-specs.json`: 현재 사용 가능한 계약

새 후보는 반복되었다는 이유만으로 자동 승격하지 않는다. 기존 조합으로 표현 가능한지, 정보 위계와 상태 전이가 실제로 다른지, 사용자 승인 근거가 있는지를 먼저 확인한다.
