# AI UI Section Pattern 후보 감사 1차

> 기준: [AI UI Section Frame 감사 1차](./AI_UI_Section_Frame_감사_1차.md)  
> 기계 판독 장부: `component-library/src/design-system/registry/composition-section-pattern-ledger.json`  
> 상태: **후보 비교 완료, 표준 승격 전**

## 왜 다시 세었는가

1차 자동 탐지는 파일 안에 Search, Table, grid, add/delete, summary 같은 문자열과 구조가 함께 존재하는지를 찾았다. 이 숫자는 방향을 잡는 데는 유용하지만 실제 Pattern 수와 같지 않다.

- 한 파일에 같은 후보가 여러 번 나타날 수 있다.
- 컴포넌트를 정의한 fixture 파일도 사용 화면처럼 탐지될 수 있다.
- `summary`라는 데이터 필드와 실제 합계 UI를 구분하지 못할 수 있다.
- 버튼 모양만 있고 handler가 없는 경우에도 editable 후보로 잡힐 수 있다.

따라서 P1에서는 파일 수가 아니라 **함수, 상태, 사용자 동작과 실제 렌더 구조**를 기준으로 다시 판정했다.

## 후보별 결론

| 자동 후보 | 자동 탐지 | 수동 판정 | 결론 |
|---|---:|---:|---|
| `section.search-table` | 6개 파일 | 실제 5개 인스턴스 | 조합형 후보 유지 |
| `section.form-grid` | 5개 파일 | 3개 원본 파일의 11개 인스턴스 | FieldRow와 Grid 분리 후보 |
| `section.editable-row-list` | 3개 파일 | 실제 2개 파일의 5개 인스턴스 | UI와 Behavior 분리 후보 |
| `section.inspection-items` | 3개 파일 | 실제 2개 인스턴스 | 검사기준 편집기와 분리 |
| `section.summary` | 9개 파일 | 서로 다른 6개 유형 | 단일 후보 폐기·분해 |

### Search Table

공통 핵심은 `query/filter toolbar + search + table region`이다. 그러나 화면마다 다음 slot이 다르다.

- 페이지 제목·날짜 조회
- GroupQuery
- 일괄 변경 bar
- 선택 행 floating action bar
- 페이지 하단 작업 버튼
- grouped table과 총계행

따라서 하나의 거대한 `SearchTable` 컴포넌트보다 toolbar, bulk action, table, selection action, footer action을 slot으로 조합하는 Section Pattern이 맞다. `mes-screen-fixtures.tsx`는 부품 정의 파일이므로 실제 인스턴스에서 제외했다.

### Form Grid

원본 코드에는 100px와 108px label width, 1열과 2열, 24px와 40px column gap, 10px와 16px row gap이 혼재한다. required 표현도 중복 구현돼 있다.

잠정적으로 다음 두 층을 분리해야 한다.

1. `FieldRow`: label, required marker, control, 보조 action
2. `FormGrid`: columns, label width, density, row/column gap

검사기준 팝업의 70px 수식 편집 행은 일반 Form Grid가 아니라 조건식 편집 Pattern이다. 분석 대시보드의 CSS grid는 폼이 아니므로 오탐이다.

### Editable Row List

실제 동작이 있는 목록은 추가 위치, 삭제 가능 조건, 최소 행 수와 새 행 초기값이 서로 다르다.

- 입력 폼에서 목록 맨 앞에 추가
- 별도 편집 Card에서 목록 끝에 추가
- 행 내부 직접 입력
- 검사 항목 add-only
- 마지막 행이 완성돼야 추가 가능
- 첫 행은 삭제 불가
- 직전 행의 거래처만 계승

행 렌더링 Section Pattern과 `add/remove/validate/inherit` Behavior를 한 계약으로 묶지 않는다. `original-mes-screen-assets.tsx`의 정적 행과 handler 없는 항목 추가 버튼은 동작 근거에서 제외했다.

### Inspection Items

검사항목 목록은 `항목명 + 필수 상태 + 판정 control`이 공통이다. 검색·정렬, 일괄 판정, 항목 추가와 empty state는 variant 또는 별도 Behavior 후보다.

`inspection-criteria-pattern.tsx`는 한 검사항목의 합격 기준식을 작성하는 편집기이므로 검사항목 목록과 다른 Pattern이다.

### Summary 분해

`section.summary`라는 이름으로는 의미가 너무 넓었다. 다음으로 분해한다.

1. `summary.table-total-row`: 표 컬럼과 정렬되는 총계행
2. `summary.result-total-card`: 불량계·가동시간 같은 단일 결과 Card
3. `summary.quantity-status-card`: 실적/분배/잔여처럼 관계가 있는 복수 수량
4. `summary.dashboard-metric-card`: 기간 맥락과 차트·비교를 갖는 대시보드 지표
5. `summary.before-after-comparison`: 변경 전/후 비교

다음은 Summary 출력 UI가 아니다.

- 화면 설명용 `summary` 문자열
- gallery metadata의 `summary` 필드
- panel id가 `summary`인 것
- 컬럼의 합계 표시 여부를 설정하는 toggle/count

`before-after-comparison`은 현재 원본 한 건뿐이므로 계속 `migration-hold`로 둔다.

## AI 생성에 바로 적용할 판정

- 후보 이름이 검색됐다는 이유만으로 Pattern을 사용하지 않는다.
- `search-table`은 필요한 slot을 먼저 열거한 뒤 가장 가까운 Recipe 조합을 선택한다.
- 폼은 label/control 행과 전체 grid를 분리해서 결정한다.
- 행 추가·삭제·계승은 Section 외형이 아니라 Behavior reference로 선택한다.
- `summary`를 생성 요청에 직접 쓰지 않고 semantic subtype을 명시한다.
- 생성 후보에서만 확인된 차이는 표준 자동 승격 근거로 사용하지 않는다.

## 다음 단계

P1 Behavior 후보를 같은 방식으로 감사한다.

1. `selection.enable-editor`를 행 선택 편집·마스터–상세·단순 활성화로 분해
2. `dismiss.restore-committed`의 취소·X·Esc 동작 비교
3. `row.add-remove`의 추가 가능 조건과 삭제 후 상태 비교
4. `row.inherit-previous`를 공통 Behavior로 볼 근거가 있는지 확인

이 감사 전에는 후보를 `patterns.json`에 등록하거나 공용 컴포넌트로 추출하지 않는다.
