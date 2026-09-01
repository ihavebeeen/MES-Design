# GroupQuery

> `group-query` · form · Tier 1 · stable · 공개

## 역할

그룹형 표의 그룹 기준과 순서를 선택

## 생성 선택 기준

- 그룹형 표의 그룹 기준과 순서를 선택
- 다단 그룹 접기 구조의 조회 조건

선택하지 않는 경우:
- 일반 필터 조건
- 정렬만 바꾸는 경우
- 그룹형 표가 아닌 목록

## API와 상태

- 공개 심볼: `GroupQueryOption`, `GroupQueryProps`, `GroupQuery`
- 주요 Props: `id`, `label`, `options`, `levels`, `onLevelChange`, `className`, `compact`, `compactLabel`, `index`, `value`, `onChange`, `showDivider`
- 상태: `empty`, `configured`, `open`
- 변형: `default`, `compact`

## 접근성과 제약

- 각 단계의 현재 기준과 순서를 전달한다.
- 선택한 그룹 단계 수와 Table의 그룹 depth가 같은 상태 모델을 사용한다.

## 근거

- 구현: `src/components/ui/group-query.tsx`
- 웹 문서: `/components/group-query`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `grouped-production-list`, `production-result-responsive`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
