# AI UI Behavior 후보 감사 1차

> 기준: [AI UI Section Pattern 후보 감사 1차](./AI_UI_Section_Pattern_후보_감사_1차.md)  
> 기계 판독 장부: `component-library/src/design-system/registry/composition-behavior-ledger.json`  
> 상태: **상태 전이 비교 완료, 표준 승격 전**

## 핵심 결론

자동 탐지된 Behavior 이름은 대체로 너무 넓었다. `selectedIds`가 있다는 사실, Plus/Trash 아이콘이 같이 있다는 사실만으로 실제 동작 계약을 설명할 수 없다.

| 자동 후보 | 판정 |
|---|---|
| `selection.enable-editor` | 선택 결과에 따라 4개 subtype으로 분해 |
| `dismiss.restore-committed` | Shell 기반 3건 검증, standalone 1건은 부모 계약 필요 |
| `row.add-remove` | create/addGuard/insert/delete/postDelete로 분해 |
| `row.inherit-previous` | 생성 후보 한 건이므로 migration hold |

## Selection 분해

`selection.enable-editor`는 폐기할 이름이다. 같은 행 선택이라도 결과가 다르다.

1. `selection.reveal-inline-editor`
   - 선택 행에만 Input, Select, DatePicker를 표시한다.
   - 일부 화면은 선택 행을 목록 상단으로 정렬한다.
2. `selection.enable-actions`
   - 선택 ID와 선택 개수를 삭제·이동 같은 batch action에 전달한다.
3. `selection.master-detail`
   - active master row가 detail region의 데이터 컨텍스트를 바꾼다.
4. `selection.visual-only`
   - 체크 상태는 저장하지만 현재 코드에서 editor나 action enabled state를 바꾸지 않는다.
   - 미완성 동작일 수 있으므로 표준 Behavior 근거로 사용하지 않는다.

AI는 `selection: true`를 출력해서는 안 된다. 선택 후 어떤 상태가 파생되는지를 Behavior ID로 지정해야 한다.

## 취소·X·Esc 복원 감사

`CenterModal`과 `SideSlidePanel`은 다음 경로를 하나의 `dismiss()`로 모은다.

- Footer action 중 `id="cancel"`
- 우상단 X
- Esc
- backdrop click

`dismiss()`는 `onCancel`을 실행한 뒤 `onOpenChange(false)`를 호출한다.

### 검증된 사용처

- 이지모드 입고등록: 날짜·행·선택항목·메모의 committed snapshot 복원
- 검사기준: draft를 committed 기준으로 복원
- 원본 팝업 gallery: dialog key/version을 바꿔 remount reset

검사기준의 custom footer 취소 버튼은 Shell action을 사용하지 않지만 `cancel()` 후 닫기를 직접 호출해 같은 결과를 만든다.

`TableColumnSettings`는 별도 overlay로, `onCancel`과 `onClose`가 분리돼 있고 내부 committed snapshot이 없다. 부모가 둘을 같은 복원 동작으로 연결하지 않으면 취소와 X가 달라질 수 있다. 따라서 공통 복원 Behavior의 검증 사례가 아니라 **부모 계약 필요** 상태다.

## 행 추가·삭제 계약

현재 코드에서 실제 동작하는 5개 사례를 비교했다.

| 사례 | 추가 위치 | 추가 조건 | 삭제 정책 | 초기값 |
|---|---|---|---|---|
| 생산실적 | 앞 | 없음 | 모든 행 | 입력 폼 + fallback |
| 입고실적 | 앞 | 없음 | 모든 행 | 입력 폼 |
| 커스텀 정보 | 뒤 | 없음 | 모든 행 | 별도 editor draft |
| 검사항목 | 뒤 | 없음 | 삭제 없음 | 자동 이름 + 미판정 |
| 이지모드 입고 | 뒤 | 직전 행 완성 | 최소 1행 유지 | 빈 행 + 직전 거래처 |

따라서 `addable/removable: true`만으로는 부족하다. 최소 계약은 다음 항목을 가져야 한다.

- `createInitialValues`
- `addGuard`
- `insertPosition`
- `deletePolicy`
- `postDelete`

handler 없이 정적 행과 버튼만 있는 원본 자산은 Behavior 근거에서 제외한다.

## 직전 행 값 계승

현재 구현은 새 이지모드 입고 행에 직전 행의 `customer`만 복사한다.

- 새 행을 만드는 순간에만 복사
- 이후 이전 행을 바꿔도 동기화하지 않음
- warehouse, item, quantity, lot은 복사하지 않음

이 규칙은 사용자가 직접 요구한 화면 동작으로는 유효하지만 원본 반복 근거가 없다. 공통 `row.inherit-previous`로 승격하지 않고 이 화면의 ScreenSpec local rule로 유지한다. 추후 승격한다면 복사 허용 필드를 allowlist로 명시해야 한다.

같은 이유로 이지모드의 `section.toggle-collapse`도 아직 공통 Behavior가 아니다.

## 다음 단계

Shell, Section Frame, Section Pattern, Behavior의 관찰 장부가 생겼다. 이제 바로 공용 코드를 대규모 추출하지 않고 다음 순서로 진행한다.

1. 장부에서 표준 제안 가능한 항목과 migration hold를 분리
2. `section-pattern-proposals`와 `behavior-pattern-proposals` 작성
3. 제안마다 근거 화면, slots, states, 금지 조건과 호환 영향을 기록
4. 사용자 승인 뒤 중앙 팝업 1개와 우측 슬라이드 1개에 파일럿 적용

승인 전까지 현행 UI와 `patterns.json`을 자동 변경하지 않는다.
