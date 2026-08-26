# Checkbox

> `checkbox` · form · Tier 1 · stable · 공개

## 역할

복수 항목 선택

## 생성 선택 기준

- 복수 항목 선택
- 테이블 행·그룹·전체 선택
- 독립적인 참/거짓 값

선택하지 않는 경우:
- 하나만 선택 가능한 옵션
- 단순 상태 표시

## API와 상태

- 공개 심볼: `CheckboxColor`, `CheckboxUncheckedAppearance`, `CheckboxProps`, `Checkbox`
- 주요 Props: `main`, `gray`, `black`, `color`, `indeterminate`, `size`, `uncheckedAppearance`, `shape`
- 상태: `unchecked`, `checked`, `indeterminate`, `disabled`
- 변형: `main`, `gray`, `black`, `outline`, `grayCheck`

## 접근성과 제약

- 부분 선택은 indeterminate 상태로 전달한다.
- 행 label과 선택 목적을 접근 가능한 이름으로 연결한다.
- MES 표는 미선택 grayCheck, 선택 black을 기본으로 사용한다.
- 선택 행 배경과 편집 컨트롤은 같은 선택 ID 상태에서 파생한다.

## 근거

- 구현: `src/components/ui/checkbox.tsx`
- 웹 문서: `/components/checkbox`
- 생성 선택 규칙: 적용됨
- 참고 화면: `material-input-settings`, `batch-work-order`, `bom-copy`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
