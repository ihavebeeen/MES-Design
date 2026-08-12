# AI UI 조합 인벤토리 1차

이 문서는 `npm run audit:composition`으로 생성되는 얕은 전수조사 결과다. 자동 탐지값은 표준 패턴이 아니라 2차 검토 후보이며, 이 결과만으로 파일을 이동하거나 기존 패턴을 승격하지 않는다.

## 조사 범위

| 항목 | 결과 |
|---|---:|
| 검사 파일 | 26 |
| 전체 줄 수 | 4,962 |
| 혼합 Section Frame 파일 | 2 |
| 표준 Frame 없이 native section만 사용 | 9 |
| rounded wrapper가 있는 Section 후보 파일 | 13 |
| fingerprint | `d17a1b680c243195` |

## Shell 사용

| Shell | 인스턴스 |
|---|---:|
| CenterModal | 4 |
| SideSlidePanel | 8 |
| ConfirmDialog | 1 |

## Section Frame 관찰값

| 표현 방식 | 사용 횟수 |
|---|---:|
| sectionBand | 14 |
| sectionHeader | 7 |
| patternGroupHeader | 0 |
| nativeSection | 26 |
| dividerContainer | 21 |
| roundedContainer | 45 |
| gray20Container | 24 |

## 자동 탐지 Section 후보

| 후보 | 파일 수 | 주요 소스 |
|---|---:|---|
| `section.summary` | 10 | `completed-application-patterns.tsx`, `completed-popup-expanded-content.tsx`, `completed-popup-patterns.tsx`, `exact-production-analytics-screen.tsx` |
| `section.search-table` | 7 | `equipment-inspection-records-modal.tsx`, `exact-form-management-screen.tsx`, `exact-inventory-add-modal.tsx`, `exact-inventory-edit-modal.tsx` |
| `section.inspection-items` | 6 | `completed-popup-patterns.tsx`, `equipment-inspection-records-modal.tsx`, `inspection-criteria-pattern.tsx`, `original-mes-screen-assets.tsx` |
| `section.form-grid` | 4 | `completed-popup-patterns.tsx`, `exact-production-analytics-screen.tsx`, `inspection-criteria-pattern.tsx`, `original-mes-screen-assets.tsx` |
| `section.editable-row-list` | 3 | `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `original-mes-screen-assets.tsx` |
| `section.before-after` | 1 | `production-quantity-reregistration-pattern.tsx` |

## 자동 탐지 Behavior 후보

| 후보 | 파일 수 | 주요 소스 |
|---|---:|---|
| `selection.enable-editor` | 11 | `completed-application-patterns.tsx`, `completed-popup-expanded-content.tsx`, `completed-popup-patterns.tsx`, `equipment-inspection-records-modal.tsx` |
| `dismiss.restore-committed` | 5 | `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `inspection-criteria-pattern.tsx`, `source-popup-gallery.tsx` |
| `row.add-remove` | 3 | `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `original-mes-screen-assets.tsx` |
| `row.inherit-previous` | 1 | `easy-mode-receiving-pattern.tsx` |
| `selection.master-detail` | 1 | `completed-application-patterns.tsx` |

## 우선 검토 파일

| 파일 | 줄 수 | Shell | Section 후보 | 검토 플래그 |
|---|---:|---|---|---|
| `completed-popup-patterns.tsx` | 1029 | CenterModal 1, SideSlidePanel 5 | section.editable-row-list, section.form-grid, section.inspection-items, section.summary | mixed-section-frame-mechanisms, rounded-wrapper-around-section-candidate |
| `completed-popup-expanded-content.tsx` | 526 | CenterModal 1 | section.summary | rounded-wrapper-around-section-candidate |
| `completed-application-patterns.tsx` | 334 | - | section.summary | rounded-wrapper-around-section-candidate |
| `mes-screen-fixtures.tsx` | 319 | - | section.search-table | rounded-wrapper-around-section-candidate |
| `inspection-criteria-pattern.tsx` | 306 | CenterModal 1 | section.form-grid, section.inspection-items | native-section-without-registered-frame, rounded-wrapper-around-section-candidate |
| `original-mes-screen-assets.tsx` | 270 | SideSlidePanel 2 | section.editable-row-list, section.form-grid, section.inspection-items, section.summary | mixed-section-frame-mechanisms, rounded-wrapper-around-section-candidate |
| `easy-mode-receiving-pattern.tsx` | 192 | SideSlidePanel 1 | section.editable-row-list | - |
| `equipment-inspection-records-modal.tsx` | 192 | - | section.inspection-items, section.search-table | native-section-without-registered-frame, rounded-wrapper-around-section-candidate |
| `exact-form-management-screen.tsx` | 188 | - | section.search-table | - |
| `section-patterns.tsx` | 181 | - | section.inspection-items, section.summary | native-section-without-registered-frame |

## 해석 제한

- 정규식 기반 1차 조사이므로 동일 JSX가 조건부 렌더링되는 맥락과 Figma 근거까지 판정하지 않는다.
- `SectionBand`, `SectionHeader`, native `section`의 사용 횟수는 구조적 불일치 후보이지 자동 오류가 아니다.
- Section·Behavior 후보는 이름과 코드 신호만 수집한 것이며 사용자 승인 전까지 `observed-not-canonical`이다.
- 2차 조사에서는 반복 횟수보다 정보 위계, 상태 전이, Shell 슬롯과 시각 근거를 우선 검토한다.
