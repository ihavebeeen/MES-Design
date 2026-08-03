# UI 컴포넌트 총망라 체크리스트

이 문서는 웹/SaaS 제품 전반 + MES 도메인에서 흔히 쓰이는 UI 컴포넌트를 카테고리별로 총망라한 마스터 목록이다. 목적은 현재 피그마 파일에 **이미 있는 것**과 **아직 없어서 새로 만들어야 하는 것**을 한눈에 구분하고, 만들 순서(우선순위)까지 한 표에서 보는 것이다.

**범위**: 지도(GIS), 오디오/비디오 편집기, 3D·AR 뷰어 같은 특정 산업 도메인 전용 컴포넌트는 제외했다. 대신 업종에 상관없이 대부분의 웹/SaaS 서비스에서 보편적으로 쓰이는 컴포넌트 + 우리 서비스(MES) 도메인 특화 컴포넌트를 기준으로 구성했다.

## 레이어(Layer) 구분

아토믹 디자인(Atomic Design) 체계 기준.

| 레이어 | 정의 | 예 |
|---|---|---|
| **토큰 (Token)** | 컴포넌트를 만드는 가장 밑단의 원시값·에셋 | 색상, 폰트 스타일, 간격, 아이콘 에셋 |
| **아톰 (Atom)** | 토큰을 조합해 만든 가장 작은 독립 UI 요소 | 버튼, 인풋, 배지, 체크박스 |
| **몰큘 (Molecule)** | 아톰 여러 개를 조합한 단위 | 검색창, Form Field |
| **오가니즘 (Organism)** | 몰큘·아톰을 더 크게 조합한, 화면의 한 영역 | 헤더, 테이블, 모달 |
| **템플릿 (Template)** | 오가니즘들을 배치한 화면 전체 수준의 뼈대 | Andon Board 화면 |

## 티어(Tier) 구분 — 우선순위

판단 기준: (1) 이미 디자인이 있는지, (2) 화면 종류를 가리지 않고 반복적으로 쓰이는지, (3) MES 업무 핵심(생산·품질·설비)과 직결되는지, (4) 내부 산업용 시스템에 실효성이 있는지.

| 티어 | 의미 |
|---|---|
| **1** | 즉시 코드화 — 이미 피그마에 디자인이 있음(`상태`=있음/부분). 재작업 없이 바로 코드화 가능 |
| **2** | 범용 필수 — 디자인은 없지만 화면 종류를 가리지 않고 거의 모든 화면에서 반복적으로 필요 |
| **3** | MES 핵심 특화 — 생산·품질·설비 관리라는 MES 본질 업무와 직결 |
| **4** | 부가·편의 기능 — 없어도 업무는 돌아가지만 있으면 UX·생산성이 좋아짐 |
| **5** | 재검토/제외 후보 — 소비자용 마케팅 SaaS 패턴 등 사내 폐쇄망 산업 시스템엔 실효성이 낮을 가능성 |

> 진행 순서 권장: **티어 1 → 2 → 3 → 4**, 티어 5는 실제 필요 여부 재확인 후 제외 검토.

## 사용법

1. `상태` 컬럼: `있음`(이미 구현됨) / `부분`(기본형은 있으나 상태·바리에이션 부족) / `없음`(신규 제작 필요)
2. `티어` 컬럼: 위 기준에 따른 우선순위 숫자(1~5)
3. `비고`에는 피그마상 위치나 참고 메모
4. **1차 총망라본 확정.** 피그마 "MES Design System" 페이지 및 하위 프레임들과 대조를 마쳤고, 여기서 확인되지 않은 항목은 전부 `없음`으로 처리했다.

---

## 0. 디자인 토큰 (Token)

| 항목 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Color Palette | 브랜드/시맨틱 색상 값 | 토큰 | 있음 | 1 | Figma "Color" 프레임에서 정확한 hex값까지 확인 완료(아래 표 참고) |
| Typography Scale | 제목·본문 텍스트 스타일 값 | 토큰 | 있음 | 1 | Figma "MES Design System": Pretendard Bold/SemiBold/Medium/Regular × 사이즈 스케일 |
| Spacing Scale | 여백·간격 단위 값 | 토큰 | 부분 | 2 | 실측 파일럿에서 로컬 변수 `padding/1`=2px, `padding/3`=8px 확인됨 — 전체 스텝(0/2/4 등)은 아직 미확인 |
| Radius Scale | 모서리 둥글기 값 | 토큰 | 부분 | 2 | 실측 파일럿 결과 단일 공용값이 아님 — Button은 basic/small 둘 다 4px, Input은 Default 4px/small **3px**로 사이즈별로 다름, 오버레이류(모달)는 16px. 컴포넌트별 개별 확인 필요, 자세한 내용은 [신규 컴포넌트 설계 프로세스 Step C-1](./신규_컴포넌트_설계_프로세스.md) 참고 |
| Shadow/Elevation Scale | 그림자·고도 값 | 토큰 | 있음 | 1 | Figma "컴포넌트 라이브러리" 파일 Foundation의 "Shadow" 프레임 확인 |
| Icon Set | 아이콘 에셋 모음 | 토큰 | 부분 | 2 | Figma "컴포넌트 라이브러리" 파일에는 "ICON - 크기별 제작필요"로 명시되어 팀에서도 미완성 인지 중. 이전 MES 파일에서 80여개 확인했던 것과의 관계는 별도 확인 필요 |
| Z-index Scale | 겹침 순서 값 | 토큰 | 없음 | 2 | |
| Breakpoint Scale | 반응형 화면 크기 기준값 | 토큰 | 없음 | 4 | 데스크탑 중심 사내 시스템 특성상 우선순위 낮음. 모바일 체크리스트 0번 섹션에서 모바일용 브레이크포인트 값 자체는 이미 확인됨 — 다만 모바일 전용 기준이라 데스크탑에 그대로 적용 가능한지는 별개 문제, 데스크탑에 반응형이 실제로 필요한지부터 재검토 필요(19번 섹션 참고) |

### 0-1. 실제 색상 토큰 값 (Figma "Color" 프레임 확인 완료)

**Gray Color**

| 단계 | Hex | 비고 |
|---|---|---|
| 0 | #FFFFFF | |
| 10 | #F8FAFC | |
| 20 | #EFF2F8 | |
| 30 | #E4E7EE | surface |
| 40 | #D7DCE5 | |
| 50 | #B4C0D3 | |
| 60 | ~~#96A0B5~~ → #99A3B8(실측 재확인, 19번 섹션 참고) | |
| 70 | #8491A7 | |
| 80 | #67738E | |
| 90 | #5C667B | |
| 100 | #475067 | |
| 110 | #373F57 | |
| 120 | #292E41 | |
| 130 | #011327 | Text |
| 140 | #000000 | |

**Primary Color**

| 단계 | Hex | 비고 |
|---|---|---|
| 10 | #EFF8FF | |
| 20 | #E8F5FF | |
| 30 | #C7E4FF | surface |
| 40 | #7BBBFF | |
| 50 | #4096FF | |
| 60 | #1573FB | Text |
| 70 | #0958D9 | Base |
| 80 | #003EB3 | |
| 90 | #002C8C | |
| 100 | #001D66 | |
| 110 | #00113D | |

**System Color — 위험(Danger)**

| 단계 | Hex | 비고 |
|---|---|---|
| 10 | #FBEFF0 | |
| 20 | #F5D6D9 | surface |
| 30 | #FFB7BC | |
| 40 | #FB8992 | |
| 50 | #FD6672 | |
| 60 | #F04452 | Base |
| 70 | #AB2B36 | Text |
| 80 | #7A1F26 | |
| 90 | #521419 | |
| 100 | #310C0F | |
| 110 | #21080A | |

> **재확인 완료(2026-07-16, `get_variable_defs`로 팔레트 전체 대조)**: Gray/Primary/Danger 팔레트의 각 단계 hex값을 Figma 라이브 변수로 교차 검증한 결과, Gray 60(`#96A0B5`→`#99A3B8`, 위 표에 반영됨) 1건만 오기재였고 나머지는 전부 일치했다. Danger 외 System Color(Warning/Success)는 데스크탑 Foundation의 "System Color" 구역에 Danger 그룹만 존재하고 Warning/Success 그룹 자체가 없음을 확인 — 모바일 체크리스트엔 있는 값이므로, 데스크탑에도 만들지 여부와 값(모바일과 동일하게 갈지)은 디자인 결정이 필요하다(19번 섹션에 등록).
>
> **2차 재검증 완료(2026-07-28, 다른 파일에서 교차 대조) → 팔레트 확정(CONFIRMED)**: 컴포넌트 라이브러리 파일이 아닌 별도 파일인 클라우드MES(fileKey `F4n5Zr04PAbiRjfIFQAo6v`) node `9873:81596`의 `get_variable_defs`로 같은 팔레트를 다시 대조한 결과 위 표와 100% 일치, 추가 오차 없음. 서로 다른 두 파일에서 각각 실측해 일치를 확인했으므로 이 팔레트는 더 이상 열린 질문이 아니라 확정값으로 취급한다(코드 쪽 반영: `component-library/src/app/globals.css`). 단, 팔레트 밖의 개별 hover 임시색(예: Button `opacityMain` hover의 `#D4EAFF` — 담당자 확인 결과 팔레트 색이 아니라 hover용으로 별도로 넣은 값) 같은 예외는 팔레트에 편입시키지 않고 해당 컴포넌트 코드에 출처와 함께 개별 기록한다.

---

## 1. 액션 (Actions)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Button (Primary) | 주요 액션 버튼 | 아톰 | 있음 | 1 | Figma "Button": Basic/Small/Xsmall 3사이즈 × 6컬러 × hover-press/disable |
| Button (Secondary/Outline/Ghost) | 보조 액션 버튼 | 아톰 | 있음 | 1 | 위 매트릭스에 테두리형·연한색 버전 포함 |
| Icon Button | 아이콘만 있는 버튼 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`icon-button.tsx`). Figma 디자인 없어서 기존 컴포넌트들이 각자 인라인으로 만들어 쓰던 아이콘 버튼 패턴(ConfirmDialog 닫기, Sidebar 접기 등)을 역으로 관찰해 공용화 — 새 디자인 아님, 기존 값 재사용(판단값) |
| Button Group | 버튼 여러 개 묶음 | 몰큘 | 없음 | 2 | |
| Toggle Button | 눌림 상태를 갖는 버튼 | 아톰 | 없음 | 2 | |
| Split Button | 기본 액션 + 드롭다운 옵션 결합 버튼 | 몰큘 | 없음 | 4 | |
| Floating Action Button (FAB) | 화면에 떠 있는 원형 액션 버튼 | 아톰 | 없음 | 5 | 모바일 앱 패턴, 데스크탑 MES엔 불필요 가능성 |

## 2. 선택·토글 (Selection & Toggle)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Checkbox | 체크박스 | 아톰 | 있음 | 1 | 2026-07-28 재확인: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v) node 9873:82462에 실제로 존재함(이전에 "없음"으로 기재됐던 건 이 파일을 확인 안 했던 것) — 코드화 완료(`checkbox.tsx`). 단, disabled 상태는 Figma에 없어 판단값으로 구현. 같은 날 추가: Table 그룹 체크박스용으로 `indeterminate`(중간선택) prop 신규 추가 — Figma에 없는 상태라 판단 구현(main/black 색상 지원). 2026-07-29 확인: "default(회색)/main(파랑)/black(검정) 중 실제로 어떤 상황에 쓰이는지" 확인 필요했던 항목에 담당자 답변 — 실사용에서는 원래 `color="gray"`(코드상 "default"/통칭 "checked-gray")를 기본으로 사용 중이라고 확인. 컴포넌트 코드/기본값 변경 없이 항목만 종결 |
| Radio Button | 라디오버튼 | 아톰 | 있음 | 1 | Figma "MES Design System" Direction 섹션 확인. 2026-07-28 클라우드MES 파일 node 9873:82508 기준 정밀실측 후 코드화 완료(`radio.tsx`) |
| Switch / Toggle | 온오프 스위치 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`switch.tsx`). Figma 디자인 없어서 Checkbox와 동일한 peer 오버레이 패턴 재사용, 색상은 기존 시맨틱 토큰(판단값) |
| Segmented Control | 세그먼트형 선택 컨트롤 | 몰큘 | 없음 | 4 | |
| Slider (Range) | 범위 슬라이더 | 아톰 | 없음 | 3 | 수치 필터 범위 지정 등에 활용 가능 |
| Rating (별점) | 별점 등 평점 입력 | 몰큘 | 없음 | 5 | 소비자 서비스 패턴 |
| Chip Selector | 칩 형태 다중 선택 | 몰큘 | 없음 | 4 | |

## 3. 입력·폼 (Inputs & Forms)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Text Input | 한 줄 텍스트 입력 | 아톰 | 있음 | 1 | Figma "Input Textbox/Selectbox" 매트릭스 |
| Textarea | 여러 줄 텍스트 입력 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`textarea.tsx`). Figma 디자인 없어서 Input과 동일한 톤(테두리/배경/포커스/radius) 재사용, min-h/py만 판단값 |
| Number Input | 숫자 입력(증감 버튼 포함) | 몰큘 | 없음 | 2 | |
| Search Input | 검색창 | 몰큘 | 있음 | 1 | 위 Input 매트릭스에 search 컬럼 포함. 2026-08-03 별도 컴포넌트로 코드화(`search-input.tsx`, node 17360:46256/20186:68084 실측, 200×32px 고정폭) — 담당자 지정 동작: 검색어를 입력하면 배경색(Primary-20)이 깔려 "검색어가 명확히 입력됨"을 표시 |
| Password Input | 비밀번호 입력(보기/숨기기) | 몰큘 | 없음 | 2 | 로그인 화면 필수 |
| Select (Dropdown) | 단일 선택 드롭다운 | 몰큘 | 있음 | 1 | Figma "Selectbox" 확인됨 |
| Combobox | 검색 가능한 선택형 드롭다운 | 몰큘 | 있음 | 1 | 2026-07-28 코드화 완료(`combobox.tsx`, Radix Popover 기반) — Selectbox와 별도 컴포넌트로 분리. 상세는 19번 섹션 참고 |
| Multi-select / Tag Input | 다중 선택·태그 입력 | 몰큘 | 없음 | 2 | 필터 등에 활용. 18-1 Select 변형 분석의 결론(MES 필터에서 실사용 가능성 높음)을 반영해 티어3→2로 상향 |
| Filter (필터 추가 트리거 + 플라이아웃 패널 + 활성 태그, 통합) | 목록·테이블 상단 필터 진입점 | 몰큘 | 있음 | 1 | 2026-07-28 완료·통합, 이후 담당자 재검토로 2차 수정까지 완료. 트리거+태그 컨테이너(node 9873:83762)는 정밀실측, 플라이아웃 패널은 Figma에 별도 노드가 없어 조립형으로 구현. **2차 수정 3건**: (1) 태그 표시 방식을 "1개 선택=개수 뱃지/2개 이상=전체보기" 2종에서 **선택 개수만 항상 표시**로 통일(전체보기가 실제 전체선택 여부와 무관해 혼란을 줘서 담당자가 정책 변경, filter-tag.tsx), (2) 트리거 박스와 활성 태그 박스를 테두리 공유하는 통짜 구조에서 **서로 다른 두 개의 독립 박스**로 분리(태그 없으면 트리거만 노출), (3) 트리거 아이콘을 임의로 골랐던 lucide `Filter`(깔때기)에서 **`SlidersHorizontal`로 교체** — node 9873:83762의 벡터 좌표(원 3개가 위/중간/아래 가로줄에 각각 다른 위치로 배치된 구조)를 재분석해 실제로는 슬라이더형 아이콘임을 확인함(SVG 원본은 샌드박스 네트워크 제약으로 여전히 직접 다운로드 불가, 좌표 분석 기반 대체) |
| Date Picker | 날짜 선택기 | 오가니즘 | 없음 | 2 | |
| Date Range Picker | 기간(시작~종료) 선택기 | 오가니즘 | 없음 | 2 | |
| Time Picker | 시간 선택기 | 오가니즘 | 없음 | 2 | |
| File Upload / Dropzone | 파일 업로드 영역 | 몰큘 | 없음 | 3 | 문서·첨부 관리 |
| Form Field | 라벨+입력+헬퍼텍스트+에러 조합 | 몰큘 | 있음 | 1 | 위 Input 매트릭스에 "라벨포함" 행 존재 |
| OTP / PIN Input | 인증번호 입력 | 몰큘 | 없음 | 4 | |
| Color Picker | 색상 선택기 | 오가니즘 | 없음 | 5 | 디자인 도구용, MES엔 불필요 |
| Rich Text Editor | 서식 있는 텍스트 편집기 | 오가니즘 | 없음 | 4 | |

## 4. 내비게이션 (Navigation)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Navbar / Top Nav | 상단 내비게이션 바 | 오가니즘 | 없음 | 2 | |
| Sidebar / Side Nav | 좌측 내비게이션 | 오가니즘 | 있음 | 1 | 2026-07-29 코드화, 2026-07-30/07-31 재검증: `components/ui/sidebar.tsx`. 접기버튼(hover), 1-depth 항목(hover=Gray-120/active=Primary-60), 2-depth 항목(hover/active, 트리 연결선), MES/FEMS 토글은 담당자 지시로 의도적 미구현 실측·반영 완료. 2026-07-31 22차에 마지막 남았던 접기(collapsed rail/`SNB-hide`, node 9873:83651) 상태까지 `collapsed` prop으로 구현 — 62px 아이콘 레일, 라벨 숨김, hover 시 2-depth 플라이아웃(group-hover CSS, 판단값 구현). 이걸로 "부분"에서 "있음"으로 전환 |
| Breadcrumb | 현재 위치 경로 표시 | 몰큘 | 없음 | 2 | |
| Tabs | 탭 전환 | 몰큘 | 있음 | 1 | 2026-07-29 코드화, 2026-07-30 재검증: `components/ui/page-top-tab-item.tsx`(node 157:18051 컴포넌트 세트, default/hover/active 3종 전부 실측). active는 배경 Gray-110 + 제목 SemiBold로 정정(이전 판단값은 틀렸었음) |
| Pagination | 페이지네이션 | 몰큘 | 없음 | 2 | |
| Stepper / Wizard | 단계형 진행 표시 | 오가니즘 | 없음 | 3 | 작업지시 등록형 멀티스텝 폼에 유용 |
| Dropdown Menu | 클릭 시 열리는 메뉴 | 몰큘 | 없음 | 2 | |
| Context Menu | 우클릭 메뉴 | 몰큘 | 없음 | 4 | |
| Command Palette | Cmd+K 형태의 빠른 검색·실행창 | 오가니즘 | 없음 | 5 | |
| Back to Top | 맨 위로 가기 버튼 | 아톰 | 없음 | 4 | |

## 5. 데이터 표시 (Data Display)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Table | 표 | 오가니즘 | 있음 | 1 | 2026-07-28 코드화 완료(`table.tsx`) — 원본 정의(node 9873:83780)와 실제 수정 화면 "생산계획(일) 리스트"(node 16938:42501) 대조 실측. 헤더 배경(Gray-10) 추가, 점선 세로 구분선, 선택행/신규행의 구분선 진하기 변화(Gray-30), 신규행 좌측 빨간 점(Danger-60, 판단값), 그룹행 핑크 배경(#fde9ea) 반영. 같은 날 2차: 담당자가 실제 운영 화면(생산실적 그룹화 조회) 스크린샷으로 지적한 5건 반영 — 2·3차 그룹화(`TableGroup.groups` 재귀 중첩, depth별 배경색은 판단값), 그룹 합계열/총계열이 헤더 컬럼과 어긋나던 정렬 버그 수정(라벨을 첫 컬럼 Cell 안에 넣는 구조로 변경), 그룹 헤더 행 체크박스+indeterminate(중간선택) 상태 추가(Checkbox 컴포넌트에 신규 prop 추가), 헤더 텍스트 정렬이 데이터 셀과 항상 일치하도록 수정. 같은 날 3차(재검토) 4건: 그룹 펼침 버튼이 체크박스처럼 보여 겹쳐 보이던 것을 테두리·배경 제거해 수정, 지시일→설비→담당기사 3단 그룹화 데모로 확장(컴포넌트 로직 변경 없음, 이미 재귀 구조였음), 펼침/접힘 회전을 90도(왼쪽↔위)에서 180도(위↔아래)로 수정, 헤더에 그룹 depth별(현재 3개) 전체 접기/펼치기 버튼 추가. 같은 날 4차 후속: 3차에서 임의로 지웠던 펼침 버튼 테두리·배경 박스를 담당자가 준 정확한 값(22x22px/Gray-0/radius3/Gray-50)으로 원상복구. 같은 날 5차: 체크박스를 항상 최좌측 고정하고 마스터 토글 버튼을 그 오른쪽으로 재배치 + "체크박스+마스터 토글 영역"을 모든 행 종류(헤더/그룹행/데이터행/총계행)가 동일하게 예약하도록 통일해 헤더-바디 정렬 버그 재수정, 데모 Table 섹션 폭 제약 해제, `TableColumn.width`에 가변폭(`{min, grow?}`) 지원 타입 추가(실제 컬럼 전환은 보류). 같은 날 6차: 헤더 마스터 토글 버튼과 그룹행 depth별 펼침 버튼을 같은 폭의 슬롯 구조로 통일해 세로 정렬 일치, 신규행 빨간 점을 체크박스 오른쪽으로 이동, 그룹/총계 라벨을 컬럼 align과 무관하게 좌측 고정 + 데모 컬럼 정렬 일관성 재정리(equipment 가운데로 통일). 같은 날 7차: 신규행 빨간 점을 체크박스 우측 정확히 10px(`CHECKBOX_COLUMN_WIDTH`/`NEW_DOT_GAP_FROM_CHECKBOX` 상수화)로 고정하면서 `TotalsRow` 체크박스 칼럼이 border-box 특성으로 다른 행보다 12px 좁게 렌더링되던 선행 버그 발견·수정, 헤더 라벨 셀은 컬럼 align과 무관하게 항상 가운데정렬(데이터 셀은 컬럼별 align 유지), 숫자(데이터행+그룹집계+총계) 전체에 1000단위 콤마 적용. 같은 날 7차 후속(데모 구성 3건): 창고명/품목구분 컬럼 제거로 데모 폭 축소, 담당기사 값 전부 "이해빈"으로 교체, 기존 15컬럼 합본 데모는 유지하면서 3컬럼짜리 단순 데이터로 헤더만/그룹화만/컬럼 2개 이상(그룹 없음)/총계행만 4개의 분리 미니 데모 추가(컴포넌트 코드 변경 없이 데모 구성만 조정). 같은 날 8차: 합본 데모가 "시선강탈"이라는 지적으로 합본 Table 데모 1개만 기본 접힘 상태의 토글로 변경(미니 데모 4개는 그대로 유지, 컴포넌트 코드 변경 없음). 같은 날 8차 후속: 합본 데모의 라운드별 수정 이력 설명 문단을 삭제(문서에 이미 기록돼 있어 데모 화면엔 불필요)하고, 접기/펼치기 헤더 줄 폭을 섹션 자체는 다른 데모와 동일한 max-w-[960px]로 맞추고 실제 `<Table>`만 내부 overflow-x-auto로 감싸 가로 스크롤 처리. 2026-07-29 확인: 담당자가 처음엔 "disable 스타일 없음"이라고 답했다가, 실제 화면(판매관리 리스트) 스크린샷을 다시 근거로 정확한 값을 지정 — 비활성 행은 텍스트 Gray-80/배경 Gray-10. `DataRow`의 기존 `opacity-50` 판단값을 이 값으로 교체 완료(`table.tsx`, 데모는 `rowR8`로 확인 가능). "분할" 변형은 담당자도 무엇을 가리키는지 특정 못 해서 계속 보류(추가 자료 없이는 진행 불가). 그룹 들여쓰기 px/depth별 정확한 배경색은 여전히 실제 화면 스크린샷 기반 판단값(실측 아님). 체크박스 미선택 상태 관련 항목은 5번 섹션 Checkbox 항목에서 담당자 확인으로 종결. 상세 경위는 `AGENTS.md` "Table 작업 회고" 섹션과 `docs/Table_수정_대기목록.md` 참고. |
| Data Grid | 정렬·필터 가능한 표 | 오가니즘 | 없음 | 3 | MES 핵심 |
| List | 리스트 | 몰큘 | 없음 | 2 | |
| Card | 카드 | 몰큘 | 없음 | 2 | |
| Avatar | 프로필 이미지 | 아톰 | 없음 | 4 | |
| Avatar Group | 아바타 겹침 그룹 | 몰큘 | 없음 | 5 | |
| Badge | 상태/개수 배지 | 아톰 | 있음 | 1 | 2026-07-28 클라우드MES 파일 node 13687:33504 기준 정밀실측 후 코드화 완료(`badge.tsx`, 7종). orange/yellow는 Figma 컴포넌트 이름과 실제 색상이 다름(각각 실제로는 gray/blue). 2026-07-29 담당자 확정: "원본 이름은 상관없이 색 대로 이름을 다시 매겨" — 값 변경 없이 variant 키만 실제 색 기준으로 개명(orange→grayFill, yellow→blue2, variant6→blueLight, variant7→blueOutline, blue/red/gray는 그대로). blue2가 blue와 값이 완전히 동일한 이유(둘 다 "완료" 계열 상태에 왜 다른 스타일이 필요한지 포함)는 여전히 확인 필요(19번 섹션 참고) |
| Chip / Tag | 태그·라벨 | 아톰 | 있음 | 1 | 2026-07-28 완료. 필터 전용 태그(node 9873:83747, `filter-tag.tsx`)와 범용 3색 태그(node 9873:83675, `tag.tsx`, fill-main/gray/red) 둘 다 정밀실측해 코드화 완료. 담당자 확인: 범용 3색 태그는 "거의 안 씀", 실제로는 Badge(badge.tsx)를 훨씬 많이 사용 — 최소 구현만 해둠 |
| Tooltip | 말풍선 설명 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`tooltip.tsx`). Figma 디자인 없음 — Radix 의존성 추가 없이 CSS group-hover 기반 경량 구현(판단값), 포털/딜레이/터치 롱프레스 미지원 |
| Progress Bar | 진행률 막대 | 아톰 | 있음 | 1 | 2026-07-28 클라우드MES 파일 node 20144:101580 기준 정밀실측 후 코드화 완료(`progress.tsx`). 트랙 Gray-40, 채움 Gray-100(담당자 확인). 같은 날 담당자 지적으로 재실측: 바-라벨 간격 자체는 2px가 맞았지만, 라벨이 44px 고정폭 박스 안에서 우측정렬되는 구조(자릿수 바뀌어도 컴포넌트 전체 폭 고정)가 처음 구현 때 빠져있던 걸 발견해 복원 |
| Progress Circle | 진행률 원형 | 아톰 | 없음 | 4 | |
| Skeleton | 로딩 중 placeholder | 아톰 | 있음 | 2 | 2026-07-31 코드화(`skeleton.tsx`). Figma 디자인 없음 — text/rect/circle 3variant, `animate-pulse`(판단값) |
| Stat / KPI Card | 숫자 지표 카드 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Asset/Templates의 "Dashboard Card" 확인 |
| Timeline | 시간순 타임라인 | 오가니즘 | 없음 | 3 | 이력추적·알람 이력 |
| Tree View | 계층형 트리 목록 | 오가니즘 | 없음 | 3 | BOM·계보 등 MES에 흔함 |
| Chart | 라인/바/파이 차트 | 오가니즘 | 없음 | 3 | SPC·트렌드 등 |
| Calendar (표시용) | 달력 뷰 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Side Modal "검사 모달/배열" 내 캘린더 확인 |
| Carousel | 이미지·콘텐츠 슬라이더 | 오가니즘 | 없음 | 5 | 마케팅용 패턴 |

## 6. 피드백·오버레이 (Feedback & Overlay)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Alert / Banner | 상단/인라인 경고 배너 | 몰큘 | 있음 | 1 | 2026-07-29 완료 — 클라우드MES 파일 "모달" 갤러리(node 18887:62605)에서 발견한 노란 안내 배너(안내문+"OO 바로가기 →" 링크)를 `notice-banner.tsx`(`NoticeBanner`)로 코드화. 배경/테두리/아이콘 색은 `get_variable_defs`로 실측(Yellow-10/20/50, `globals.css`에 신규 Yellow 팔레트 추가), padding/radius/배너 아이콘 벡터는 `get_metadata`/`get_design_context`가 이 노드에서 계속 실패(SSE 파싱 에러)해서 판단값(19번 섹션 참고). 담당자는 이 요소를 "배너"보다 "도움말"/"툴팁"이라고 부름. ConfirmDialog의 `banner` prop으로 통합 가능하고 독립 컴포넌트로도 사용 가능 — 통합 시 버튼 영역과의 간격은 담당자가 확정한 20px(처음엔 52px로 잘못 판단했다가 정정). 아이콘도 처음엔 느낌표(`IconExclamationCircle`)로 임의 처리했다가 담당자가 "전구 모양"이라고 확정해줘서 `lucide-react`의 `Lightbulb`로 교체(아직 실측 벡터 아님, 실제 SVG export 시 재교체 필요). 2026-07-29 곧바로 이어서: 배너 없는 일반 형태의 본문-버튼 간격도 담당자가 "40px쯤 되어 보인다, 20px로 하자"고 지적 — 원래 32px+20px=52px는 node 11106:37629 실측값 그대로였지만(임의 판단 아니었음), 담당자 명시적 지시로 20px로 축소 확정. 이제 이 값은 원본 실측치보다 담당자 지정값이 우선하는 사례로 별도 기록 |
| Toast (스낵바 없음) | 짧게 떴다 사라지는 알림 | 몰큘 | 있음 | 1 | 2026-07-28 완료. 담당자 확인: 스낵바는 없고 Toast만 있음. 클라우드MES 파일 TOAST-RED(node 11098:37167)/TOAST-BLUE(node 11028:35650) 정밀실측 후 코드화(`toast.tsx`). 두 색상이 하나의 공유 컴포넌트가 아니라 별개 프레임이라 gap(8px/16px)·닫기아이콘 크기(16px/18px)·테두리색이 서로 다름 — 실측 그대로 반영. BLUE 배경색(#156BE9)은 확정 Primary-60(#1573FB)과 미묘하게 다른 값이라 팔레트에 편입시키지 않고 원본값 유지 |
| Modal / Dialog | 화면 중앙 팝업 | 오가니즘 | 있음 | 1 | Type01: 중앙 모달, 최대높이 80vh |
| Drawer / Sheet | 옆에서 슬라이드로 열리는 패널 | 오가니즘 | 없음 | 2 | |
| Popover | 특정 요소 옆에 뜨는 작은 팝업 | 몰큘 | 없음 | 2 | |
| Confirm Dialog | 확인/취소 확인창 | 몰큘 | 있음 | 1 | 2026-07-28 완료(1형태만). 클라우드MES 파일 "modal-error"(node 11106:37629, 에러 안내 톤, 버튼 1개) 정밀실측 후 코드화(`confirm-dialog.tsx`, Radix Dialog 기반). **원래 이 항목이 참조하던 "삭제 모달 - 드롭다운/라디오버튼" 2종(Center Modal 안의 다른 변형)은 이번 실측 대상이 아니었음** — 확인/취소 2버튼 형태나 성공/정보 톤 변형이 별도로 있는지 확인 필요(19번 섹션 참고). 2026-07-29 담당자가 준 Figma "모달" 갤러리(node 18887:62605)로 확인·확장: 확인/취소 2버튼은 기존 `actions` 배열로 이미 가능했음(코드 변경 없음), `tone` prop 신규 추가로 error(기존)/warning(신규, Yellow-50)/info(신규, Primary-60) 3톤 지원, `banner` prop으로 안내 배너(아래 NoticeBanner) 통합 지원 추가. `get_metadata`/`get_design_context`가 이 노드에서 SSE 파싱 에러로 계속 실패해서 배너 세부 px는 판단값(19번 섹션 참고)이지만, "배너(담당자 호칭 도움말/툴팁)가 있을 때 배너-버튼 간격"은 담당자가 정확한 값(20px)을 직접 줘서 확정 반영함(기존엔 52px로 잘못 판단했었음). 모바일(배경 딤) 변형은 범위 밖으로 보류 |
| Loading Spinner | 로딩 스피너 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`loading-spinner.tsx`). Figma 디자인 없음 — lucide `LoaderCircle` + `animate-spin`(판단값) |
| Empty State | 데이터 없음 화면 | 몰큘 | 없음 | 2 | |
| Error State | 에러 화면 | 몰큘 | 없음 | 2 | |
| Notification / Bell | 알림 아이콘·목록 | 오가니즘 | 있음 | 1 | 2026-07-30 코드화: `components/ui/notification-panel.tsx`(node 157:15771 "알림모달 2"/157:15833 "알림 내역 존재 X" 실측). AlarmListItem을 재사용하는 드롭다운 패널 — 헤더("전체 알림" 탭+카운트+닫기), 리스트(높이 350px 스크롤) 또는 빈 상태 문구로 구성. "미확인"/"확인" 탭 추정 자리는 이 패널 트리에 실제로 포함되어 있지 않아 확인 필요로 제외. 벨 아이콘 트리거 자체는 미실측. 2026-08-03 담당자가 실제 서비스 스크린샷 2건으로 추가 지시(Figma 링크 없음, 판단값): (1) 항목 클릭 시 목록에서 제거 — `onItemClick(id)` 콜백 신규 추가(제거 로직 자체는 호출부 책임, 컴포넌트는 컨트롤형 유지), (2) 설정(톱니) 아이콘 클릭 시 패널 내용이 "알림 설정"(뒤로가기+제목+알림 유형별 Switch 토글 목록) 화면으로 전환 — `settingsItems`/`onSettingsItemChange` prop + 내부 `view` state로 구현. 톱니 아이콘 자체는 목적지 화면만 스크린샷에 있고 트리거 모양은 없어서 Sidebar/QuickQuery와 동일한 `lucide-react` `Settings` placeholder 사용(판단값). 곧바로 이어서 담당자가 "하단에 설정 아이콘이 두 개인데 작동 안 하는 작대기형(필터)은 빼고 톱니만 남겨라"고 지적 — 원래부터 동작 미실측이던 필터 아이콘(`IconFilter`)과 `onFilterClick` prop을 컴포넌트에서 완전히 제거함 |

## 7. 접기·펼치기 (Disclosure)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Accordion | 아코디언 | 오가니즘 | 없음 | 2 | |
| Collapsible | 접고 펼치는 영역 | 몰큘 | 없음 | 2 | |
| Disclosure Panel | 더보기 형태 패널 | 몰큘 | 없음 | 4 | |

## 8. 레이아웃·구조 (Layout & Structure)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Divider / Separator | 구분선 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`divider.tsx`). Figma 디자인 없음 — 기존 구분선 색(`border-mes-border-default`) 재사용, 가로/세로 지원 |
| Grid / Container | 레이아웃 그리드 | 레이아웃 유틸 | 없음 | 2 | |
| Panel | 패널 영역 | 몰큘 | 없음 | 2 | |
| Resizable Panel | 크기 조절 가능한 영역 | 오가니즘 | 없음 | 3 | 다중 창 작업에 유용 |
| Scroll Area | 커스텀 스크롤 영역 | 레이아웃 유틸 | 없음 | 2 | |
| Sticky Header/Footer | 고정 헤더·푸터 | 오가니즘 | 없음 | 2 | |
| Split View | 좌우/상하 분할 뷰 | 오가니즘 | 없음 | 3 | |

## 9. 타이포그래피·미디어 (Typography & Media)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Heading Styles | 제목 스타일 체계 | 토큰 | 있음 | 1 | Pretendard Bold/SemiBold |
| Body Text Styles | 본문 텍스트 스타일 체계 | 토큰 | 있음 | 1 | Pretendard Medium/Regular |
| Image / Thumbnail | 이미지·썸네일 표시 | 아톰 | 없음 | 3 | 제품·설비 사진 |
| Video Player | 비디오 플레이어 | 오가니즘 | 없음 | 5 | |
| Logo / Brandmark | 로고 표기 | 아톰 | 없음 | 2 | 헤더에 항상 필요 |
| Empty Illustration | 빈 상태용 일러스트 | 아톰 | 없음 | 4 | |

## 10. AI 시대 특화 패턴

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Chat Bubble / Message | 대화형 메시지 말풍선 | 몰큘 | 없음 | 4 | |
| AI Prompt Input Box | AI에게 지시를 입력하는 창 | 오가니즘 | 없음 | 4 | |
| Streaming Text Indicator | 텍스트가 실시간 생성되는 표시 | 아톰 | 없음 | 5 | |
| Code Block | 코드 표시 블록 | 몰큘 | 없음 | 5 | |
| Markdown Renderer | 마크다운 렌더링 영역 | 오가니즘 | 없음 | 5 | |
| Suggestion Chip | AI 추천 액션 칩 | 아톰 | 없음 | 5 | |
| Source / Citation Badge | 출처 표시 배지 | 아톰 | 없음 | 5 | |

## 11. SaaS 제품에서 자주 쓰이는 복합 패턴

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Filter Bar / Filter Panel | 목록·테이블 상단 필터 영역 | 오가니즘 | 있음 | 1 | Figma "Filter" 확인됨 |
| GroupQuery (그룹화 조회) | 테이블 데이터를 Level 1~3 필드로 그룹화 지정 | 몰큘 | 있음 | 1 | 2026-08-03. 담당자가 "생산지시" 화면 스크린샷으로 전달(Figma 링크 없음, 스크린샷 기반 판단값). 다만 "빠른 조회" 조사 중 같은 상단바 프레임(node 17360:46223)에 실측 노드로도 포함돼 있어 색상/치수는 실측값 채택. `group-query.tsx` |
| QuickQuery (빠른 조회) | 조회 조건(그룹화/필터/조회 설정)을 즐겨찾기 3개까지 저장·적용 | 오가니즘 | 있음 | 1 | 2026-08-03. Figma node 17360:46359(트리거 바)+17963:81433(조회 조건 프리셋 모달) 실측. `quick-query.tsx` |
| Bulk Action Toolbar | 다중 선택 시 나타나는 액션 바 | 몰큘 | 없음 | 2 | 2026-07-31 `bulk-action-toolbar.tsx`로 코드화했다가 담당자가 "있으면 좋을 것 같긴 한데 지금 안 쓰고 있고 그게 필요한 상황도 아니다"라고 해서 롤백 |
| Table Bulk Selection | 테이블 행 다중 선택 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal "탭 구분 모달"/"필터·검색"에서 전체선택 체크박스 확인 |
| Column Visibility Toggle | 테이블 컬럼 표시/숨김 설정 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "컬럼 설정" 확인 |
| Row Expand / Detail Drawer | 행 클릭 시 상세 정보 확장 | 오가니즘 | 없음 | 3 | |
| Inline Edit | 클릭해서 바로 수정하는 텍스트 | 몰큘 | 없음 | 3 | |
| Drag Handle / Sortable List | 드래그로 순서 변경 | 몰큘 | 없음 | 4 | |
| User / Account Menu | 우측 상단 프로필 드롭다운 | 몰큘 | 없음 | 2 | 헤더에 항상 필요 |
| Global Search / Search Overlay | 전역 검색창 | 오가니즘 | 없음 | 3 | |
| Onboarding Tooltip / Product Tour | 신규 사용자 안내 툴팁 | 오가니즘 | 없음 | 5 | |
| Onboarding Checklist | 초기 설정 체크리스트 | 오가니즘 | 없음 | 5 | |
| Settings List | 설정 항목 리스트(토글 포함) | 오가니즘 | 없음 | 3 | |
| Comment / Activity Feed | 댓글·활동 기록 피드 | 오가니즘 | 없음 | 4 | |
| Kanban Board | 칸반 보드(카드 드래그 이동) | 오가니즘 | 없음 | 4 | |
| Global Top Loading Bar | 페이지 상단 로딩 진행바 | 아톰 | 없음 | 4 | |
| Cookie Consent Banner | 쿠키 동의 배너 | 몰큘 | 없음 | 5 | |
| Feedback Widget | 설문·피드백 수집 팝업 | 오가니즘 | 없음 | 5 | |
| Live Chat Widget | 실시간 채팅 상담 위젯 | 오가니즘 | 없음 | 5 | |
| Dark Mode Toggle | 다크모드 전환 스위치 | 아톰 | 없음 | 5 | |
| Language / Locale Selector | 언어 선택 | 몰큘 | 없음 | 5 | |
| Pricing Table | 요금제 비교 표 | 오가니즘 | 없음 | 5 | |
| Upgrade / Paywall Prompt | 업그레이드 유도 배너 | 몰큘 | 없음 | 5 | |

## 12. 대조 검증으로 추가된 컴포넌트

shadcn/ui, Ant Design 공식 문서와 대조해 발견된 항목.

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Kbd (Keyboard Key) | 키보드 단축키 표시 | 아톰 | 없음 | 4 | |
| Aspect Ratio | 미디어 비율 고정 컨테이너 | 레이아웃 유틸 | 없음 | 4 | |
| Cascader | 계층형 연속 선택 드롭다운 | 오가니즘 | 없음 | 3 | 설비·지역 트리 선택에 활용 |
| Mentions | @ 멘션 자동완성 입력 | 몰큘 | 없음 | 5 | |
| Transfer (Dual List) | 두 목록 간 항목 이동 | 오가니즘 | 없음 | 3 | 권한 할당 등 관리기능 |
| Tree Select | 트리 구조를 가진 선택 드롭다운 | 오가니즘 | 없음 | 3 | |
| QR Code | QR코드 생성·표시 | 아톰 | 없음 | 3 | 라벨·추적 관련 |
| Descriptions (Key-Value List) | 상세 정보 키-값 리스트 | 몰큘 | 없음 | 2 | 상세보기 화면에 흔함 |
| Result Page | 성공/실패/404 등 결과 안내 화면 | 오가니즘 | 없음 | 3 | |
| Watermark | 워터마크 오버레이 | 아톰 | 없음 | 5 | |
| Masonry Grid | 핀터레스트형 그리드 레이아웃 | 오가니즘 | 없음 | 5 | |
| Anchor / Scroll Spy | 스크롤 위치에 따라 활성화되는 목차 내비게이션 | 몰큘 | 없음 | 4 | |

> 검증 출처: [shadcn/ui Components](https://ui.shadcn.com/docs/components), [Ant Design Components Overview](https://ant.design/components/overview)

## 13. 2차 대조 검증으로 추가된 컴포넌트 (Mantine 등)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Mask Input | 형식이 정해진 입력(자동 포맷팅) | 몰큘 | 없음 | 3 | |
| Close Button (X) | 모달·배너 등을 닫는 X 버튼 | 아톰 | 있음 | 2 | 2026-07-31 코드화 — `icon-button.tsx`에 `IconButton` 기반 프리셋(`CloseButton`)으로 같이 구현. 기존 다이얼로그들의 인라인 닫기 버튼은 이번엔 리팩터링하지 않음(범위 밖) |
| Copy Button | 클립보드 복사 버튼 | 아톰 | 없음 | 3 | |
| Burger (Hamburger Menu) | 햄버거 메뉴 아이콘 버튼 | 아톰 | 없음 | 3 | |
| Loading Overlay | 특정 영역을 덮는 로딩 오버레이 | 몰큘 | 없음 | 2 | |
| Backdrop / Dim Overlay | 모달 등의 배경 딤 처리 | 아톰 | 없음 | 2 | 2026-07-31 `backdrop.tsx`로 코드화했다가 담당자가 "왜 넣었냐 빼라"고 해서 롤백. ConfirmDialog/RadioChoiceDialog는 각자 Radix Overlay로 이미 잘 처리되고 있어 별도 공용 아톰이 불필요하다고 판단 |
| Status Indicator (Dot) | 상태 점(온라인 등) | 아톰 | 없음 | 3 | |
| Overflow List ("+N more") | 목록 초과 시 "+N개 더" 표시 | 몰큘 | 없음 | 4 | |
| Spoiler (더보기/접기 텍스트) | 긴 텍스트 일부만 보여주고 펼치기 | 몰큘 | 없음 | 4 | |
| Blockquote | 인용구 블록 | 아톰 | 없음 | 5 | |
| Search Highlight Text | 검색어 하이라이트 표시 | 아톰 | 없음 | 3 | |
| Marquee | 흐르는 공지 텍스트 | 몰큘 | 없음 | 5 | |

> 검증 출처: [Mantine Components](https://mantine.dev/core/package/)

## 14. 데이터 그리드 세부 패턴 (MES 특화)

모두 5번 카테고리 Table/Data Grid 오가니즘의 변형·확장 기능. MES 핵심이라 전부 티어 3.

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Frozen Column Grid | 스크롤해도 고정되는 컬럼이 있는 그리드 | 오가니즘 | 없음 | 3 | |
| Grouped Header Grid | 다단(2단 이상) 헤더 그리드 | 오가니즘 | 없음 | 3 | |
| Row Grouping / Expandable Sub-row | 행 그룹화·하위 행 펼치기 | 오가니즘 | 없음 | 3 | |
| Master-Detail Grid (Nested Grid) | 그리드 안에 또 다른 그리드 | 오가니즘 | 없음 | 3 | |
| Inline Cell Edit Grid | 셀 클릭해 바로 수정 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "테이블 일괄 변경" 확인 |
| Cell Status Color Grid | 값에 따라 셀 색이 달라지는 그리드 | 오가니즘 | 없음 | 3 | |
| Text Link Cell | 클릭 시 상세로 이동하는 텍스트 셀 | 몰큘 | 없음 | 3 | |
| Icon Cell | 상태·액션 아이콘이 들어간 셀 | 몰큘 | 없음 | 3 | |
| Bulk Selection + Action Toolbar Grid | 다중 선택 후 일괄 처리 버튼이 뜨는 그리드 | 오가니즘 | 부분 | 1 | 2026-07-31 Table 연동까지 했다가 액션 바(`bulk-action-toolbar.tsx`) 자체를 담당자 요청으로 롤백 — 테이블 다중 선택 자체는 여전히 됨(부분 유지), 액션 바는 필요해지면 다시 구현 |
| Column Resize / Reorder / Show-Hide | 컬럼 너비·순서·표시 설정 | 몰큘 | 없음 | 3 | |
| Grid Export / Print | 엑셀 내보내기·인쇄 버튼 | 아톰 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "일자/조회/다운로드" 확인 |
| Virtual Scroll Grid | 대용량 데이터 가상 스크롤 | 오가니즘 | 없음 | 3 | |
| Real-time Update Indicator (Grid) | 실시간 갱신 표시 | 오가니즘 | 없음 | 3 | |

## 15. 팝업/오버레이 레이아웃 패턴 (MES 특화)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Center Modal | 화면 중앙 기본 팝업 | 오가니즘 | 보류 | 1 | Type01. 2026-07-29 한 차례 코드화했으나(node 168:37994) 담당자가 "Center Modal과 Side Slide Panel이 위계가 비슷해서 나중에 같이 자료 보내주겠다"며 보류 지시 — 코드는 `docs/보류_컴포넌트/center-modal.tsx.bak`에 백업, 두 컴포넌트를 함께 받은 뒤 재설계 예정. Center Modal도 내부에 테이블만 있는 것/상단바+테이블/폼 등 종류가 여러 가지라 세분화 필요 |
| Side Slide Panel (Full) | 우측 전체 슬라이드 패널 | 오가니즘 | 있음 | 1 | Type02, 960px 기본 |
| Side Slide Panel — 상하 분할 | 우측 슬라이드 내부가 상/하로 나뉜 형태 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "상하 섹션 구분"(생산계획 리스트+원부자재 리스트+하단 통계) 확인 |
| Side Slide Panel — 좌우 분할 | 우측 슬라이드 내부가 좌/우로 나뉜 형태 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "좌우 섹션 구분"(품목검사 폼+캘린더) 및 Side Modal "타임테이블/좌우구분" 확인 |
| Modal with Embedded Table | 팝업 안에 표·그리드 포함 | 오가니즘 | 있음 | 1 | "생산계획/작업진행 실적입력" 모달 |
| Modal with Tabs | 팝업 안이 탭으로 구획 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "탭 구분 모달"(좌측 Type01~06 리스트+우측 테이블) 확인 |
| Full-screen Modal | 화면 전체를 덮는 팝업 | 오가니즘 | 없음 | 4 | |
| Nested Modal (2-depth) | 팝업 위에 또 다른 팝업 | 오가니즘 | 부분 | 1 | 2026-07-31 ConfirmDialog 두 개를 겹쳐 여는 방식으로 "팝업 위에 팝업" 패턴 자체는 데모/코드화 완료(page.tsx `nested-modal` 섹션). 다만 원래 추정 근거였던 Figma Side Modal "검사/커스텀 정보 등록"의 실제 겹친 모달 구조는 Center Modal이 담당자 지시로 보류 중이라 여전히 미확인 — 그래서 "있음"이 아니라 "부분" 유지 |
| Resizable / Draggable Popup | 크기 조절·이동 가능한 팝업 | 오가니즘 | 없음 | 3 | |

## 16. MES 도메인 특화 패턴

실제 사용 여부와 무관하게 "MES에 흔한 것"을 우선 총망라했으므로, 티어 확인 후 불필요한 건 제외하면 된다.

### 16-1. 실시간 설비·공정 모니터링

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Andon Board (설비 상태판) | 라인 전체 설비 상태 보드 | 템플릿 | 없음 | 3 | |
| Equipment Status Card/Tile | 개별 설비 상태 카드 | 몰큘 | 없음 | 3 | |
| Real-time Gauge/Meter | 온도·압력·속도 게이지 | 아톰 | 없음 | 3 | |
| OEE Dashboard Widget | 설비종합효율 지표 위젯 | 오가니즘 | 없음 | 3 | |
| Process Flow Diagram | 공정 흐름도 | 오가니즘 | 없음 | 4 | 고급 시각화, 구현 난이도 높음 |
| Real-time Trend Chart | 시계열 센서 데이터 차트 | 오가니즘 | 없음 | 3 | |
| Utilization Heatmap | 설비·라인별 가동률 히트맵 | 오가니즘 | 없음 | 4 | |
| Factory Layout View | 공장 배치도 오버레이 뷰 | 템플릿 | 없음 | 4 | |

### 16-2. 알람·경보

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Alarm List/Table | 알람 이력 리스트 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Asset/Templates의 "Alarm list" 확인. 2026-07-30 코드화: `components/ui/alarm-list-item.tsx`(node 163:3039 "MES 알람 리스트" 실측, tone 4색×hover×read×두줄 조합 32종 중 대표 케이스 반영). `read` prop 의미와 "두줄" 용도는 확인 필요. 2026-08-03 담당자가 "알람에서 '비활성화' 처리된 내역은 삭제해줘"라고 지시 — `read=false`(흐림) 상태의 배경색(Gray-10)이 `table.tsx`의 "비활성화(disabled) = 배경 Gray-10" 규칙과 일치해 `read=false`가 "비활성화"를 가리키는 것으로 추정, `NotificationPanel`/`AlarmListItem` 데모에서 해당 예시를 제거함(컴포넌트 자체 지원은 유지 — prop 이름 변경은 범위 밖). `read`→`disabled` 개명이 맞는지는 여전히 확인 필요 |
| Blinking Alarm Indicator | 알람 발생 시 점멸 표시 | 아톰 | 없음 | 3 | |
| Severity Level Tag | 알람 심각도 태그 | 아톰 | 없음 | 3 | |
| Alarm Acknowledge Button | 알람 확인·조치 버튼 | 아톰 | 없음 | 3 | |
| Escalation Timeline | 알람 에스컬레이션 이력 | 오가니즘 | 없음 | 4 | |

### 16-3. 작업지시·생산관리

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Work Order Form | 작업지시서 입력·조회 폼 | 오가니즘 | 없음 | 3 | |
| Work Order Kanban | 작업지시 진행상태별 칸반 | 템플릿 | 없음 | 4 | |
| Production Gantt Chart | 생산 일정 간트차트 | 오가니즘 | 없음 | 4 | |
| Shift Schedule Calendar | 교대조 근무 일정 캘린더 | 오가니즘 | 없음 | 4 | |
| Routing/BOM Tree | 공정순서·BOM 트리 뷰 | 오가니즘 | 없음 | 3 | |
| Lot Progress Bar | 로트 단위 생산 진척률 | 아톰 | 없음 | 3 | |

### 16-4. 품질관리 (QC)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Defect Type Tag/Selector | 불량 유형 태그·선택기 | 아톰 | 없음 | 3 | |
| SPC Control Chart | 통계적 공정관리 관리도 | 오가니즘 | 없음 | 3 | |
| Inspection Checklist Form | 검사 항목 체크리스트 폼 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Foundation의 "검사항목 체크" 프레임 확인 |
| 검사 판정 버튼 (○/△/✕/-) | 품질검사 판정 버튼, 실제로는 4상태(○/△/✕/-) — 단순 합격/불합격 이진 토글 아님 | 몰큘 | 없음 | 3 | 모바일에는 이미 디자인 있음(모바일 체크리스트 5번 섹션 "검사 버튼") — 데스크탑판만 신규 제작하면 되므로 실제 착수는 티어1과 함께 해도 무방. 상세 스펙은 [컴포넌트 기능 변형 심층분석](./컴포넌트_기능_변형_심층분석.md) 참고. "-"의 정확한 의미는 사용자 확인 대기 중(19번 섹션 참고) |
| Sampling Plan Table | 샘플링 검사 기준표 | 오가니즘 | 없음 | 4 | |
| Defect Pareto Chart | 불량 유형별 파레토 차트 | 오가니즘 | 없음 | 4 | |

### 16-5. 자재·재고·이력추적

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Barcode/QR Scan Input | 바코드·QR 스캔 입력창 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal "탭 구분 모달" 내 Scan 버튼 확인 |
| Lot/Serial Search | Lot·시리얼 번호 조회창 | 몰큘 | 없음 | 3 | |
| Genealogy Tree | 제품 이력추적 트리 | 오가니즘 | 없음 | 4 | |
| Inventory Level Indicator | 재고 수량 게이지·바 | 아톰 | 없음 | 3 | |
| Warehouse Location Map | 창고 위치 배치도 | 템플릿 | 없음 | 5 | 니치 기능 |
| Label Print Preview | 라벨 출력 미리보기 | 오가니즘 | 없음 | 4 | |

### 16-6. 문서·승인

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Approval Workflow Stepper | 결재선 단계 표시 | 몰큘 | 없음 | 3 | |
| E-signature Pad | 전자서명 입력 패드 | 오가니즘 | 없음 | 4 | |
| Document Version History | 문서 개정 이력 | 오가니즘 | 없음 | 4 | |
| Attachment List | 첨부파일 목록 | 몰큘 | 없음 | 3 | |

### 16-7. 설비 보전 (Maintenance)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Maintenance Schedule Calendar | 예방보전 일정 캘린더 | 오가니즘 | 없음 | 4 | |
| Downtime Reason Selector | 비가동 사유 선택기 | 몰큘 | 없음 | 3 | |
| Equipment Detail Card | 설비 상세정보 카드 | 몰큘 | 없음 | 3 | |
| PM Checklist | 예방보전 점검 체크리스트 | 오가니즘 | 없음 | 4 | |

## 17. Component Gallery 교차검증 추가 항목

[component.gallery](https://component.gallery/components/)는 58개의 "정본" 컴포넌트 타입을 IBM Carbon, Microsoft Fluent, Shopify Polaris, GitHub Primer, RedHat PatternFly, Pinterest Gestalt 등 50개 이상의 실제 프로덕션 디자인 시스템 사례(컴포넌트당 최소 5개~최대 123개 사례)로 검증해 관리하는 사이트. 이 58개와 대조한 결과 58개 중 50개는 이미 목록에 있었고, 아래 8개가 새로 발견됨.

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Link | 하이퍼링크(텍스트 링크) | 아톰 | 있음 | 2 | 2026-07-31 코드화(`link.tsx`). NoticeBanner에서 이미 반복되던 링크 스타일(`text-mes-text-brand` + hover underline)을 역추출 |
| Fieldset | 관련 폼 필드를 묶는 wrapper | 몰큘 | 없음 | 2 | |
| Label | 독립된 폼 라벨 아톰 | 아톰 | 있음 | 2 | 2026-07-31 코드화(`label.tsx`). Figma 디자인 없어서 Input/Select와 같은 텍스트 색 체계 재사용, required(*) 표시 판단값 |
| Footer | 페이지 하단 영역 | 오가니즘 | 없음 | 3 | |
| File | 첨부파일 표시(칩/아이콘, 업로드 입력과 별개) | 아톰 | 없음 | 3 | |
| Hero | 큰 배너(주로 랜딩페이지용) | 오가니즘 | 없음 | 5 | MES 어드민 도구엔 낮은 우선순위 |
| Skip Link | 키보드 포커스 건너뛰기 링크 | 아톰 | 없음 | 4 | 접근성 전용 |
| Visually Hidden | 스크린리더 전용 숨김 텍스트 | 아톰 | 없음 | 4 | 접근성 유틸리티 |

> 검증 출처: [Component Gallery](https://component.gallery/components/) — 58개 컴포넌트 타입 전체 대조. 결과: 기존 목록이 58개 중 50개(86%)를 이미 포함하고 있었음을 확인.

## 18. 컴포넌트별 기능 변형 상세

Component Gallery를 자세히 보면, 같은 컴포넌트 "타입"이어도 디자인 시스템마다 실제 기능 범위가 다르다 (예: Select 안에도 여러 하위 변형이 있음). 190여개 전체 항목을 이 깊이로 미리 조사하는 건 비효율적이므로, **실제로 코드화할 티어 1~2 항목부터** 이 표를 채워나간다.

### 18-1. Select (Dropdown) — 예시

Component Gallery의 82개 Select 사례를 대조한 결과, 실제로는 아래 6가지 정도의 서로 다른 변형이 존재함.

| 변형 | 설명 | 대표 사례 | 우리 시스템 적용 필요성 |
|---|---|---|---|
| Native/Basic Select | 브라우저 기본 select 태그 기반, 커스텀 스타일 최소 | Chakra "Select (Native)", Elastic "Basic select" | 간단한 폼에 충분 |
| Custom-styled Select | 완전히 커스텀 디자인된 드롭다운 (지금 피그마 Selectbox가 이 유형) | Ant Design Select, shadcn/ui Select | 이미 있음 |
| Multi-select | 여러 값을 동시에 선택, 선택된 값들이 태그/칩으로 표시 | Porsche "Multi Select", Visa "Multiselect" | MES 필터에서 자주 필요 (예: 여러 설비 동시 선택) |
| Tree Select | 계층 구조를 펼쳐가며 선택 | Ant Design "Tree select" | 설비/조직 트리 선택에 필요 (12번 카테고리에 이미 있음) |
| Searchable/Combobox 경계형 | 입력하며 옵션을 필터링 | Elastic "Super select", Combobox 전반 | 옵션이 많은 목록(품목, 거래처 등)에 필요 |
| Headless/커스텀 조립형 | 스타일 없이 동작 로직만 제공, 완전 커스텀 스타일링 | Headless UI "Listbox" | shadcn/ui가 이미 이 원리로 동작 중이라 자동 해당 |

> 결론: Custom-styled(있음) 외에 **Multi-select, Searchable**은 MES 필터/폼에서 실사용 가능성이 높아 티어 2로 추가 권장. Tree Select는 이미 12번 카테고리에 있음.

### 18-2. 다른 컴포넌트로 확장하는 방법

Select와 같은 방식으로, 티어 1~2 항목을 하나씩 골라 `component.gallery/components/{컴포넌트명}` 페이지를 열어보면 실제 변형 목록이 바로 나옴 (예: Table, Modal, Button도 각각 70~120개 사례가 있어 변형이 많음). 코드화 직전에 해당 컴포넌트 항목만 이렇게 한 번씩 확인하는 것을 권장.

---

## 다음 단계

1차 총망라 대조가 끝났고 티어까지 매겼으므로, 이제부터는 감사(audit)가 아니라 실행 단계다.

**확정된 실행 목표 범위: 티어 1~3 전체 + 티어 4 중 선별.** MES라는 도메인 특성상 티어 3(MES 핵심 특화)까지는 필수로 구축하고, 티어 4도 실무 임팩트가 큰 일부 항목은 포함한다. 티어 5(소비자 SaaS/마케팅 패턴)만 제외 대상.

**전체 규모(2026-07-16 재검증으로 전수 재계산)**: 티어1 40개 + 티어2 46개 + 티어3 59개 = 145개(필수) + 티어4 포함권장 19개 = **총 164개**가 확정된 실행 범위. 티어4 보류 22개, 티어5 28개는 제외. (전체 카탈로그는 40+46+59+41+28 = 214개)

1. **티어 1**(40개, 이미 디자인 있음)부터 코드화를 시작한다.
2. 티어 1이 끝나면 **티어 2**(범용 필수 요소, 46개)로 넘어간다 — 화면을 만드는 데 실질적으로 막힘이 없어지는 지점.
3. **티어 3**(MES 핵심 특화, 59개)은 실제 업무 화면 완성도를 좌우하므로 전부 포함한다.
4. **티어 4**는 전부는 아니고 실무 임팩트가 큰 19개만 선별해서 포함한다 (아래 18-3 참고). **티어 5**는 실제 필요 여부를 재확인한 뒤 불필요하면 제외.
5. 코드화 순서는 항상 **토큰 → 아톰 → 몰큘 → 오가니즘 → 템플릿**(레이어 컬럼 기준)을 따른다.
6. 정밀 스펙(정확한 패딩값, 폰트 사이즈, 개별 아이콘명 등)이 필요한 항목은 해당 프레임의 개별 링크를 공유하면 그때그때 추가로 뽑아낼 수 있다.
7. 아직 확인이 안 끝난 항목들은 19번 섹션에 모아뒀다 — 코드화 진행하면서 여유 있을 때 하나씩 해소한다.

### 18-3. 티어 4 선별 기준 (41개 중 어디까지 포함할지)

티어 4가 41개로 많아서, 전부 넣기보다 아래 기준으로 1차 선별안을 제시. 확정은 아니고 조정 가능.

> 재검증(2026-07-16)으로 전체 개수를 다시 세본 결과, 실제 티어4는 41개였다(기존 39개 집계에서 Disclosure Panel, Breakpoint Scale 2개가 분류 누락돼 있었음 — 아래 보류 권장에 추가).

**포함 권장 (실무 임팩트 큼, 19개)**

| 컴포넌트 | 사유 |
|---|---|
| Skip Link, Visually Hidden | 접근성 필수 유틸리티는 난이도와 무관하게 포함 |
| Full-screen Modal | 대시보드류 화면에서 실사용 가능성 높음 |
| Context Menu | 그리드 작업 시 우클릭 액션 흔함 |
| Avatar, Kbd, Aspect Ratio | 구현 난이도 낮고 범용성 있음 |
| Process Flow Diagram, Utilization Heatmap, Factory Layout View | 실시간 모니터링 화면의 핵심 시각화 |
| Work Order Kanban, Production Gantt Chart, Shift Schedule Calendar | 생산관리 화면에 실사용 가능성 높음 |
| Genealogy Tree, Label Print Preview | 자재·이력추적 업무에 실사용 |
| E-signature Pad, Document Version History | 문서·승인 워크플로우에 필요 |
| Maintenance Schedule Calendar, PM Checklist | 설비보전 업무 핵심 |

**보류 권장 (있으면 좋지만 후순위, 22개)**

| 컴포넌트 | 사유 |
|---|---|
| Split Button, Segmented Control, Chip Selector, OTP/PIN Input, Rich Text Editor, Back to Top, Progress Circle | 대체 가능하거나 사용 빈도 낮음 |
| Anchor/Scroll Spy, Overflow List, Spoiler | 있으면 편하지만 필수 아님 |
| Sampling Plan Table, Defect Pareto Chart | 품질관리 고급 기능, 초기엔 표/차트로 대체 가능 |
| Chat Bubble/Message, AI Prompt Input Box | AI 기능 로드맵 확정 전까지 보류 |
| Drag Handle/Sortable List, Comment/Activity Feed, Kanban Board, Global Top Loading Bar | 소비자 SaaS 성격이 강함 |
| Escalation Timeline | Timeline(티어3) 컴포넌트로 우선 대체 가능 |
| Empty Illustration | 디자인 리소스(일러스트) 제작이 별도로 필요해 후순위 |
| Disclosure Panel | Accordion/Collapsible(티어2)로 대체 가능, 별도 우선순위 낮음 |
| Breakpoint Scale | 데스크탑에 반응형 자체가 필요한지 재검토부터 필요 |

> 이 선별안은 초안이므로, 특정 항목을 옮기고 싶으면 알려주면 바로 반영.

## 19. 확인이 더 필요한 항목 (열려있는 질문)

문서 전체에 표 비고란으로 흩어져 있던 "확인 필요" 메모를 여기 한곳에 모았다. 코드화를 막는 건 아니고, 진행하면서 여유 있을 때 하나씩 해소하면 된다.

| 항목 | 위치 | 확인할 내용 |
|---|---|---|
| ~~Icon Set~~ → **실제 SVG 33종 확보 및 컴포넌트화 완료** | 0번 섹션 | 이 환경에서 Figma 애셋 CDN 직접 다운로드는 끝까지 불가(HTTP 403 재확인)했으나, 담당자가 Figma에서 직접 SVG export해 `component-library/icon/mes/`에 넣어줘서 해결됨. 33개 파일 전부 분석해 `component-library/src/components/icons/`에 실측 벡터 기반 React 컴포넌트로 구현 완료(색상 variant는 currentColor로 일반화, 형태가 실제로 다른 것은 variant prop으로 분리, flat-* 4종은 2톤 고정색 유지) → 상세 내용 [아이콘_매핑표.md](./아이콘_매핑표.md) "2026-07-28 실측 SVG 반영 결과" 참고. 기존 lucide 대체 아이콘 사용처(filter.tsx/toast.tsx/confirm-dialog.tsx/radio-choice-dialog.tsx)도 실제 벡터로 교체 완료. 아직 미확보: mes/icon-setting, Toast BLUE의 CHECK 아이콘 |
| **System Color (Warning/Success) 데스크탑 신설 필요** | 0-1번 섹션 | 재확인 완료 — 데스크탑 Figma엔 Danger만 있고 Warning/Success 그룹 자체가 없음(모바일엔 있음). 데스크탑에도 만들지, 모바일과 같은 값을 쓸지는 디자인 결정 필요 |
| Nested Modal | 15번 섹션 | 2-depth 모달의 정확한 구조 (Side Modal "검사/커스텀 정보 등록"에서 겹친 형태로 추정만 한 상태) |
| 검사 판정 버튼 "-"(대시) | 16-4번 섹션 | 정확한 의미 — 사용자 측 내부 확인 대기 중. [컴포넌트 기능 변형 심층분석](./컴포넌트_기능_변형_심층분석.md) 참고 |
| Breakpoint Scale | 0번 섹션 | 데스크탑에 반응형 자체가 실제로 필요한지 재검토 |
| Radius/Spacing 로컬 변수 vs FMS Make Metrics | 0번 섹션 | 실제 컴포넌트는 로컬 변수(`radius/small1`, `padding/1`, `padding/3`)를 쓰는데, `search_design_system`에는 이름이 다른 별도 컬렉션("FMS Make Metrics": radius/sm·md·lg, "gray-900" 등)이 잡힘 — 후자가 미사용 보일러플레이트인지 확인 필요 |
| Radius 사이즈별 연동 여부 | 전체 | **"공용 규칙 없음"으로 결론 확정**(10개 컴포넌트 실측 완료 — Button/Input/Selectbox/Badge/Center Modal/Toast/Tab Item/Sidebar/Confirm Dialog/Table). Input·Selectbox는 사이즈 연동(4px→3px), Button은 고정(4px), Sidebar는 한 컴포넌트 안에서만 4종(4/8/2/111px) 공존. 열려있는 질문이 아니라 **확정된 방법론**: 티어1 나머지 ~30개 컴포넌트를 코드화할 때마다 매번 개별 실측 필수(패밀리·기존 실측값으로 유추 금지). 자세한 근거는 [신규 컴포넌트 설계 프로세스 Step C-1](./신규_컴포넌트_설계_프로세스.md) 참고 |
| ~~Selectbox / Combobox(검색 가능한 셀렉트) 구분 필요~~ → **분리 완료** | 3번 섹션(입력·폼) | 2026-07-28 코드화 중 발견 → 같은 날 분리 완료: 실제 서비스엔 검색창이 내장된 콤보박스(클래스명 `.searchable-select-dropdown`, 예: 근무조 선택)가 있어 일반 Selectbox와 별도 컴포넌트(`combobox.tsx`, Radix Popover 기반)로 분리 구현함. 트리거 박스는 Selectbox와 동일 규격 재사용, 검색창은 node `20140:101487` 실측, 목록 패널은 Selectbox 패널과 동일 스타일 공유. 선택 항목 배경 `#E8F0FE`(확인됨) 적용. 선택 항목 hover 테두리 색 — `#E8F0FE`가 확정 Primary 팔레트 11단계 중 어느 값과도 정확히 일치하지 않아(Primary-20 `#E8F5FF`와 가장 근접하나 다른 값) "배경보다 1~2단계 진하게"라는 담당자 가설을 실측 없이 확정할 수 없었던 값인데, 2026-07-29 담당자가 combobox.tsx 쪽은 "그대로 유지"로 확정 — Primary-40(`#7BBBFF`)을 임시값이 아닌 최종값으로 확정함(devtools 재확인 불필요). select.tsx는 이번에 언급되지 않아 기존 임시값 상태 그대로 유지(별도 확인 시 처리) |
| **Badge "orange"/"yellow" 이름-색상 불일치** | 4번 섹션(피드백/상태) | 2026-07-28 정밀실측 중 발견: Figma 컴포넌트 property 이름이 "ORANGE"인데 실제 배경색은 회색(Gray-40), "YELLOW"인데 실제 배경색은 파랑(Primary-60, BLUE variant와 완전히 동일)임. 원본 Figma 자체의 배경색 지정 누락/오류로 추정 — 임의로 노란색·주황색을 지어내지 않고 실측된 그대로(`badge.tsx`에 orange=gray, yellow=blue로) 구현해둠. 디자이너가 원본을 고칠지, 아니면 이름만 바꿀지 확인 필요 |
| **Badge variant6/variant7 용도 불명확** → 이름은 개명 완료, 용도는 계속 미확인 | 4번 섹션(피드백/상태) | 두 property 모두 Figma에서 이름이 지어지지 않은 채(자동생성명) 남아있고, 둘 다 텍스트는 "완료"로 동일한데 스타일만 다름(연한 배경형 vs 흰바탕 테두리형). 2026-07-29 실제 색 기준으로 `blueLight`(구 variant6)/`blueOutline`(구 variant7)로 개명함(`badge.tsx` 참고) — 다만 "완료"에 왜 서로 다른 스타일이 필요한지, blue/blue2/blueLight/blueOutline 4종이 실제로 어떤 상태마다 구분돼 쓰이는지는 여전히 확인 필요 |
| **Checkbox/Radio "disabled + 선택됨" 조합 미정의** | 3번 섹션(입력·폼) | Radio는 Figma에 disable property가 있지만 선택 안 된 상태 기준으로만 있고, 선택됨+비활성 조합은 없음. Checkbox는 Figma에 disabled 상태 자체가 아예 없음(3색 checked + unchecked만 있음). 두 컴포넌트 모두 disabled+checked 조합 스타일을 판단값으로 채워둠(`radio.tsx`/`checkbox.tsx` 주석 참고) — 정확한 디자인 나오면 교체 필요 |
| ~~Filter 플라이아웃 체크박스 패널 노드 미확인~~ → **조립형으로 해결** | 3번 섹션(입력·폼) | 담당자 확인(2026-07-28): 이 플라이아웃 패널은 Figma에 별도 실측 가능한 노드가 원래 없음("필터를 눌렀을때 나오는거는 그냥 봤을때 딱 보이잖아... 조립해서 만들어도 됨"으로 승인) — `filter-flyout.tsx`로 조립 구현 완료. 1단 카테고리 목록(검색+행 목록, 선택값 있으면 점 표시+ChevronRight)과 2단 체크박스 서브목록(카테고리 클릭 시 우측에 열림)으로 구성. 시각 스타일은 Select/Combobox 패널 관례를 그대로 재사용(테두리 gray30, radius 8px, 그림자 등) — 정밀실측이 아니라 조립 기반이라는 점 명시 |
| ~~Chip/Tag "3색" 범용 버전 미실측~~ → **실측 완료** | 4번 섹션(피드백/상태) | node 9873:83675 기준 정밀실측 완료(`tag.tsx`, fill-main/gray/red 3색). 담당자 확인: "이건 거의 안 쓰고 뱃지를 많이 씀" — 실사용 빈도는 낮으나 체크리스트 완결성을 위해 구현해둠. ~~Figma 원본에 닫기(X) 아이콘이 텍스트 앞뒤로 2개 있는 특이점~~ → 담당자 확인(2026-07-28): 중복/실수가 아니라 Button처럼 `startIcon`/`endIcon`을 독립적으로 받는 범용 아이콘 슬롯 구조라서였음 — `tag.tsx`를 Button과 동일한 startIcon/endIcon 패턴으로 재구현 완료 |
| **Toast RED/BLUE gap 불일치** → 8px로 통일 완료 | 4번 섹션(피드백/상태) | 실측 시 RED 8px/BLUE 16px로 서로 달랐으나 담당자가 "그냥 8px로 통일"이라고 결정 — `toast.tsx` 수정 완료. 나머지 차이(테두리색, 닫기아이콘 크기, BLUE 배경색이 Primary-60과 다른 점)는 그대로 유지 |
| ~~ConfirmDialog 다른 변형 미확인~~ → **라디오 변형 실측 완료, 드롭다운 변형은 2026-07-29 스코프에서 제외** | 3번 섹션(입력·폼) | `confirm-dialog.tsx`(node 11106:37629 "modal-error", 에러 톤 버튼1개)에 이어 node 18840:61182 "modal"(실측 인스턴스명 "투입품목 추가")을 라디오 2택+경고배너+2버튼 구조로 실측·`radio-choice-dialog.tsx`로 구현 완료. "삭제 모달 - 드롭다운" 변형은 원래 있었는데 담당자도 지금 찾지 못하는 상태 — 2026-07-29 담당자 확인: **당분간 제외, 실측 자료 없이 판단으로 만들어도 크게 문제 없다는 판단**. 필요해지면 그때 판단 구현(추정 스펙)으로 착수하고 이 문서에 "판단값" 표기와 함께 등록할 것 |
| **ConfirmDialog vs RadioChoiceDialog radius/shadow 불일치** | 3번 섹션(입력·폼) | 두 모달 각각 실측 결과: ConfirmDialog(11106:37629)=radius 12px/그림자 `0 4px 16px rgba(0,0,0,.2)`, RadioChoiceDialog(18840:61182)=radius 16px/그림자 `0px 0px 24px rgba(0,0,0,.2)`. 같은 "모달" 계열이라고 임의로 맞추지 않고 각 노드 실측값 그대로 반영해둠 — 두 모달이 실제로 통일된 규격이어야 하는지 담당자 확인 필요 |
| **`get_metadata`/`get_design_context`가 node 18887:62605에서 계속 실패** | 3번 섹션(입력·폼) | 2026-07-29 ConfirmDialog 톤 확장+NoticeBanner 작업 중 발견 — 이 노드(모달 갤러리, 자식이 많음)에 대해 두 도구 모두 "Failed to parse SSE message... Invalid JSON: EOF while parsing a string" 에러로 매번 실패(재시도해도 동일). `get_screenshot`/`get_variable_defs`는 정상 동작해서 색상 실측(Yellow-10/20/50 등)은 확보했지만, 정확한 padding/radius px와 배너 아이콘 벡터는 스크린샷 육안 대조 기반 판단값으로 대체함(`notice-banner.tsx`/`confirm-dialog.tsx` 주석 참고). 다음에 이 프레임을 더 다뤄야 하면 자식 노드를 낱개로 쪼개서 `get_design_context` 호출을 시도해볼 것(전체 프레임 대신 개별 모달 노드 단위로) |
