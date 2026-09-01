# QueryDateRange

> `query-date-range` · form · Tier 1 · stable · 공개

## 역할

MES 목록 조회 조건에서 시작일·종료일을 하나의 32px 기간 컨트롤로 제공한다.

## 생성 선택 기준

- MES 목록 조회 조건에서 시작일·종료일을 하나의 32px 기간 컨트롤로 제공한다.

선택하지 않는 경우:
- 업무 레코드에 저장되는 단일 날짜나 일반 폼의 날짜 범위인 경우

## API와 상태

- 공개 심볼: `QueryDateRangeProps`, `QueryDateRange`
- 주요 Props: `label`, `start`, `end`, `onStartChange`, `onEndChange`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/query-date-range.tsx`
- 웹 문서: `/components/query-date-range`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
