# AI UI 조합 문법 적용 TODO

> 기준 정책: [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)
> 1차 인벤토리: [AI UI 조합 인벤토리 1차](./AI_UI_조합_인벤토리_1차.md)
> 상태: 1단계 완료, 2단계 Shell·Section Frame 1차 감사 완료

## 완료

- [x] `src/components/patterns/*.tsx` 얕은 전수조사 자동화
- [x] 24개 파일, 4,438줄의 Shell·Section Frame·UI 컴포넌트·상태 신호 수집
- [x] `composition-inventory.json`과 Markdown 보고서 생성
- [x] 코드와 인벤토리 drift를 막는 `check:composition-inventory` 추가
- [x] 자동 탐지 결과를 `observed-not-canonical`로 격리

## 1차 조사로 변경된 계획

처음에는 전체 패턴 파일을 같은 깊이로 조사할 예정이었으나, 결과에 따라 다음처럼 범위를 조정한다.

1. 얕은 조사에서 잡힌 Shell JSX 호출부는 13개지만 실제 화면 Recipe는 28개다. 후속 감사 단위를 호출부에서 Recipe로 정정한다.
   - `CenterModal` Recipe 19개
   - `SideSlidePanel` Recipe 8개
   - `ConfirmDialog` Recipe 1개
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

- [x] 13개 JSX 호출부에서 파생되는 28개 Recipe의 source, title, size, Header/Body/Footer와 scroll 책임을 기록한다.
- [x] Shell별 body padding과 `contentClassName` 차이를 수집한다.
- [x] Footer 액션을 cancel-save, save-only, close-only, cancel-input, close-reregister 등으로 분류한다.
- [x] Shell이 담당할 값과 Body Pattern이 담당할 값을 1차 분리한다.

추가된 후속 검토:

- [ ] `contentClassName`을 `bodyPadding`, `scrollMode`, `bodyAlign` 계약으로 분리할지 판단한다.
- [ ] Source popup 6개의 pixel width override를 preset 확장 또는 의도된 예외로 분류한다.
- [ ] overlay `bg-black/60`과 `bg-black/40`의 주석·코드 충돌을 확인한다.
- [ ] raw action 배열 10종을 ActionSet Registry로 구조화할지 검토한다.
- [ ] custom footer 2종의 고유 높이·버튼 폭이 Shell variant인지 화면 예외인지 판단한다.
- [ ] `headerDivider=false`와 중첩 시간 선택 진입 경로를 원본 근거로 확인한다.

완료 조건:

- 모든 Shell 인스턴스가 하나의 Shell 계약과 ActionSet으로 설명된다.
- 설명되지 않는 차이는 `keep`, `normalize`, `needs-review`로 기록된다.

1차 장부는 [AI UI Shell·슬롯 감사 1차](./AI_UI_Shell_슬롯_감사_1차.md)에 기록했다. 위 추가 검토가 끝나기 전까지 Shell API를 변경하지 않는다.

### P0 — Section Frame 감사

- [x] 혼합 Frame 파일 3개의 섹션 경계, 제목, 배경, padding, divider, scroll을 화면별로 장부화한다.
- [x] `SectionBand`, `SectionHeader`, native `section`의 실제 역할 차이를 확인한다.
- [x] `standard`, `collapsible`, `none` Frame 후보가 원본 화면에서 반복되는지 확인한다.
- [x] `기본정보`처럼 화면별 제목과 Frame 계약을 분리한다.

완료 조건:

- Section Frame의 최소 API와 소유 책임이 제안 상태로 작성된다.
- 기존 섹션 제목을 패턴 ID로 오인하지 않는다.

1차 결과는 [AI UI Section Frame 감사 1차](./AI_UI_Section_Frame_감사_1차.md)와 `composition-section-frame-ledger.json`에 기록했다.

- `standard`는 반복 근거가 확인됐다.
- `none`은 단일 작업 Body의 정상 선택으로 유지한다.
- `collapsible`는 생성 후보 1건뿐이라 `migration-hold`로 유지한다.
- gray entry card와 list region은 반복 후보지만 세부 계약 비교가 더 필요하다.
- `SectionBand` 일괄 교체와 Frame 코드 구현은 P1 후보 비교 뒤로 미룬다.

### P1 — Section Pattern 후보 검토

- [x] `section.search-table` 탐지 6개를 toolbar/table 구조별로 비교한다.
- [x] `section.form-grid` 탐지 5개를 열 수, 라벨 폭, required 표현 기준으로 비교한다.
- [x] `section.editable-row-list` 탐지 3개를 행 추가·삭제·초기값 규칙과 함께 비교한다.
- [x] `section.inspection-items` 탐지 3개를 판정 방식과 대상정보 배치 기준으로 비교한다.
- [x] `section.summary`를 합계행, 결과카드, 전후 비교 요약으로 분해한다.

결과는 [AI UI Section Pattern 후보 감사 1차](./AI_UI_Section_Pattern_후보_감사_1차.md)에 기록했다. 자동 탐지의 fileCount와 실제 Pattern 인스턴스 수가 다르므로, 이후 검사에서는 정의 파일·metadata·handler 없는 시각 요소를 근거에서 제외한다.

### P1 — Behavior 후보 검토

- [x] `selection.enable-editor`를 행 선택 편집, 마스터–상세, 단순 활성화로 분해한다.
- [x] `dismiss.restore-committed` 4개가 취소·X·Esc에서 동일하게 작동하는지 확인한다.
- [x] `row.add-remove` 3개의 추가 가능 조건과 삭제 후 상태를 비교한다.
- [x] `row.inherit-previous`는 이지모드 전용 요구인지 공통 Behavior인지 보류 상태로 검토한다.

결과는 [AI UI Behavior 후보 감사 1차](./AI_UI_Behavior_후보_감사_1차.md)에 기록했다. `selection.enable-editor`와 `row.add-remove`는 의미가 넓어 subtype/상태 계약으로 분해했고, `row.inherit-previous`는 생성 후보의 ScreenSpec local rule로 보류했다.

## 3단계: 제안 및 승인

- [x] 감사 결과를 `section-pattern-proposals`와 `behavior-pattern-proposals`로 작성한다.
- [x] 각 후보에 반복 화면, Figma/코드 근거, 책임, slots, states, 금지 조건을 기록한다.
- [x] 기존 패턴의 variant인지, 조합인지, 신규 후보인지 PatternDecision을 작성한다.
- [x] 사용자 승인 전 `patterns.json`과 표준 코드에 반영하지 않는다.

제안 목록은 [AI UI 표준 후보 제안 1차](./AI_UI_표준_후보_제안_1차.md)에 요약했다. 두 proposal registry는 `proposed-not-approved` 상태이며, 다음 단계는 사용자 승인 뒤 파일럿 이관이다.

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
