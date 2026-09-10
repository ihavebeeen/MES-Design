# ScrollArea

> `scroll-area` · layout · Tier 2 · provisional · 공개

## 역할

헤더·푸터를 유지하면서 특정 본문 영역만 스크롤 책임을 가져야 한다.

## 생성 선택 기준

- 헤더·푸터를 유지하면서 특정 본문 영역만 스크롤 책임을 가져야 한다.

선택하지 않는 경우:
- 부모 셸이나 Table이 이미 스크롤을 소유하거나 불필요한 중첩 스크롤이 생기는 경우

## API와 상태

- 공개 심볼: `ScrollArea`
- 주요 Props: 별도 Props 선언 없음
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `not-applicable`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/scroll-area.tsx`
- 웹 문서: `/components/scroll-area`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
