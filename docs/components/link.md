# Link

> `link` · action · Tier 2 · provisional · 공개

## 역할

다른 화면·상세·관련 목록으로 이동

## 사용 기준

- 다른 화면·상세·관련 목록으로 이동
- 표 셀에서 연결된 건수나 식별자를 여는 경우

사용하지 않는 경우:
- 상태값 표시
- 저장·삭제 등 즉시 실행 동작

## API와 상태

- 공개 심볼: `LinkProps`, `Link`
- 주요 Props: 별도 Props 선언 없음
- 상태: `default`, `hover`, `focus`
- 변형: `default`

## 접근성과 제약

- 목적을 텍스트만으로 식별할 수 있어야 한다.
- 새 창이면 접근 가능한 안내를 제공한다.
- 링크 의미를 Badge나 Tag로 대체하지 않는다.
- 클릭 결과가 이동이 아니라 상태 변경이면 Button을 사용한다.

## 근거

- 구현: `src/components/ui/link.tsx`
- 웹 문서: `/components/link`
- 상세 사용 계약: 등록됨
- 화면 근거: `purchase-order-lookup`, `team-settings`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
