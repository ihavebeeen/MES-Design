# AI UI 조합 문법 적용 TODO

> 기준 정책: [AI UI 조합 문법 공통정책](./AI_UI_조합_문법_공통정책.md)
> 상태: 2026-08-25 실제 MES 웹 사용 맥락 관찰 연결

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
- [x] 등록 화면 28개를 `interaction-audit.json`과 1:1로 연결하고 누락 시 Registry 검사가 실패하도록 구성했다.
- [x] 전체 43개 Playwright 상호작용·시각 회귀 테스트로 확장했다.
- [x] 운전일지 시간·품목 변경, 선발행 라벨 ID 기반 선택, 그룹 헤더 클릭 영역 결함을 수정했다.
- [x] 이지모드 재구성본이 Table을 사용하지 않고, 임의 도움말 없이, 새 행에 직전 거래처만 계승하는지 브라우저에서 재검증했다.
- [x] 패턴 소스의 원시 `button`, `input`, `select`, `table`, `a` 사용을 재귀 검사하고 생성 시안 두 건을 표준 영향 차단 상태로 종결했다.
- [x] 설비별 토출량 설정, 표준단가 설정, 조 설정을 실제 Figma 하위 상태별로 재조회하고 독립 시각 회귀 경로에 등록했다.
- [x] 캐비티 배열 설정을 원본 자산 목록과 고정 시각 회귀 경로에 직접 연결했다.
- [x] Figma 근거가 있는 고정 폭·높이는 `exactWidth`·`exactHeight`로 유지하고 Shell header/footer와 content-owned 본문 스크롤 책임을 분리했다.
- [x] 레지스트리의 `queued`, `in-progress`, `needs-review`, `implemented-unverified` 완료 차단 항목을 0건으로 정리했다.
- [x] 헤더와 오버레이의 의미 역할·부모·사용 조건·제외 조건을 `context-rules.json`으로 구조화했다.
- [x] `getImplementationContext`가 구현에 연결된 Context Rule·Decision·전역 게이트까지 반환하도록 확장했다.
- [x] 레지스트리 검사가 미등록 부모·구현 참조, 빈 선택 질문과 active 규칙의 구현 누락을 차단하도록 확장했다.
- [x] Button·Link·Badge·IconButton·ActionSet을 실행 결과에 따라 선택하는 액션 맥락을 추가했다.
- [x] Input·Select·Combobox·Radio·Checkbox·Switch·SearchInput·Filter·시간 입력의 선택 조건을 구조화했다.
- [x] SectionFrame·무경계 단일 영역·표 합계·결과 요약의 경계 조건을 구조화했다.
- [x] 읽기 목록·다중 선택·선택 행 편집·master-detail·그룹 계층·반복 입력의 Table 적합성 규칙을 추가했다.
- [x] Shell 소유·콘텐츠 소유·무스크롤과 가로 overflow 예외를 구분하는 스크롤 규칙을 추가했다.
- [x] 테이블 링크 셀, 반복 입력 행, 별도 스크롤 컨테이너, Content region title은 기존 조합으로 설명 가능하여 신규 컴포넌트를 만들지 않는 것으로 판정했다.
- [x] 화면 ID가 없는 신규 생성도 전체 선택 규칙·보류 항목을 한 번에 읽도록 `getGenerationContext` API를 추가했다.
- [x] 페이지 전용 섹션 제목은 별도 컴포넌트로 만들지 않기로 종결했다. 페이지에서는 기존 content-region 제목과 최소 타이포 조합을 사용하고 모달용 회색 `SectionHeader`를 자동 재사용하지 않는다.
- [x] 투입정보·부산물 생성 시안은 추가 승격 검토 없이 격리 시안으로 보존·종결했다.
- [x] Button·Input·Table·Shell 등 핵심 웹 컴포넌트 20개의 사용·금지·부모·상태·대안 계약을 `component-usage-contracts.json`으로 구조화했다.
- [x] 핵심 Shell·Section·Behavior 10개의 슬롯·상태·스크롤·action set 계약을 `pattern-contracts.json`으로 구조화했다.
- [x] 우측 슬라이드, 중앙 검색 테이블, 페이지 그룹 목록 대표 화면 3개를 순서형 `screen-specs.json`으로 이관했다.
- [x] Resolver가 선택·제외 근거를 `decisionTrace`로 출력하고, 구현 감사가 섹션 ID·순서·패턴 marker·action set을 차단 조건으로 검사하도록 확장했다.
- [x] `side-slide-form-editable-list.v1`과 `center-modal-search-table.v1`을 stable 결정형 생성 템플릿으로 구성했다.
- [x] `page-entity-list.v1`을 provisional 결정형 생성 템플릿으로 구성하고 안정 자산으로 위장하지 않도록 경고를 유지했다.
- [x] 개발 MES의 메뉴 화면 42개와 주요 등록·편집·조회 진입 흐름 30개를 읽기 전용으로 관찰해 사용 맥락 인벤토리에 기록했다.
- [x] 실제 웹 관찰값을 `observed-not-canonical`로 분리해 Figma·승인 규칙보다 우선하지 않도록 고정했다.
- [x] Resolver, `getImplementationContext`, 로컬 MCP가 화면별 실제 웹 사용 위치와 연결 흐름을 조회하도록 연결했다.

## 의도적으로 하지 않은 작업

- `src/components/patterns`의 대규모 물리 폴더 이동은 import 변경만 늘리므로 하지 않았다. 논리 분류는 Registry가 담당한다.
- rounded wrapper를 일괄 삭제하지 않았다. 데이터 카드인지, Section Frame인지, 원본 근거가 있는 예외인지 먼저 판정한다.
- 단일 화면에만 보이는 조합은 공용 패턴으로 자동 승격하지 않았다.
- 맥락 규칙을 추가한다는 이유로 기존 UI 컴포넌트의 외형이나 기본 variant를 변경하지 않았다.
- 부분 성공 상태의 이지모드 생성안은 2026-08-13 사용자 결정에 따라 현재 시안을 그대로 보존하고 종결했다. 표준 화면 레지스트리와 후속 AI 생성 근거에는 포함하지 않는다.

## 다음 반복에서 새로 생기는 작업

기존 원본 코드화 배치의 완료 차단 항목은 0건이지만, 실제 웹 사용 맥락 관찰은 `observed-in-progress`다. 페이지 전용 섹션 제목은 독립 컴포넌트 후보에서 제외했으며, 새로운 화면에서 실제로 기존 content-region 규칙으로 설명할 수 없는 반복 근거가 생길 때만 새 후보로 다시 제안한다.

이번 핵심 맥락 계약 배치 이후 남은 일은 전체 88개 자산을 형식적으로 채우는 일이 아니다. 다음 실제 화면 요청에서 사용되는 자산부터 계약 범위를 넓히고, 아래 항목을 순서대로 처리한다.

1. 행 선택 후 활성화되는 편집·출력·승인 팝업을 화면 유형별로 확인한다.
2. 선행 입력 뒤 열리는 조건부 중첩 팝업과 행별 상세 링크를 확인한다.
3. 관찰된 실제 웹 구조를 최신 Figma와 대조해 구현 오류·원본 오류·의도적 예외·정규화 후보로 판정한다.
4. 판정 근거가 생긴 화면부터 순서형 ScreenSpec과 사용 계약을 확장한다.
5. 중앙 검색 테이블과 페이지 엔티티 목록의 원본·브라우저 검증을 이어간다.

전체 프로젝트 상태는 장기 자동 생성 기반을 계속 확장하는 `in-progress`이며, 이후 새로운 Figma 원본이나 화면 생성 요청이 들어올 때 아래 절차를 반복한다.

1. ScreenSpec 작성
2. Context Decision으로 의미 역할·부모 맥락·업무 구조 판정
3. `patternRefs`로 기존 Shell·Section·Behavior·ActionSet 조회
4. 기존 문법으로 설명되지 않는 요소만 후보로 격리
5. 반복 근거와 원본 증거 확인
6. 시각·상호작용·overflow 테스트 통과
7. 사람 승인 후 표준 Registry 승격

완료 결과는 [AI UI 조합 문법 이관 완료](./AI_UI_조합_문법_이관_완료.md)에 정리했다.
