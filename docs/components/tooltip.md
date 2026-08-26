# Tooltip

> `tooltip` · overlay · Tier 2 · provisional · 공개

## 역할

MES Tooltip — Figma 디자인 없음(체크리스트 티어2 "Tooltip", 상태 "없음").

## 사용 기준

- 등록된 화면·패턴에서 같은 의미가 필요할 때 사용합니다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `TooltipProps`, `Tooltip`
- 주요 Props: `content`, `children`, `side`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `role` 의미를 제거하지 않습니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/tooltip.tsx`
- 웹 문서: `/components/tooltip`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
