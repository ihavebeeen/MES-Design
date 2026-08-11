# AI UI 입고등록 파일럿 이관

> 승인일: 2026-08-11  
> Recipe: `completed.receiving`  
> 화면: 입고등록 · 우측 슬라이드 팝업  
> 상태: 파일럿 이관 및 자동 검증

## 승인 범위

이번 파일럿에서는 아래 3개만 정식 패턴으로 승인했다.

| ID | 역할 | 구현 |
|---|---|---|
| `frame.standard-section` | 섹션 padding·divider·background 소유 | `SectionFrame` |
| `section.form-grid` | 폼 열·간격·label/control·required 정렬 소유 | `FormGrid`, `FormFieldRow` |
| `dismiss.restore-committed` | 취소 계열 동작에서 저장 전 상태 복원 | `SideSlidePanel.onCancel` + committed snapshot |

`section.search-table-composition`, gray entry card, row mutation 등 나머지 후보는 승인하지 않았으며 이번 이관에서 새 표준으로 추출하지 않았다.

## 이관 내용

- 기존 `popup.side.add-list` Shell과 900px 우측 슬라이드 규격은 유지했다.
- 기본정보 영역을 `SectionFrame`과 `FormGrid` 조합으로 교체했다.
- LOT 단위 품목 입력 내부 정렬에는 승인된 `FormGrid`를 적용했지만, 회색 입력 카드 외곽은 미승인 후보이므로 기존 화면 로컬 구조로 유지했다.
- 저장은 현재 draft를 committed snapshot으로 갱신한다.
- 취소 버튼, 우상단 X, Esc, backdrop은 모두 같은 `onCancel` 경로로 committed snapshot을 복원한 뒤 닫는다.
- 화면의 문구·업무 필드·테이블과 Shell 유형은 바꾸지 않았다.

## 자동 검증

- 전용 경로: `/visual-regression/receiving-pilot`
- 정적 검사: TypeScript, registry 무결성, pattern component reuse
- 상호작용: 수량 변경, 행 추가, 저장, 재수정, 취소 후 직전 저장값·행 복원
- 레이아웃: `SectionFrame` 20px padding과 bottom divider, 본문 가로 overflow 0
- 시각 회귀: `receiving-pattern-pilot.png`

## 다음 판단

파일럿이 통과하더라도 나머지 화면을 자동 이관하지 않는다. 다음 승인에서는 이 화면에서 확인된 API의 재사용 가능성, 원본 시각 차이, 취소 상태 소유 위치를 검토한 뒤 후보별로 승인한다.
