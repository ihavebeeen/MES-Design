# AI UI 조합 문법 적용 TODO

> 기준 정책: [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)
> 1차 인벤토리: [AI UI 조합 인벤토리 1차](./AI_UI_조합_인벤토리_1차.md)
> 상태: 1단계 완료, 2단계 범위 조정

## 완료

- [x] `src/components/patterns/*.tsx` 얕은 전수조사 자동화
- [x] 24개 파일, 4,438줄의 Shell·Section Frame·UI 컴포넌트·상태 신호 수집
- [x] `composition-inventory.json`과 Markdown 보고서 생성
- [x] 코드와 인벤토리 drift를 막는 `check:composition-inventory` 추가
- [x] 자동 탐지 결과를 `observed-not-canonical`로 격리

## 1차 조사로 변경된 계획

처음에는 전체 패턴 파일을 같은 깊이로 조사할 예정이었으나, 결과에 따라 다음처럼 범위를 조정한다.

1. Shell은 전체 파일이 아니라 13개 인스턴스에 집중한다.
   - `CenterModal` 4개
   - `SideSlidePanel` 8개
   - `ConfirmDialog` 1개
2. Section Frame 혼합 문제는 우선 3개 파일을 깊게 본다.
   - `completed-popup-patterns.tsx`
   - `original-mes-screen-assets.tsx`
   - `easy-mode-receiving-pattern.tsx`
3. 표준 Frame 없이 native `section`만 사용하는 7개 파일은 오류로 단정하지 않고 용도를 먼저 분류한다.
4. rounded wrapper가 탐지된 13개 파일은 일괄 제거하지 않는다. 데이터 카드인지, Section Frame인지, 임의 wrapper인지 원본 근거로 구분한다.
5. `section.summary` 9개와 `selection.enable-editor` 10개는 탐지 범위가 넓으므로 첫 구현 대상에서 제외하고 하위 유형으로 분해한 뒤 판단한다.
6. 단일 파일에서만 탐지된 다음 후보는 표준 등록을 보류한다.
   - `section.before-after`
   - `section.collapsible-form`
   - `row.inherit-previous`

## 2단계: 수동 구조 감사

### P0 — Shell과 슬롯 장부

- [ ] 13개 Shell 인스턴스의 source, title, size, Header/Body/Footer, scroll 책임을 기록한다.
- [ ] Shell별 body padding과 `contentClassName` 차이를 수집한다.
- [ ] Footer 액션을 cancel-save, cancel-confirm, cancel-delete, close-only 등으로 분류한다.
- [ ] Shell이 담당할 값과 Body Pattern이 담당할 값을 분리한다.

완료 조건:

- 모든 Shell 인스턴스가 하나의 Shell 계약과 ActionSet으로 설명된다.
- 설명되지 않는 차이는 `keep`, `normalize`, `needs-review`로 기록된다.

### P0 — Section Frame 감사

- [ ] 혼합 Frame 파일 3개의 섹션 경계, 제목, 배경, padding, divider, scroll을 화면별로 장부화한다.
- [ ] `SectionBand`, `SectionHeader`, native `section`의 실제 역할 차이를 확인한다.
- [ ] `standard`, `collapsible`, `none` Frame 후보가 원본 화면에서 반복되는지 확인한다.
- [ ] `기본정보`처럼 화면별 제목과 Frame 계약을 분리한다.

완료 조건:

- Section Frame의 최소 API와 소유 책임이 제안 상태로 작성된다.
- 기존 섹션 제목을 패턴 ID로 오인하지 않는다.

### P1 — Section Pattern 후보 검토

- [ ] `section.search-table` 탐지 6개를 toolbar/table 구조별로 비교한다.
- [ ] `section.form-grid` 탐지 5개를 열 수, 라벨 폭, required 표현 기준으로 비교한다.
- [ ] `section.editable-row-list` 탐지 3개를 행 추가·삭제·초기값 규칙과 함께 비교한다.
- [ ] `section.inspection-items` 탐지 3개를 판정 방식과 대상정보 배치 기준으로 비교한다.
- [ ] `section.summary`를 합계행, 결과카드, 전후 비교 요약으로 분해한다.

### P1 — Behavior 후보 검토

- [ ] `selection.enable-editor`를 행 선택 편집, 마스터–상세, 단순 활성화로 분해한다.
- [ ] `dismiss.restore-committed` 4개가 취소·X·Esc에서 동일하게 작동하는지 확인한다.
- [ ] `row.add-remove` 3개의 추가 가능 조건과 삭제 후 상태를 비교한다.
- [ ] `row.inherit-previous`는 이지모드 전용 요구인지 공통 Behavior인지 보류 상태로 검토한다.

## 3단계: 제안 및 승인

- [ ] 감사 결과를 `section-pattern-proposals`와 `behavior-pattern-proposals`로 작성한다.
- [ ] 각 후보에 반복 화면, Figma/코드 근거, 책임, slots, states, 금지 조건을 기록한다.
- [ ] 기존 패턴의 variant인지, 조합인지, 신규 후보인지 PatternDecision을 작성한다.
- [ ] 사용자 승인 전 `patterns.json`과 표준 코드에 반영하지 않는다.

## 4단계: 파일럿 이관

- [ ] 검증된 중앙 팝업 1개를 Shell + Section + Behavior + ActionSet으로 재구성한다.
- [ ] 검증된 우측 슬라이드 팝업 1개를 같은 구조로 재구성한다.
- [ ] 이지모드 입고등록은 표준 추출 근거가 아니라 새 조합 문법의 검증 대상으로 재구성한다.
- [ ] 기존 시각 회귀, 상호작용, overflow 결과와 비교한다.

## 현재 보류

- [ ] `screens.json.patternId`를 복수 `patternRefs`로 변경
- [ ] 기존 `patterns.json` 항목을 Shell/Section/Behavior/Recipe로 이동
- [ ] `getImplementationContext` 복수 패턴 API 전환
- [ ] `src/components/patterns` 폴더 대규모 이동
- [ ] rounded wrapper 일괄 제거
- [ ] 자동 탐지 후보의 표준 승격

보류 항목은 2단계 감사와 사용자 승인 전에는 진행하지 않는다.
