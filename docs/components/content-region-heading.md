# ContentRegionHeading

> `content-region-heading` · layout · Tier 1 · stable · 공개

## 역할

팝업·페이지 안에서 단일 테이블·리스트·작업영역의 이름을 표시

## 생성 선택 기준

- 팝업·페이지 안에서 단일 테이블·리스트·작업영역의 이름을 표시
- 별도 SectionFrame 경계 없이 콘텐츠 이름만 필요

선택하지 않는 경우:
- 모달 전체 제목
- 서로 다른 논리 섹션을 SectionFrame과 회색 밴드로 구분
- 제목 없이도 컬럼 헤더와 주변 맥락만으로 내용이 명확

## API와 상태

- 공개 심볼: `ContentRegionHeadingProps`, `ContentRegionHeading`
- 주요 Props: `as`
- 상태: `static`
- 변형: `h2`, `h3`

## 접근성과 제약

- 콘텐츠 구조에 맞는 h2 또는 h3 요소로 렌더링한다.
- 배경·테두리·radius를 추가하지 않는다.
- 기본 typography는 16px Bold, 24px line-height, gray130이다.
- 52px 제목 행, 외부 padding, 우측 액션 배치는 부모 패턴이 소유한다.

## 근거

- 구현: `src/components/ui/content-region-heading.tsx`
- 웹 문서: `/components/content-region-heading`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `material-input-settings`, `equipment-discharge-settings`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
