# AI UI 조합 문법 이관 완료

2026-08-12에 화면 단위 패턴 중심 구조를 조합 문법 중심 구조로 이관했다.

## 달라진 구조

```text
ScreenSpec
  = Shell
  + SectionFrame + SectionPattern
  + BehaviorPattern
  + ActionSet
  + Recipe의 화면별 데이터·문구
```

화면은 더 이상 `patternId` 하나에 묶이지 않는다. `patternRefs` 배열이 해당 화면에서 실제 사용하는 Shell, Section, Behavior, ActionSet, 기존 Recipe를 모두 기록한다. AI는 `getImplementationContext(screenId)`로 이 조합과 필요한 Component를 한 번에 조회한다.

## 추가된 공용 코드

- `section-patterns.tsx`: 검색·테이블, 편집 행 목록, 검사항목, 표 합계행, 결과 합계 카드
- `behavior-patterns.ts`: 선택, 마스터·상세, 취소 복원, 행 추가·삭제 정책
- `action-sets.ts`와 `action-sets.json`: 팝업 동작 세트
- `dialog-body.ts`: 팝업 본문의 padding·scroll·align 계약

## 자동 차단 규칙

Registry 검사는 다음을 실패로 처리한다.

- 화면에 `patternRefs`가 없거나 비어 있음
- 같은 Pattern을 중복 참조함
- 미등록 Pattern을 참조함
- 승인된 후보가 정식 Pattern Registry에 없음
- resolved 제안에 미판정 후보나 미종결 hold가 남음
- 코드와 자동감사·조합 인벤토리가 다름

## 검증 결과

- TypeScript: 통과
- Registry와 공용 컴포넌트 재사용 검사: 통과
- 디자인 값·조합 인벤토리 drift 검사: 통과
- Playwright 시각·상호작용 테스트: 23/23 통과
- 중앙 팝업 신규 기준 이미지: `batch-work-order-pilot`
- 이지모드 수정 기준 이미지: `easy-mode-receiving`

이 결과는 “새 화면을 무조건 기존 화면 하나와 1:1 매칭”하는 체계가 아니다. 기존 문법의 조합으로 먼저 설명하고, 설명되지 않는 차이는 화면 로컬 규칙으로 둘지 공용 후보로 제안할지 증거를 바탕으로 판정하는 자동화 기반이다.
