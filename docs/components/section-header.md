# SectionHeader

> `section-header` · layout · Tier 1 · stable · 공개

## 역할

팝업 안에서 복수 섹션의 내용을 구분

## 사용 기준

- 팝업 안에서 복수 섹션의 내용을 구분
- 섹션 제목 우측에 로컬 액션이 있음

사용하지 않는 경우:
- 모달 전체 제목
- 섹션이 하나뿐이고 별도 위계가 필요 없음
- 일반 페이지에서 근거 없는 긴 회색 밴드

## API와 상태

- 공개 심볼: `SectionHeaderProps`, `SectionHeader`
- 주요 Props: `children`, `action`, `className`
- 상태: `static`
- 변형: `title-only`, `title-action`

## 접근성과 제약

- 시각 제목이 section의 접근 가능한 이름이 되도록 연결한다.
- SectionFrame의 title slot을 통해 사용한다.
- 텍스트 hug가 아니라 사용 가능한 섹션 폭을 채운다.

## 근거

- 구현: `src/components/ui/section-header.tsx`
- 웹 문서: `/components/section-header`
- 상세 사용 계약: 등록됨
- 화면 근거: `receiving`, `production-result`, `custom-information`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
