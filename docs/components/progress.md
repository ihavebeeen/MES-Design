# Progress

> `progress` · feedback · Tier 1 · stable · 공개

## 역할

MES Progress Bar (진행률 막대) — Figma 실측 기반

## 사용 기준

- 등록된 화면·패턴에서 같은 의미가 필요할 때 사용합니다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `ProgressProps`, `Progress`
- 주요 Props: `value`, `showLabel`, `labelTone`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/progress.tsx`
- 웹 문서: `/components/progress`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
