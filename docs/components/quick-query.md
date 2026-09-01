# QuickQuery

> `quick-query` · form · Tier 1 · stable · 공개

## 역할

사용자가 저장한 조회 조건을 반복 적용

## 생성 선택 기준

- 사용자가 저장한 조회 조건을 반복 적용
- 목록 화면의 빠른 조회 슬롯

선택하지 않는 경우:
- 일회성 필터 조건
- 업무 데이터를 저장하는 입력

## API와 상태

- 공개 심볼: `QuickQueryPreset`, `QuickQueryProps`, `QuickQuerySlotDetail`, `QuickQuerySlot`, `QuickQueryPresetDialogProps`, `QuickQuery`, `QuickQueryPresetDialog`
- 주요 Props: `id`, `label`, `presets`, `activeId`, `onApply`, `onClearActive`, `onSettingsClick`, `className`, `triggerLabel`, `compact`, `grouping`, `filters`, `view`, `name`, `detail`, `open`, `onOpenChange`, `slots`, `onDelete`, `onSaveSlot`
- 상태: `inactive`, `active`, `settings-open`
- 변형: `default`, `compact`

## 접근성과 제약

- 활성 preset을 현재 상태로 전달한다.
- 설정 팝업 열기 동작에 접근 가능한 이름을 제공한다.
- Filter·GroupQuery와 같은 조회 상태를 공유하되 각각의 의미를 합치지 않는다.

## 근거

- 구현: `src/components/ui/quick-query.tsx`
- 웹 문서: `/components/quick-query`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `grouped-production-list`, `production-result-responsive`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
