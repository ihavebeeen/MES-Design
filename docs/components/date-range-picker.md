# DateRangePicker

> `date-range-picker` · form · Tier 2 · provisional · 공개

## 역할

조회 대상의 시작일과 종료일을 한 범위로 선택

## 사용 기준

- 조회 대상의 시작일과 종료일을 한 범위로 선택

사용하지 않는 경우:
- 단일 날짜 업무 필드
- 원본에 기간 조회가 없는 화면

## API와 상태

- 공개 심볼: `DateRange`, `DateRangePickerProps`, `DateRangePicker`
- 주요 Props: `start`, `end`, `value`, `onValueChange`, `placeholder`, `disabled`, `className`
- 상태: `empty`, `complete`, `calendar-open`
- 변형: `default`

## 접근성과 제약

- 시작일과 종료일 입력을 각각 식별한다.
- 달력 열기와 날짜 이동을 키보드로 수행할 수 있어야 한다.
- 시작일은 종료일보다 늦을 수 없다.
- 조회 버튼과 같은 상단 조건 영역에 배치한다.

## 근거

- 구현: `src/components/ui/date-range-picker.tsx`
- 웹 문서: `/components/date-range-picker`
- 상세 사용 계약: 등록됨
- 화면 근거: `grouped-production-list`, `production-result-responsive`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
