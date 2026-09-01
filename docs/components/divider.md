# Divider

> `divider` · layout · Tier 2 · provisional · 공개

## 역할

같은 컨테이너 안에서 역할이 다른 인접 영역의 경계를 최소한으로 표시한다.

## 생성 선택 기준

- 같은 컨테이너 안에서 역할이 다른 인접 영역의 경계를 최소한으로 표시한다.

선택하지 않는 경우:
- 논리 섹션의 제목·범위 설명이 필요하거나 장식선을 반복하는 경우

## API와 상태

- 공개 심볼: `DividerProps`, `Divider`
- 주요 Props: `orientation`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-orientation`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/divider.tsx`
- 웹 문서: `/components/divider`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
