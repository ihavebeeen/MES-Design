# 모바일 UI 보류 기록

> 상태: **추후 진행(Deferred)**
>
> 2026-08-24 사용자 결정에 따라 모바일 디자인의 큰 변경 가능성이 해소될 때까지 추가 화면 이관, 컴포넌트 승격과 픽셀 정교화를 중단한다. 기존 결과는 삭제하지 않고 참고 자료로 보존하며 웹 생성 표준의 근거로 사용하지 않는다.

## 원본 근거

| 근거 | Node | 역할 |
|---|---:|---|
| MES Mobile 컴포넌트 라이브러리 | `qEAQNTqXf76bYydyupti2V / 163:8929` | 모바일 전용 토큰·크기·상태·variant |
| 웹·모바일 비교 보드 | `F4n5Zr04PAbiRjfIFQAo6v / 9808:62079` | 공유 의미 비교. 모바일 시각값 근거는 아님 |
| 모바일 화면 유형 보드 | `F4n5Zr04PAbiRjfIFQAo6v / 10378:90931` | 메인 12종 44p, 슬라이드 팝업 13종 19p 분류 |
| 실제 화면설계서 | `F4n5Zr04PAbiRjfIFQAo6v / 9082:31842` | 업무 흐름·예외·최신 변경안 |

기계 판독 원본은 `mobile-assets.json`과 `mobile-verification-contracts.json`이다.

## 웹과 모바일의 차이

| 의미 | 웹 | 모바일 |
|---|---|---|
| 대량 목록 | 고밀도 Table과 조회 toolbar | 카드형·조밀 목록과 전용 검색 화면 |
| 등록·편집 | 우측 슬라이드 또는 중앙 팝업 | 상세 화면과 하단 고정 CTA |
| 보조 선택 | Select 또는 중앙 조회 팝업 | 즉시 적용 선택 또는 Bottom Sheet |
| 긴 품질 폼 | 여러 Section을 한 화면에 조합 | 기본·외관·중량·특이사항 Step 분리 |
| 탐색 | 좌측 SNB와 상단 탭 | 하단 탭·뒤로가기·퀵메뉴 |
| 시스템 여백 | 브라우저 viewport | Status Bar 47px와 Home Indicator 30px |

업무 의미, 필수값, 저장·취소 의미와 데이터 검증은 공유할 수 있다. viewport, navigation, Shell, 표 표현, 입력 overlay, CTA 위치, safe area와 터치 크기는 플랫폼별로 분리한다.

## 확인된 자산 범위

### Foundation

- 모바일·태블릿 breakpoint와 layout guide
- Pretendard 12~18px 범위의 typography
- Gray, Primary, Danger, Warning, Success 의미색
- 모바일 아이콘 세트, Status Bar, Safe Area, Home Indicator
- 반복 확인된 16px 화면 여백, 10px paired-control gap, 8px compact gap

당시 모바일 원본에서 확인한 추가 의미색은 다음과 같다. 현재 사용 여부와 토큰명은 코드 레지스트리를 우선한다.

| Scale | Warning | Success |
|---:|---|---|
| 10 | `#FFF3DB` | `#EAF6EC` |
| 20 | `#FFE0A3` | `#D8EEDD` |
| 30 | `#FFC95C` | `#A9DAB4` |
| 40 | `#FFB114` | `#7EC88E` |
| 50 | `#F2A406` | `#3FA654` |
| 60 | `#C68501` | `#228738` |
| 70 | `#8A5C00` | `#267337` |
| 80 | `#614100` | `#285D33` |
| 90 | `#422C00` | `#1F4727` |
| 100 | `#2E1F00` | `#122B18` |
| 110 | `#241800` | `#0E2012` |

### Component

- Mobile Button, Input, Select, Toggle, Tab, Step
- `MobileRadioGroup`, `MobileCompactField`, `MobileDateStrip`
- `MobileFixedActions`, `MobileSheetHeader`, `MobileSheetActions`
- `MobileCenterDialogCard`
- 품질 판정 버튼과 Cavity 배열

### Pattern·화면 유형

- 홈·전체메뉴·알람·설정
- 입고·출하 목록과 실적 등록
- 생산실적·품목·LOT·작업자 선택
- 품질 기본정보·외관·중량·특이사항
- 운전일지, 라벨, 정비이력, 설비점검
- `mobile.navigation.two-depth-menu`
- `mobile.inspection.question-list`
- `mobile.form.section`, `mobile.form.hourly-entry`
- `mobile.list.compact-operation-table`
- `mobile.dialog.feedback`

컴포넌트 페이지에서 독립 세트를 찾지 못했다는 사실은 제품 패턴이 없다는 뜻이 아니다. Bottom Sheet, Toast, 날짜 선택, 숫자 키패드, Checkbox·Radio와 카드 목록은 실제 화면에서 추가 확인됐다.

과거 Material Design 3·iOS HIG 대조에서 FAB, Chip, Badge, Progress, Skeleton, Tooltip, Accordion, Date·Time Picker, Slider, Stepper, Action Sheet, Swipe Action, Empty·Error State 등이 공백 후보로 기록됐다. 이는 MES 요구나 승인 근거가 아니라 외부 표준과의 비교 목록이므로 현재 자산 또는 재개 우선순위로 자동 해석하지 않는다.

## 공통 모바일 정책

- 홈 퀵메뉴는 2열, 최대 8개이며 초과 시 본문만 스크롤한다.
- 하단 탭은 홈·알람·설정·전체메뉴이며 팝업에서는 숨긴다.
- 날짜 목록은 오늘을 기본값으로 하고 하루 단위 이전·다음 이동을 제공한다.
- Select A는 즉시 적용, Select B는 설정 화면에서 저장 후 적용한다.
- 뒤로가기는 입력값을 임시 보존한다.
- Toast는 저장 버튼 위에 표시하고 최신 한 개만 유지한다.
- 메모·날짜·숫자 키패드는 Bottom Sheet이며 중앙 모달로 바꾸지 않는다.
- 웹 Table을 축소하거나 가로 스크롤로 넣어 모바일 목록을 만들지 않는다.

## 검증 스냅샷

대표 화면은 구조, 2× 렌더링, 동작을 별도로 판정했다.

| 결과 | 화면 |
|---|---|
| 세 계층 검증 | 홈, 입고지시 리스트, 전체메뉴, 성적서 외관검사 |
| 구조·동작 통과, 렌더링 검토 중 | 생산실적 등록, 일지작성, 입고실적 등록, 정비 등록, 성적서 중량검사 |

- 대표 9종은 모두 구조·동작을 통과했다.
- 4종은 렌더링까지 `verified`, 5종은 2× 차이가 1% 승인선을 넘어 `implemented-reviewing`이다.
- 대표 원본 프레임 35개(메인 19, 팝업 16)는 개별 코드 경로와 Figma export 기준 이미지를 가진다.
- 추가 26개는 구조·핵심 동작과 임시 회귀선 6%(BOM 선택 7%)를 통과했지만 `verified`가 아니다.
- 화면 유형 보드의 63개 페이지 전체가 픽셀 승인됐다는 뜻으로 확대하지 않는다.

## 보존할 예외와 재발 원인

- 복사된 Figma 레이어명은 실제 내용과 다를 수 있어 섹션과 콘텐츠로 판정한다.
- 라벨생성은 개발범위 제외, 실적 LOT 모바일은 미진행 결정이 있어 활성 생성 근거에서 제외한다.
- 수량입력은 최신 변경안 `19649:98481`을 이전안보다 우선한다.
- 입고 목록 그라데이션의 시작점, SVG 슬롯과 실제 도형 크기, 파란 헤더 겹침, 첫 행과 반복 행 높이를 분리하지 않아 오차가 발생한 기록이 있다.
- 중량검사는 외곽만 비교해 내부 Cavity 셀 간격과 입력 폭을 놓친 적이 있어 내부 구조 계약을 별도로 유지한다.
- `10378:91087`은 실제 내용 기준 `BOM 선택`, `10378:93313`은 `시간대별 특이사항`으로 기록한다.
- `10378:92237` 로그인 원본은 `미정`만 존재하므로 임의 로그인 UI를 만들지 않는다.

## 재개 조건

1. 모바일 원본과 제품 방향이 안정화된다.
2. `mobile-assets.json`과 원본 근거 상태를 다시 `in-progress`로 전환한다.
3. 현재 기준 이미지를 최신 Figma와 재대조한다.
4. 웹 자산을 축소 재사용하지 않고 모바일 전용 Shell·Component·Pattern을 사용한다.
5. 실제로 필요한 화면부터 구조·렌더링·동작 세 계층을 다시 검증한다.
