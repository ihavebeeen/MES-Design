# TreeView

> `tree-view` · navigation · Tier 3 · provisional · 공개

## 역할

메뉴·구조·분류의 부모-자식 관계를 펼치고 이동하거나 대상을 지정한다.

## 생성 선택 기준

- 메뉴·구조·분류의 부모-자식 관계를 펼치고 이동하거나 대상을 지정한다.

선택하지 않는 경우:
- 값 선택 입력이나 평면 목록인 경우

## API와 상태

- 공개 심볼: `TreeViewNode`, `TreeViewProps`, `TreeView`
- 주요 Props: 별도 Props 선언 없음
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/tree-view.tsx`
- 웹 문서: `/components/tree-view`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
