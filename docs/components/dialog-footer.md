# DialogFooter

> `dialog-footer` · system · Tier 1 · stable · 공개

## 역할

중앙 모달이나 우측 패널의 하단 액션

## 생성 선택 기준

- 중앙 모달이나 우측 패널의 하단 액션
- 등록된 action set을 버튼 배열로 렌더링

선택하지 않는 경우:
- 페이지 상단·본문 로컬 액션
- 화면마다 임의 버튼 순서를 구성

## API와 상태

- 공개 심볼: `DialogAction`, `DialogFooterProps`, `DialogFooter`
- 주요 Props: `id`, `label`, `variant`, `disabled`, `onClick`, `className`, `actions`
- 상태: `default`, `primary-disabled`, `pending`
- 변형: `none`, `single`, `paired`, `custom-width`

## 접근성과 제약

- 탭 순서는 시각 순서와 일치한다.
- primaryDisabled는 실제 버튼 disabled와 연결한다.
- action-set 레지스트리의 라벨·순서·dismiss 의미를 따른다.
- 닫기와 X는 동일 복원 경로를 사용한다.
- 기본 조합은 닫기 fillGray·저장 fillBlack(gray130)이며 버튼은 160×40px·간격10px이다. 명시적 variant가 우선한다.

## 근거

- 구현: `src/components/ui/dialog-footer.tsx`
- 웹 문서: `/components/dialog-footer`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `batch-work-order`, `receiving`, `production-quantity-reregistration`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
