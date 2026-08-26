# SectionFrame

> `section-frame` · layout · Tier 1 · stable · 공개

## 역할

셸 본문을 의미 있는 복수 섹션으로 분할

## 사용 기준

- 셸 본문을 의미 있는 복수 섹션으로 분할
- 섹션 padding·divider·background 책임을 한 곳에 둠

사용하지 않는 경우:
- 화면 전체 셸
- 표 안의 임의 장식 박스
- 업무 의미가 없는 wrapper

## API와 상태

- 공개 심볼: `SectionFrameDivider`, `SectionFramePadding`, `SectionFrameBackground`, `SectionFrameProps`, `SectionFrame`
- 주요 Props: `title`, `action`, `divider`, `padding`, `background`, `contentClassName`, `none`, `bottom`
- 상태: `static`
- 변형: `surface`, `subtle`, `standard-padding`, `no-padding`, `bottom-divider`, `inline-divider`

## 접근성과 제약

- 문자열 제목이 있으면 section aria-label로 연결한다.
- 고정 높이와 shell scroll을 소유하지 않는다.
- 업무 제목과 본문은 slot으로 받는다.

## 근거

- 구현: `src/components/ui/section-frame.tsx`
- 웹 문서: `/components/section-frame`
- 상세 사용 계약: 등록됨
- 화면 근거: `receiving`, `production-result`, `custom-information`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
