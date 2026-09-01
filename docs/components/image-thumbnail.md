# ImageThumbnail

> `image-thumbnail` · data-display · Tier 3 · provisional · 공개

## 역할

품목·첨부 이미지의 작은 미리보기를 목록이나 상세에 표시한다.

## 생성 선택 기준

- 품목·첨부 이미지의 작은 미리보기를 목록이나 상세에 표시한다.

선택하지 않는 경우:
- 사용자를 식별하거나 원본 크기 편집이 중심인 경우

## API와 상태

- 공개 심볼: `ImageThumbnailItem`, `ImageThumbnailProps`, `ImageThumbnail`
- 주요 Props: `id`, `label`, `preview`, `items`, `value`, `defaultValue`, `onValueChange`, `size`
- 상태: `selected`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label`, `aria-selected`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/image-thumbnail.tsx`
- 웹 문서: `/components/image-thumbnail`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
