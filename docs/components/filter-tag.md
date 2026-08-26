# FilterTag

> `filter-tag` · system · Tier 1 · stable · 내부 조립용

## 역할

MES FilterTag (필터에서 쓰는 태그/칩) — Figma 실측 기반 + 담당자 정책 결정 반영

## 사용 기준

- 독립 화면에서 직접 사용하지 않고 부모 컴포넌트 내부에서만 사용합니다.

사용하지 않는 경우:
- 화면 코드와 생성 화면에서 직접 호출하지 않습니다.

## API와 상태

- 공개 심볼: `FilterTagProps`, `FilterTag`
- 주요 Props: `category`, `count`, `onRemove`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/filter-tag.tsx`
- 웹 문서: 웹 탐색에 노출하지 않음
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
