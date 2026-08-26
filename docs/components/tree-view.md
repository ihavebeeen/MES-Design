# TreeView

> `tree-view` · navigation · Tier 3 · provisional · 공개

## 역할

읽기·탐색 목적의 계층에 사용한다.

## 사용 기준

- 읽기·탐색 목적의 계층에 사용한다.
- 선택값 제출이 필요하면 TreeSelect를 사용한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `TreeViewNode`, `TreeViewProps`, `TreeView`
- 주요 Props: 별도 Props 선언 없음
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/tree-view.tsx`
- 웹 문서: `/components/tree-view`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
