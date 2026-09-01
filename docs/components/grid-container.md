# Container / Grid

> `grid-container` · layout · Tier 2 · provisional · 공개

## 역할

전체 페이지의 열·너비·반응형 배치를 공통 그리드로 정렬한다.

## 생성 선택 기준

- 전체 페이지의 열·너비·반응형 배치를 공통 그리드로 정렬한다.

선택하지 않는 경우:
- 컴포넌트 내부의 작은 정렬이나 승인된 팝업 구조를 임의 재배치하는 경우

## API와 상태

- 공개 심볼: `GridProps`, `Container`, `Grid`
- 주요 Props: `columns`, `gap`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/grid-container.tsx`
- 웹 문서: `/foundations/grid-container`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
