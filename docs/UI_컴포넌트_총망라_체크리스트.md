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
| Spacing Scale | 여백·간격 단위 값 | 토큰 | 부분 | 2 | 1차 실측 파일럿에서 로컬 변수 `padding/1`=2px, `padding/3`=8px 확인됨 — 전체 스텝(0/2/4 등)은 아직 미확인 |
| Radius Scale | 모서리 둥글기 값 | 토큰 | 부분 | 2 | 1차 실측 파일럿에서 액션류·입력류·표시류가 공통으로 4px(`radius/small1`) 사용 확인, 오버레이류(모달)는 16px — 전체 스텝 체계는 추가 실측 필요 |
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

> Danger 외 Success/Warning 등 다른 System Color가 더 있는지는 "위험(danger)" 하나만 확인됨. 추가 확인 필요.

---

## 1. 액션 (Actions)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Button (Primary) | 주요 액션 버튼 | 아톰 | 있음 | 1 | Figma "Button": Basic/Small/Xsmall 3사이즈 × 6컬러 × hover-press/disable |
| Button (Secondary/Outline/Ghost) | 보조 액션 버튼 | 아톰 | 있음 | 1 | 위 매트릭스에 테두리형·연한색 버전 포함 |
| Icon Button | 아이콘만 있는 버튼 | 아톰 | 없음 | 2 | |
| Button Group | 버튼 여러 개 묶음 | 몰큘 | 없음 | 2 | |
| Toggle Button | 눌림 상태를 갖는 버튼 | 아톰 | 없음 | 2 | |
| Split Button | 기본 액션 + 드롭다운 옵션 결합 버튼 | 몰큘 | 없음 | 4 | |
| Floating Action Button (FAB) | 화면에 떠 있는 원형 액션 버튼 | 아톰 | 없음 | 5 | 모바일 앱 패턴, 데스크탑 MES엔 불필요 가능성 |

## 2. 선택·토글 (Selection & Toggle)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Checkbox | 체크박스 | 아톰 | 없음 | 2 | |
| Radio Button | 라디오버튼 | 아톰 | 있음 | 1 | Figma "MES Design System" Direction 섹션 확인 |
| Switch / Toggle | 온오프 스위치 | 아톰 | 없음 | 2 | |
| Segmented Control | 세그먼트형 선택 컨트롤 | 몰큘 | 없음 | 4 | |
| Slider (Range) | 범위 슬라이더 | 아톰 | 없음 | 3 | 수치 필터 범위 지정 등에 활용 가능 |
| Rating (별점) | 별점 등 평점 입력 | 몰큘 | 없음 | 5 | 소비자 서비스 패턴 |
| Chip Selector | 칩 형태 다중 선택 | 몰큘 | 없음 | 4 | |

## 3. 입력·폼 (Inputs & Forms)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Text Input | 한 줄 텍스트 입력 | 아톰 | 있음 | 1 | Figma "Input Textbox/Selectbox" 매트릭스 |
| Textarea | 여러 줄 텍스트 입력 | 아톰 | 없음 | 2 | |
| Number Input | 숫자 입력(증감 버튼 포함) | 몰큘 | 없음 | 2 | |
| Search Input | 검색창 | 몰큘 | 있음 | 1 | 위 Input 매트릭스에 search 컬럼 포함 |
| Password Input | 비밀번호 입력(보기/숨기기) | 몰큘 | 없음 | 2 | 로그인 화면 필수 |
| Select (Dropdown) | 단일 선택 드롭다운 | 몰큘 | 있음 | 1 | Figma "Selectbox" 확인됨 |
| Combobox | 검색 가능한 선택형 드롭다운 | 몰큘 | 없음 | 2 | |
| Multi-select / Tag Input | 다중 선택·태그 입력 | 몰큘 | 없음 | 2 | 필터 등에 활용. 18-1 Select 변형 분석의 결론(MES 필터에서 실사용 가능성 높음)을 반영해 티어3→2로 상향 |
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
| Sidebar / Side Nav | 좌측 내비게이션 | 오가니즘 | 있음 | 1 | Figma "SNB": 4종 상태 + hide 상태 |
| Breadcrumb | 현재 위치 경로 표시 | 몰큘 | 없음 | 2 | |
| Tabs | 탭 전환 | 몰큘 | 있음 | 1 | Figma "Page Top Tab" 확인됨 |
| Pagination | 페이지네이션 | 몰큘 | 없음 | 2 | |
| Stepper / Wizard | 단계형 진행 표시 | 오가니즘 | 없음 | 3 | 작업지시 등록형 멀티스텝 폼에 유용 |
| Dropdown Menu | 클릭 시 열리는 메뉴 | 몰큘 | 없음 | 2 | |
| Context Menu | 우클릭 메뉴 | 몰큘 | 없음 | 4 | |
| Command Palette | Cmd+K 형태의 빠른 검색·실행창 | 오가니즘 | 없음 | 5 | |
| Back to Top | 맨 위로 가기 버튼 | 아톰 | 없음 | 4 | |

## 5. 데이터 표시 (Data Display)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Table | 표 | 오가니즘 | 있음 | 1 | Figma "Table" Header/Body 상태별 매트릭스 |
| Data Grid | 정렬·필터 가능한 표 | 오가니즘 | 없음 | 3 | MES 핵심 |
| List | 리스트 | 몰큘 | 없음 | 2 | |
| Card | 카드 | 몰큘 | 없음 | 2 | |
| Avatar | 프로필 이미지 | 아톰 | 없음 | 4 | |
| Avatar Group | 아바타 겹침 그룹 | 몰큘 | 없음 | 5 | |
| Badge | 상태/개수 배지 | 아톰 | 있음 | 1 | Default/Primary/Danger 3종 |
| Chip / Tag | 태그·라벨 | 아톰 | 있음 | 1 | 3색 + 제거가능형 + MES 상태배지 |
| Tooltip | 말풍선 설명 | 아톰 | 없음 | 2 | |
| Progress Bar | 진행률 막대 | 아톰 | 있음 | 1 | 90%/50%/0% 상태 확인 |
| Progress Circle | 진행률 원형 | 아톰 | 없음 | 4 | |
| Skeleton | 로딩 중 placeholder | 아톰 | 없음 | 2 | |
| Stat / KPI Card | 숫자 지표 카드 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Asset/Templates의 "Dashboard Card" 확인 |
| Timeline | 시간순 타임라인 | 오가니즘 | 없음 | 3 | 이력추적·알람 이력 |
| Tree View | 계층형 트리 목록 | 오가니즘 | 없음 | 3 | BOM·계보 등 MES에 흔함 |
| Chart | 라인/바/파이 차트 | 오가니즘 | 없음 | 3 | SPC·트렌드 등 |
| Calendar (표시용) | 달력 뷰 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Side Modal "검사 모달/배열" 내 캘린더 확인 |
| Carousel | 이미지·콘텐츠 슬라이더 | 오가니즘 | 없음 | 5 | 마케팅용 패턴 |

## 6. 피드백·오버레이 (Feedback & Overlay)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Alert / Banner | 상단/인라인 경고 배너 | 몰큘 | 있음 | 1 | |
| Toast / Snackbar | 짧게 떴다 사라지는 알림 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Alarm 프레임 내 TOAST 컴포넌트 확인 |
| Modal / Dialog | 화면 중앙 팝업 | 오가니즘 | 있음 | 1 | Type01: 중앙 모달, 최대높이 80vh |
| Drawer / Sheet | 옆에서 슬라이드로 열리는 패널 | 오가니즘 | 없음 | 2 | |
| Popover | 특정 요소 옆에 뜨는 작은 팝업 | 몰큘 | 없음 | 2 | |
| Confirm Dialog | 확인/취소 확인창 | 몰큘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "삭제 모달 - 드롭다운/라디오버튼" 2종 확인 |
| Loading Spinner | 로딩 스피너 | 아톰 | 없음 | 2 | |
| Empty State | 데이터 없음 화면 | 몰큘 | 없음 | 2 | |
| Error State | 에러 화면 | 몰큘 | 없음 | 2 | |
| Notification / Bell | 알림 아이콘·목록 | 몰큘 | 없음 | 3 | 알람 시스템과 연결 |

## 7. 접기·펼치기 (Disclosure)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Accordion | 아코디언 | 오가니즘 | 없음 | 2 | |
| Collapsible | 접고 펼치는 영역 | 몰큘 | 없음 | 2 | |
| Disclosure Panel | 더보기 형태 패널 | 몰큘 | 없음 | 4 | |

## 8. 레이아웃·구조 (Layout & Structure)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Divider / Separator | 구분선 | 아톰 | 없음 | 2 | |
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
| Bulk Action Toolbar | 다중 선택 시 나타나는 액션 바 | 몰큘 | 없음 | 2 | MES 테이블 작업에 흔함 |
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
| Close Button (X) | 모달·배너 등을 닫는 X 버튼 | 아톰 | 없음 | 2 | |
| Copy Button | 클립보드 복사 버튼 | 아톰 | 없음 | 3 | |
| Burger (Hamburger Menu) | 햄버거 메뉴 아이콘 버튼 | 아톰 | 없음 | 3 | |
| Loading Overlay | 특정 영역을 덮는 로딩 오버레이 | 몰큘 | 없음 | 2 | |
| Backdrop / Dim Overlay | 모달 등의 배경 딤 처리 | 아톰 | 없음 | 2 | |
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
| Bulk Selection + Action Toolbar Grid | 다중 선택 후 일괄 처리 버튼이 뜨는 그리드 | 오가니즘 | 부분 | 1 | 모달 내 테이블에서 체크박스 다중선택 확인됨 |
| Column Resize / Reorder / Show-Hide | 컬럼 너비·순서·표시 설정 | 몰큘 | 없음 | 3 | |
| Grid Export / Print | 엑셀 내보내기·인쇄 버튼 | 아톰 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "일자/조회/다운로드" 확인 |
| Virtual Scroll Grid | 대용량 데이터 가상 스크롤 | 오가니즘 | 없음 | 3 | |
| Real-time Update Indicator (Grid) | 실시간 갱신 표시 | 오가니즘 | 없음 | 3 | |

## 15. 팝업/오버레이 레이아웃 패턴 (MES 특화)

| 컴포넌트 | 설명 | 레이어 | 상태 | 티어 | 비고 |
|---|---|---|---|---|---|
| Center Modal | 화면 중앙 기본 팝업 | 오가니즘 | 있음 | 1 | Type01 |
| Side Slide Panel (Full) | 우측 전체 슬라이드 패널 | 오가니즘 | 있음 | 1 | Type02, 960px 기본 |
| Side Slide Panel — 상하 분할 | 우측 슬라이드 내부가 상/하로 나뉜 형태 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "상하 섹션 구분"(생산계획 리스트+원부자재 리스트+하단 통계) 확인 |
| Side Slide Panel — 좌우 분할 | 우측 슬라이드 내부가 좌/우로 나뉜 형태 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "좌우 섹션 구분"(품목검사 폼+캘린더) 및 Side Modal "타임테이블/좌우구분" 확인 |
| Modal with Embedded Table | 팝업 안에 표·그리드 포함 | 오가니즘 | 있음 | 1 | "생산계획/작업진행 실적입력" 모달 |
| Modal with Tabs | 팝업 안이 탭으로 구획 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Center Modal의 "탭 구분 모달"(좌측 Type01~06 리스트+우측 테이블) 확인 |
| Full-screen Modal | 화면 전체를 덮는 팝업 | 오가니즘 | 없음 | 4 | |
| Nested Modal (2-depth) | 팝업 위에 또 다른 팝업 | 오가니즘 | 부분 | 1 | Figma "컴포넌트 라이브러리" Side Modal "검사/커스텀 정보 등록"에서 겹친 모달 형태로 추정, 정확한 구조는 추가 확인 필요 |
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
| Alarm List/Table | 알람 이력 리스트 | 오가니즘 | 있음 | 1 | Figma "컴포넌트 라이브러리" Asset/Templates의 "Alarm list" 확인 |
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
| Link | 하이퍼링크(텍스트 링크) | 아톰 | 없음 | 2 | 테이블 셀 링크(Text Link Cell)는 있었으나 일반 텍스트 링크 자체가 누락돼 있었음 |
| Fieldset | 관련 폼 필드를 묶는 wrapper | 몰큘 | 없음 | 2 | |
| Label | 독립된 폼 라벨 아톰 | 아톰 | 없음 | 2 | |
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
| Icon Set | 0번 섹션 | Figma에 "ICON - 크기별 제작필요"로 명시된 것과, 이전 MES 파일에서 확인했던 80여개 아이콘의 관계 |
| System Color (Warning/Success) | 0-1번 섹션 | 모바일 파일에서는 확인된 Warning/Success 팔레트가 데스크탑 Color 프레임에도 동일하게 있는지 |
| Nested Modal | 15번 섹션 | 2-depth 모달의 정확한 구조 (Side Modal "검사/커스텀 정보 등록"에서 겹친 형태로 추정만 한 상태) |
| 검사 판정 버튼 "-"(대시) | 16-4번 섹션 | 정확한 의미 — 사용자 측 내부 확인 대기 중. [컴포넌트 기능 변형 심층분석](./컴포넌트_기능_변형_심층분석.md) 참고 |
| Breakpoint Scale | 0번 섹션 | 데스크탑에 반응형 자체가 실제로 필요한지 재검토 |
| Gray 60 색상값 | 0-1번 섹션 | 기재값 `#96A0B5`과 1차 실측 파일럿에서 확인된 Figma 라이브 변수값 `#99A3B8`이 다름 — Gray/Primary/System 팔레트 전체를 변수 기준으로 재실측 필요. [신규 컴포넌트 설계 프로세스 Step C-1](./신규_컴포넌트_설계_프로세스.md) 참고 |
| Radius/Spacing 로컬 변수 vs FMS Make Metrics | 0번 섹션 | 실제 컴포넌트는 로컬 변수(`radius/small1`, `padding/1`, `padding/3`)를 쓰는데, `search_design_system`에는 이름이 다른 별도 컬렉션("FMS Make Metrics": radius/sm·md·lg)이 잡힘 — 후자가 미사용 보일러플레이트인지 확인 필요 |
