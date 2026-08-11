# AI UI Shell·슬롯 감사 1차

> 기준 정책: [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)
> 구조화 원본: `component-library/src/design-system/registry/composition-shell-ledger.json`
> 상태: 코드 관찰 완료, 표준 확정 전

## 핵심 정정

1차 얕은 조사에서는 JSX 태그 수를 기준으로 Shell 인스턴스를 13개로 계산했다. 수동 감사 결과 하나의 JSX 호출부가 설정 배열과 조건 분기로 여러 화면을 렌더링하고 있었다.

| 항목 | 수 |
|---|---:|
| JSX Shell 호출부 | 13 |
| 실제로 구분되는 화면 Recipe | 28 |
| CenterModal Recipe | 19 |
| SideSlidePanel Recipe | 8 |
| ConfirmDialog Recipe | 1 |

따라서 후속 감사 단위는 JSX 호출부가 아니라 Recipe다.

## Shell 공통 소유 책임

### CenterModal

- overlay와 중앙 배치
- 제목·닫기 버튼이 있는 Header
- 기본 `px-5 pt-5 overflow-y-auto` Body
- Footer slot과 기본 cancel-save 액션
- 취소·X·Esc·배경 클릭의 dismiss 경로

### SideSlidePanel

- overlay와 우측 고정·전체 높이
- 제목·닫기 버튼이 있는 Header
- 기본 `px-5 pt-5 overflow-y-auto` Body
- Footer slot과 기본 cancel-save 액션
- dismiss 경로

### ConfirmDialog

- 작은 중앙 확인 팝업의 overlay·배치
- Header와 기본 메시지 Body
- 선택 Banner와 Footer slot
- 기본 confirm-only 액션

## Recipe 분포

| 출처 | Center | Side | Confirm | 합계 |
|---|---:|---:|---:|---:|
| `completed-popup-patterns.tsx` | 11 | 5 | 0 | 16 |
| `source-popup-gallery.tsx` | 7 | 0 | 0 | 7 |
| `original-mes-screen-assets.tsx` | 0 | 2 | 0 | 2 |
| `easy-mode-receiving-pattern.tsx` | 0 | 1 | 0 | 1 |
| `inspection-criteria-pattern.tsx` | 1 | 0 | 0 | 1 |
| `production-quantity-reregistration-pattern.tsx` | 0 | 0 | 1 | 1 |

## ActionSet 관찰

다음 조합이 발견됐다.

- `cancel-save`
- `save-only`
- `none`
- `cancel-confirm`
- `cancel-input`
- `close-only`
- `cancel-select`
- `cancel-save-disabled`
- `cancel-save-validated`
- `close-reregister`

현재는 대부분 raw `actions` 배열이며 의미 기반 ActionSet Registry가 아니다. 검사기준과 생산수량 재등록은 custom footer까지 사용한다. 따라서 Footer는 Shell slot으로 유지하되 ActionSet을 별도 Behavior/구성 계약으로 구조화할 필요가 있다.

## Scroll·padding 관찰

- Shell 기본값은 Body가 `overflow-y-auto`와 20px 좌우·상단 padding을 소유한다.
- 여러 화면이 `contentClassName`으로 `p-0`, `overflow-hidden`, `!overflow-y-hidden`을 함께 덮어쓴다.
- `contentClassName` 하나가 정렬, padding, overflow 책임을 모두 바꾸므로 AI가 사용 조건을 판단하기 어렵다.
- 후속 설계에서는 `bodyPadding`, `scrollMode`, `bodyAlign`처럼 의미가 분리된 계약 후보를 검토한다.

## 즉시 표준화하지 않는 항목

다음은 오류 또는 신규 variant로 바로 확정하지 않는다.

1. Source popup의 preset 이후 pixel width override
2. 품목 상세정보의 `headerDivider=false`
3. ConfirmDialog와 다른 Shell의 overlay 농도 차이
4. custom footer 2종
5. 가동·비가동 선택의 독립·중첩 진입 경로
6. `contentClassName`의 scroll ownership override

각 항목은 Figma 근거와 반복 사용 목적을 확인한 뒤 `keep`, `normalize`, `needs-review`로 판단한다.

## 다음 감사 범위

Shell 외곽 자체보다 Body 내부 Section Frame의 차이가 더 크다. 다음 순서는 아래 세 파일의 섹션 경계, 제목, padding, divider와 scroll 장부다.

1. `completed-popup-patterns.tsx`
2. `original-mes-screen-assets.tsx`
3. `easy-mode-receiving-pattern.tsx`
