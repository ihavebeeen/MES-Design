# Navbar

> `navbar` · navigation · Tier 2 · provisional · 공개

## 역할

제품 전역의 브랜드·주요 이동·사용자 동작을 한 줄에 제공하는 제품 구조일 때 사용한다.

## 생성 선택 기준

- 제품 전역의 브랜드·주요 이동·사용자 동작을 한 줄에 제공하는 제품 구조일 때 사용한다.

선택하지 않는 경우:
- 기존 MES Sidebar와 상단 업무 탭을 임의로 대체하거나 팝업 내부에 중복하는 경우

## API와 상태

- 공개 심볼: `NavbarProps`, `Navbar`
- 주요 Props: `left`, `center`, `right`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/navbar.tsx`
- 웹 문서: `/components/navbar`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
