# AI UI 조합 인벤토리 1차

이 문서는 `npm run audit:composition`으로 생성되는 얕은 전수조사 결과다. 자동 탐지값은 표준 패턴이 아니라 2차 검토 후보이며, 이 결과만으로 파일을 이동하거나 기존 패턴을 승격하지 않는다.

## 조사 범위

| 항목 | 결과 |
|---|---:|
| 검사 파일 | 41 |
| 전체 줄 수 | 8,101 |
| 혼합 Section Frame 파일 | 2 |
| 표준 Frame 없이 native section만 사용 | 18 |
| rounded wrapper가 있는 Section 후보 파일 | 22 |
| fingerprint | `7fbf47d1c6adc4ef` |

## Shell 사용

| Shell | 인스턴스 |
|---|---:|
| CenterModal | 13 |
| SideSlidePanel | 9 |
| ConfirmDialog | 4 |

## Section Frame 관찰값

| 표현 방식 | 사용 횟수 |
|---|---:|
| sectionBand | 14 |
| sectionHeader | 7 |
| patternGroupHeader | 0 |
| nativeSection | 42 |
| dividerContainer | 33 |
| roundedContainer | 65 |
| gray20Container | 34 |

## 자동 탐지 Section 후보

| 후보 | 파일 수 | 주요 소스 |
|---|---:|---|
| `section.search-table` | 13 | `equipment-discharge-settings-pattern.tsx`, `equipment-inspection-records-modal.tsx`, `exact-form-management-screen.tsx`, `exact-inventory-add-modal.tsx` |
| `section.summary` | 13 | `business-operation-settings-pattern.tsx`, `completed-application-patterns.tsx`, `completed-popup-expanded-content.tsx`, `completed-popup-patterns.tsx` |
| `section.form-grid` | 10 | `business-operation-settings-pattern.tsx`, `completed-popup-patterns.tsx`, `equipment-discharge-settings-pattern.tsx`, `exact-production-analytics-screen.tsx` |
| `section.inspection-items` | 7 | `completed-popup-patterns.tsx`, `equipment-inspection-records-modal.tsx`, `inspection-criteria-pattern.tsx`, `inspection-trend-analysis-pattern.tsx` |
| `section.editable-row-list` | 3 | `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `original-mes-screen-assets.tsx` |
| `section.before-after` | 1 | `production-quantity-reregistration-pattern.tsx` |
| `section.collapsible-form` | 1 | `tier3-promoted-patterns.tsx` |

## 자동 탐지 Behavior 후보

| 후보 | 파일 수 | 주요 소스 |
|---|---:|---|
| `selection.enable-editor` | 16 | `completed-application-patterns.tsx`, `completed-popup-expanded-content.tsx`, `completed-popup-patterns.tsx`, `equipment-discharge-settings-pattern.tsx` |
| `dismiss.restore-committed` | 12 | `cavity-settings-pattern.tsx`, `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `equipment-discharge-settings-pattern.tsx` |
| `row.add-remove` | 4 | `completed-popup-patterns.tsx`, `easy-mode-receiving-pattern.tsx`, `original-mes-screen-assets.tsx`, `user-password-settings-pattern.tsx` |
| `row.inherit-previous` | 1 | `easy-mode-receiving-pattern.tsx` |
| `section.toggle-collapse` | 1 | `tier3-promoted-patterns.tsx` |
| `selection.master-detail` | 1 | `completed-application-patterns.tsx` |

## 우선 검토 파일

| 파일 | 줄 수 | Shell | Section 후보 | 검토 플래그 |
|---|---:|---|---|---|
| `completed-popup-patterns.tsx` | 1029 | CenterModal 1, SideSlidePanel 5 | section.editable-row-list, section.form-grid, section.inspection-items, section.summary | mixed-section-frame-mechanisms, rounded-wrapper-around-section-candidate |
| `completed-popup-expanded-content.tsx` | 526 | CenterModal 1 | section.summary | rounded-wrapper-around-section-candidate |
| `business-operation-settings-pattern.tsx` | 449 | - | section.form-grid, section.summary | native-section-without-registered-frame |
| `sales-transaction-statement-pattern.tsx` | 349 | CenterModal 1 | section.search-table, section.summary | native-section-without-registered-frame |
| `completed-application-patterns.tsx` | 334 | - | section.summary | rounded-wrapper-around-section-candidate |
| `mes-screen-fixtures.tsx` | 328 | - | section.search-table | rounded-wrapper-around-section-candidate |
| `inspection-criteria-pattern.tsx` | 306 | CenterModal 1 | section.form-grid, section.inspection-items | native-section-without-registered-frame, rounded-wrapper-around-section-candidate |
| `user-password-settings-pattern.tsx` | 304 | CenterModal 1, SideSlidePanel 1, ConfirmDialog 1 | section.form-grid | native-section-without-registered-frame, rounded-wrapper-around-section-candidate |
| `equipment-discharge-settings-pattern.tsx` | 283 | CenterModal 1, ConfirmDialog 1 | section.form-grid, section.search-table | native-section-without-registered-frame, rounded-wrapper-around-section-candidate |
| `original-mes-screen-assets.tsx` | 279 | SideSlidePanel 2 | section.editable-row-list, section.form-grid, section.inspection-items, section.summary | mixed-section-frame-mechanisms, rounded-wrapper-around-section-candidate |

## 해석 제한

- 정규식 기반 1차 조사이므로 동일 JSX가 조건부 렌더링되는 맥락과 Figma 근거까지 판정하지 않는다.
- `SectionBand`, `SectionHeader`, native `section`의 사용 횟수는 구조적 불일치 후보이지 자동 오류가 아니다.
- Section·Behavior 후보는 이름과 코드 신호만 수집한 것이며 사용자 승인 전까지 `observed-not-canonical`이다.
- 2차 조사에서는 반복 횟수보다 정보 위계, 상태 전이, Shell 슬롯과 시각 근거를 우선 검토한다.
