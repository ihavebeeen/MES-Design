# FilterTag

> `filter-tag` · system · Tier 1 · stable · 내부 조립용

## 역할

다른 공개 컴포넌트 내부에서만 사용하는 조립 단위입니다.

## 생성 선택 기준

이 컴포넌트는 전역 선택 가드 대상이 아닙니다. 실제 코드 API와 부모 패턴 계약만 따르며, 별도 사용처 전수조사를 만들지 않습니다.

## API와 상태

- 공개 심볼: `FilterTagProps`, `FilterTag`
- 주요 Props: `category`, `count`, `onRemove`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 화면 코드에서 직접 호출하지 않고 부모 컴포넌트 내부에서만 사용합니다.

## 근거

- 구현: `src/components/ui/filter-tag.tsx`
- 웹 문서: 웹 탐색에 노출하지 않음
- 생성 선택 규칙: 적용 안 함(API 문서만 사용)
- 참고 화면: 없음
- 참고 화면의 역할: 해당 없음

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
