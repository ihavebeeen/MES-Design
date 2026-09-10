# FilterTag

> `filter-tag` · system · Tier 1 · stable · 내부 조립용

## 역할

현재 적용된 필터 조건을 짧게 보여주고 개별 제거할 수 있게 한다.

## 생성 선택 기준

- 현재 적용된 필터 조건을 짧게 보여주고 개별 제거할 수 있게 한다.

선택하지 않는 경우:
- 업무 상태나 분류를 정적으로 표시하는 경우

## API와 상태

- 공개 심볼: `FilterTagProps`, `FilterTag`
- 주요 Props: `category`, `count`, `onRemove`, `className`
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 화면 코드에서 직접 호출하지 않고 부모 컴포넌트 내부에서만 사용합니다.

## 근거

- 구현: `src/components/ui/filter-tag.tsx`
- 웹 문서: 웹 탐색에 노출하지 않음
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
