# Cascader

> `cascader` · form · Tier 3 · provisional · 공개

## 역할

공장·공정·설비처럼 상위 선택이 다음 선택지를 결정하는 계층 값을 고른다.

## 생성 선택 기준

- 공장·공정·설비처럼 상위 선택이 다음 선택지를 결정하는 계층 값을 고른다.

선택하지 않는 경우:
- 평면 선택지 하나 또는 여러 독립 값을 선택하는 경우

## API와 상태

- 공개 심볼: `CascaderItem`, `CascaderGroup`, `CascaderValue`, `CascaderProps`, `Cascader`
- 주요 Props: `groups`, `value`, `defaultValue`, `onValueChange`, `className`
- State: `default`
- Value: `unselected`, `selected`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`, `hover`, `focus`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/cascader.tsx`
- 웹 문서: `/components/cascader`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
