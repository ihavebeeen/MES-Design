# AI UI 조합 문법 적용 TODO

> 기준 정책: [AI UI 조합 문법 공통정책](./AI_UI_조합_문법_공통정책.md)
> 상태: 2026-08-12 기준 현재 범위 완료

## 완료된 작업

- [x] 전체 패턴 소스에서 Shell·Section Frame·Section Pattern·Behavior 후보를 전수 조사했다.
- [x] 중앙 팝업, 우측 슬라이드 패널, 확인 팝업을 공용 Shell로 등록했다.
- [x] `contentClassName` 직접 제어를 `bodyPadding`, `scrollMode`, `bodyAlign` 계약으로 이관했다.
- [x] Figma 근거가 있는 정확한 폭·높이는 `exactWidth`, `exactHeight`로 보존하고 범용 preset으로 과잉 승격하지 않았다.
- [x] 반복되는 푸터 버튼을 ActionSet Registry로 구조화했다.
- [x] Section/Frame 제안 8건 중 반복 근거가 있는 7건을 승인했다.
- [x] Behavior 제안 5건을 승인하고 공용 훅으로 구현했다.
- [x] 단일 화면 근거만 있는 수량 상태 카드, 접이식 Frame, 이전 거래처 계승, 전후 비교는 ScreenSpec/Recipe 로컬 규칙으로 종결했다.
- [x] `screens.json.patternId`를 복수 `patternRefs`로 이관했다.
- [x] `getImplementationContext`가 화면의 모든 Pattern과 중복 제거된 Component를 반환하도록 변경했다.
- [x] 레지스트리 검사가 빈 참조, 중복 참조, 미등록 참조, 미해결 제안을 차단하도록 변경했다.
- [x] 검증된 우측 슬라이드 `입고등록` 파일럿을 조합 문법으로 이관했다.
- [x] 중앙 `생산계획(일) 연동 일괄작업지시`를 검색·테이블·선택 행 편집 파일럿으로 이관했다.
- [x] 이지모드 입고등록에서 MES에 없던 도움말·접이식·임의 카드 구성을 제거하고 공용 Section 조합으로 다시 구성했다.
- [x] 등록 화면 20개를 `interaction-audit.json`과 1:1로 연결하고 누락 시 Registry 검사가 실패하도록 구성했다.
- [x] 기존 23개에 누락 상호작용 9개를 추가해 전체 32개 Playwright 상호작용·시각 회귀 테스트로 확장했다.
- [x] 운전일지 시간·품목 변경, 선발행 라벨 ID 기반 선택, 그룹 헤더 클릭 영역 결함을 수정했다.
- [x] 이지모드 재구성본이 Table을 사용하지 않고, 임의 도움말 없이, 새 행에 직전 거래처만 계승하는지 브라우저에서 재검증했다.

## 의도적으로 하지 않은 작업

- `src/components/patterns`의 대규모 물리 폴더 이동은 import 변경만 늘리므로 하지 않았다. 논리 분류는 Registry가 담당한다.
- rounded wrapper를 일괄 삭제하지 않았다. 데이터 카드인지, Section Frame인지, 원본 근거가 있는 예외인지 먼저 판정한다.
- 단일 화면에만 보이는 조합은 공용 패턴으로 자동 승격하지 않았다.
- 부분 성공 상태의 이지모드 생성안은 사용자가 재평가하기 전까지 표준 화면 레지스트리에 승격하지 않는다.

## 다음 반복에서 새로 생기는 작업

현재 조합 문법 이관 자체에는 미완료 항목이 없다. 이후 새로운 Figma 원본이나 화면 생성 요청이 들어올 때 아래 절차를 반복한다.

1. ScreenSpec 작성
2. `patternRefs`로 기존 Shell·Section·Behavior·ActionSet 조회
3. 기존 문법으로 설명되지 않는 요소만 후보로 격리
4. 반복 근거와 원본 증거 확인
5. 시각·상호작용·overflow 테스트 통과
6. 사람 승인 후 표준 Registry 승격

완료 결과는 [AI UI 조합 문법 이관 완료](./AI_UI_조합_문법_이관_완료.md)에 정리했다.
