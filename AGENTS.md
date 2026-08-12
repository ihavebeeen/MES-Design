# AGENTS.md — 이 저장소에서 작업하는 모든 AI 코딩 에이전트가 지켜야 할 규칙

이 파일은 Claude Code, Codex, Cursor, Copilot 등 어떤 AI 코딩 도구를 쓰든 공통으로 읽는 표준 컨텍스트 파일이다(2026년 기준 AGENTS.md는 업계 공용 표준).

## 이 프로젝트의 목적

MES(생산관리시스템) 제품의 UI 컴포넌트 라이브러리를 Figma 디자인 시스템 기준으로 구축해서, 이후 신규 화면을 AI 바이브코딩할 때 참고 컨텍스트로 쓰는 것. 담당자(이해빈)는 디자이너/기획자이며 코드를 직접 다루지 않는다 — Figma 추출, 토큰 실측, 코드 작성, 환경 구축, 배포까지 전 과정이 에이전트의 실행 책임이다.

## 매 세션 시작 시 반드시 할 것

1. `git pull origin main` 먼저 실행 — 다른 기기나 다른 도구(Claude/Codex/Cursor 등)에서 작업한 최신 내용을 받아온다.
2. `docs/` 폴더의 체크리스트 문서들과 Notion 페이지(DESIGN COMPONENT, MOBILE COMPONENT)를 확인해서 현재 진행 상태를 파악한다.
3. 사용자에게 "이어서 할 작업"을 다시 설명하지 않고, 파악한 상태 그대로 이어서 진행한다.

## 코드 빌드·검증 명령 (`component-library/`)

```
cd component-library
npm install          # 최초 1회 또는 package.json 변경 후
npm run dev           # 로컬 미리보기 서버, http://localhost:3000
npm run build          # 프로덕션 빌드 검증 (커밋 전 반드시 통과 확인)
npx eslint .            # 린트 검사
```

컴포넌트를 새로 만들거나 수정하면 커밋 전에 `npm run build`와 `npx eslint .`를 실행해서 통과를 확인한다.

## 작업 마무리 시 반드시 할 것

1. 변경사항을 의미 단위로 `git commit` 한다 (커밋 메시지는 한글로, 무엇을 왜 바꿨는지 명확히).
2. `git push origin main`을 시도한다.
   - 로컬 인증 정보 없는 격리 작업환경에 연결돼 있으면 push가 실패할 수 있다 — 이 경우 사용자에게 "GitHub Desktop에서 Push branch 눌러달라"고 안내하고 마무리한다.
   - 인증 정보가 있는 환경이면 바로 push까지 완료한다.

## 브랜치 전략

기본적으로 main에 바로 작업한다(1인 프로젝트라 충돌 위험 낮음, 문서 작업 위주). 다만 아래 경우에는 에이전트가 먼저 판단해서 "이번 건 브랜치 나눠서 할까요?"라고 사용자에게 먼저 물어보고 진행한다 — 판단은 에이전트가 하되 실행 승인은 사용자에게 받는다.

- 실험적이거나 실패 가능성이 있는 큰 변경(예: 컴포넌트 대량 리팩토링, 라이브러리 교체)
- 기존에 잘 동작하던 코드/문서를 크게 뜯어고치는 작업
- 결과가 마음에 안 들면 되돌리고 싶어질 만한 작업

단순 문서 추가/수정, 작은 버그 수정, 체크리스트 갱신 같은 건 브랜치 없이 바로 main에 커밋한다.

## 컴포넌트 실측·코드화 원칙 (재발 방지 규칙)

과거 세션에서 같은 섹션에 있다는 이유로 다른 컴포넌트의 값을 유추해 섞어 적었다가 오류가 난 적이 있음. 이후로 아래 원칙을 지킨다.

1. 측정값에는 반드시 실제로 Figma에서 조회한 node ID를 함께 기록한다 — 컴포넌트 이름만 적지 않는다.
2. 같은 패밀리·같은 섹션에 있다는 이유로 다른 컴포넌트의 값을 유추해서 채우지 않는다. 값 하나당 실측 하나가 원칙 — 예외 없음.
3. 서로 다른 두 컴포넌트의 수치가 우연히 같으면 "교차검증 성공"으로 반기지 말고 오히려 같은 노드를 두 번 참조했을 가능성을 의심한다.
4. 색상 팔레트(Gray/Primary/Danger)는 2026-07-28 기준 서로 다른 두 Figma 파일에서 각각 재대조해 확정(CONFIRMED)됐다 — `component-library/src/app/globals.css` 참고. 이 팔레트에 없는 색이 필요하면 임의로 팔레트에 편입시키지 말고 컴포넌트 코드에 출처와 함께 개별 기록한다.
5. 자세한 실측 방법론은 `docs/신규_컴포넌트_설계_프로세스.md` 참고.
6. (2026-07-28, Table 헤더-바디 정렬 재발 후 추가) 헤더/그룹행/데이터행/총계행처럼 "행
   종류가 여러 개인데 같은 컬럼 폭 배열을 공유해야 하는" 컴포넌트에 **새 UI 요소를
   추가할 때마다**, 그 요소가 차지하는 폭을 다른 모든 행 종류에도 빈 스페이서로 동일하게
   예약했는지 반드시 확인한다. 한 번 이 원칙을 지켜서 고쳐놨어도(예: 라벨을 Cell 안에
   넣는 방식으로 정렬 버그 수정), 다음 라운드에 완전히 다른 새 요소(예: 헤더 전용 마스터
   토글 버튼)를 추가하면서 이 원칙을 다시 깜빡하면 같은 종류의 정렬 버그가 재발한다 —
   실제로 Table에서 이렇게 두 번 발생함. 자세한 사례는 `docs/Table_수정_대기목록.md`
   2번, `AGENTS.md`의 "Table 작업 회고" 섹션 참고.
7. (2026-07-28, 같은 날 추가) 사용자가 명시적으로 범위를 지정한 수정 요청(예: "회전만
   바꿔줘")에는 딱 그 범위만 수정한다. 다른 부분도 같이 고치는 게 낫겠다고 판단되더라도,
   그 판단이 맞을 수도 있지만(실제로 이번에도 결과물이 원본 디자인과 더 비슷해지긴 했음)
   사용자 입장에서는 "요청 안 한 걸 왜 바꿨냐"는 신뢰 문제가 된다 — 범위 밖 변경이
   필요하다고 생각되면 먼저 이유를 설명하고 확인을 구한 뒤 진행한다.

## 완성 화면 Figma 재현 절차 (2026-08-07 확정)

완성 화면을 여러 개 한꺼번에 비슷하게 만드는 방식은 금지한다. `생산계획(일) 연동
일괄작업지시` 팝업(Figma `11210:50866`)을 다시 구현하면서 아래 절차가 실제로 정확도를
높인 것이 확인됐다. 이후 모든 완성 화면과 팝업에 같은 순서를 적용한다.

1. **한 번에 한 화면만 고정한다.** 대상 node와 이번에 수정하지 않을 화면을 먼저 선언한다.
2. `get_design_context`만 보고 코드를 시작하지 않는다. `get_metadata`로 외곽 프레임부터
   헤더·본문·섹션·테이블·행·셀 순서의 좌표/크기 장부를 만든다. HUG인 영역은 부모 크기와
   자식 크기·gap·padding의 합을 모두 대조한다.
3. **외곽 → 내부 순서로 맞춘다.** viewport, overlay, modal, header/body/footer, section,
   table, cell control 순서로 고친다. 바깥 크기가 틀린 상태에서 내부 여백을 눈대중으로
   보정하지 않는다.
4. 기존 Foundation/Component를 우선 사용한다. 원본에 필요한 차이가 있으면 기존 기본값을
   깨지 않는 optional prop/variant로 확장하고, 화면 안에서 비슷한 UI를 새로 그리지 않는다.
   optional prop을 추가하거나 의미를 바꾸면 `docs/컴포넌트_OPTIONAL_PROP_레지스트리.md`도
   같은 커밋에서 반드시 갱신한다.
5. Figma의 시각 상태뿐 아니라 **동작 상태도 연결한다.** Checkbox/Radio/Input/Table에
   `onChange={() => undefined}` 같은 no-op 핸들러가 남아 있으면 완료로 보지 않는다. 선택 전후,
   전체선택/부분선택, disabled, 열기/닫기를 실제 브라우저에서 조작해 상태 변화를 확인한다.
   선택된 행에서만 Input/Select/DatePicker가 보이는 화면은 특정 행 index에 편집 UI를
   하드코딩하지 않는다. 실제 선택 state에서 편집 상태를 파생하고, 다른 행의 선택·해제·재선택 및
   다중 선택에서도 컨트롤 전환과 입력값 유지 여부를 확인한다.
6. Figma 기준 viewport에서 로컬 렌더를 실측한다. `getBoundingClientRect`, `clientWidth`,
   `scrollWidth`, `clientHeight`, `scrollHeight`를 기록하고, 의도하지 않은 가로·세로 overflow가
   0인지 확인한다. 스크린샷 육안 확인은 이 수치 검증 뒤에 한다.
7. 차이는 `layout`, `token`, `component`, `content`, `state`로 분리해 하나씩 없앤다. "대충
   비슷함"을 완료 기준으로 사용하지 않는다.
8. TypeScript, 변경 파일 ESLint, `check:patterns`, production build를 통과시킨 뒤 화면 하나를
   의미 단위 커밋 하나로 묶는다.

`11210:50866`에서 정확도가 올라간 직접 원인은 (a) `1400×680` 모달이 공통 `max-height:80vh`로
실제로 `1240×576`까지 잘리던 문제를 브라우저에서 발견한 것, (b) Figma의 108px 조회 영역과
448px 테이블 영역을 별도 고정 섹션으로 복원한 것, (c) 선택열과 12개 컬럼 폭의 합을 1360px로
계산하고 DOM의 `scrollWidth/clientWidth`가 둘 다 1360인지 확인한 것, (d) 공통 컴포넌트를
재사용하면서 화면별 차이는 prop으로만 확장한 것이다.

## 참고 ID 모음 (검색 없이 바로 사용)

- Figma 컴포넌트 라이브러리 파일: fileKey `qEAQNTqXf76bYydyupti2V`
- Figma "MES Mobile" 페이지 노드: `163:8929`
- Figma 클라우드MES 파일(실제 서비스 화면, Button 등 컬러/상태 매트릭스 소스): fileKey `F4n5Zr04PAbiRjfIFQAo6v`
- Notion "DESIGN COMPONENT" 페이지: page_id `39d0e77b201580599d41efa847635870`
- Notion "MOBILE COMPONENT" 페이지: page_id `39d0e77b201580af9f0ef91b765a8c7e`
- GitHub 레포: `ihavebeeen/MES-Design`

## 알려진 이슈

- 이 레포 폴더가 로컬 GitHub Desktop과 동시에 열려 있으면, 격리된 작업환경에서 git 명령 실행 시 `.git/index.lock`, `.git/HEAD.lock` 같은 잠금 파일이 이미 있다는 에러가 종종 발생한다. `rm`으로 안 지워지면(`Operation not permitted`) `mv`로 파일명을 바꿔서 치우면 정상 진행된다. 삭제가 아니라 이름 변경이 핵심.
- 격리된 작업환경에는 GitHub 인증 정보가 없어서 `git push`는 항상 실패할 수 있다(의도된 제약인 경우가 많음 — 토큰을 에이전트가 직접 다루지 않기 위함). 이 경우 커밋까지만 하고, push는 사용자가 GitHub Desktop에서 직접 눌러야 한다.
- `ui.shadcn.com`, Google Fonts(`fonts.googleapis.com`) 등 일부 외부 도메인은 작업환경에 따라 네트워크가 막혀 있을 수 있다 — shadcn/ui는 CLI 대신 수동 구성, 폰트는 로컬 파일(`public/fonts/`) 자체 호스팅으로 우회했다.

## Table 컴포넌트 작업 회고 (2026-07-28)

같은 날 Table을 1~8차까지 반복 수정했고, 3차→4차 사이 "새 버그를 만들고 요청 범위를
벗어난 변경까지 했다"는 지적을 받았다. 아래는 라운드별 요지만 남긴 압축본 — 세부
수정 항목은 `docs/Table_수정_대기목록.md` 참고.

1차: Figma 원본+실제 수정 화면 대조 실측으로 첫 코드화(헤더 배경/점선 구분선/신규행
표시/그룹행 배경). 2차: 실사용 화면 스크린샷 기반 5건(다단 그룹화, 그룹 합계열 정렬,
그룹 체크박스+indeterminate, 헤더 정렬)을 수정 — "라벨을 첫 컬럼 Cell 안에 넣어 모든
행 종류가 같은 컬럼 폭을 쓰게" 통일한 게 이후 재발 방지 규칙 6번의 근거가 됨. 3차:
요청 안 받은 디자인 변경(펼침 버튼 테두리 임의 제거)을 스스로 판단해 저질렀고, 헤더에
새로 추가한 마스터 토글 버튼 폭을 다른 행 종류에 반영 안 해 2차에서 고친 정렬 버그가
재발 — 두 실수 모두 회고의 핵심 사례. 4차: 담당자 지시로 코드 수정 없이 대기목록만
정리. 4차 후속: 펼침 버튼의 정확한 수치(22×22px 등)를 받아 3차의 임의 변경을 원상
복구. 5차: 대기목록 전체 반영 — 체크박스/마스터 토글 영역 폭을 모든 행 종류에 공통
prop으로 내려 정렬을 구조적으로 재수정. 6차: 헤더 토글과 그룹행 펼침 버튼의 좌표
체계를 depth 슬롯 구조로 통일, 신규행 표시 위치 수정, 라벨 정렬 원인 2건 추가 수정.
7차: 체크박스 칼럼 폭을 상수화하다가 `TotalsRow`만 border-box 특성으로 12px 좁게
렌더링되던 6라운드째 미발견 버그를 찾아 수정, 헤더 숫자 라벨 정렬/1000단위 콤마 반영.
7차 후속: 데모 컬럼 정리, 담당자 이름으로 예시 데이터 교체, 헤더/그룹화/총계행을
분리해서 보여주는 미니 데모 4개 추가(컴포넌트 코드는 불변, 전부 optional prop 활용).
8차: 합본 데모를 접기/펼치기 토글로 전환. 8차 후속: 데모 안에 있던 장황한 수정 이력
설명 삭제, 섹션 폭을 다른 섹션과 통일하고 테이블 본문만 내부 스크롤 처리.

**핵심 교훈 (재발 방지 규칙 6·7번으로도 등록)**
1. 컬럼 폭을 공유하는 여러 행 종류가 있는 컴포넌트에 새 요소를 추가할 때마다, 그 요소의
   폭을 다른 모든 행 종류에도 동일하게 예약했는지 매번 다시 확인해야 한다 — 한 번 고쳤다고
   끝이 아니라, 새 요소를 추가하는 매 순간이 위험 지점이다.
2. 요청받은 수정 범위를 스스로 넓히지 않는다. "이것도 같이 고치면 좋겠다"는 판단이 맞을
   수도 있지만, 먼저 이유를 설명하고 확인을 구한 뒤 진행해야 한다 — 결과물이 우연히
   맞더라도 "요청 안 한 걸 왜 바꿨냐"는 신뢰 문제가 생긴다.
3. "구조적으로 고쳤다"고 말한 정렬 수정은, 그 이후 라운드에서 뭔가를 추가할 때마다
   다시 검증해야 하는 살아있는 제약이지, 한 번 고치고 끝나는 일회성 수정이 아니다.

## 참고 자료 우선순위

1. `docs/` 폴더의 MD 파일들 — 가장 상세한 원본
2. Notion "DESIGN COMPONENT" / "MOBILE COMPONENT" 페이지 — MD 파일과 대체로 동일하지만 일부 섹션은 축약돼 있을 수 있음(불일치 발견 시 MD 기준으로 정정)
3. Figma 파일 — 실제 디자인 원본, 토큰 실측은 여기서

## 향후 스코프 (아직 일정 미확정)

기존에 이미 개발/배포된 MES 시스템이 있으며, 장기적으로는 이 신규 컴포넌트 라이브러리 기준으로 기존 화면을 리팩토링하는 것도 목표에 포함된다(현재 일정 미확정, 컴포넌트 라이브러리 완성이 선행 조건). 원자 단위 컴포넌트(버튼/뱃지/모달 등)는 화면별 매핑 불필요 — 교체 시 전 화면에 자동 반영됨. MES 특화 복합 패턴(화면 템플릿 등)만 화면 대응 기록이 의미 있음.

## 현재 진행 상태 (날짜순 로그, 아래로 갈수록 최신)

- (2026-07-30, 3차) 담당자가 "컴포넌트부터 모아보자"고 방향 재확인 — 실측된 파일럿 10개
  컴포넌트가 전부 소진됐다고 보고했더니, 담당자가 "내가 Figma 파일 둘러보면서 후보 찾기"를
  선택. 두 Figma 파일(컴포넌트 라이브러리/클라우드MES)을 `get_metadata`로 직접 훑어서
  기존에 발견 못 했던 실측 자료를 찾아냄:
  1. **Page Top Tab Item 완성**: 처음엔 "Default" variant만 찾아서 "부분"으로 남겼었는데,
     이번에 형제 노드(157:18051 컴포넌트 세트 하위 default/hover/active)를 찾아 재검증 —
     active 상태가 판단값("배경만 밝게")이 아니라 실제로는 배경 Gray-110 + 제목 SemiBold라는
     걸 확인해 정정. 체크리스트 "부분"→"있음" 승격.
  2. **Sidebar 접기버튼 hover 추가**: node 133:2050 재조회로 hover 시 Gray-90(#5C667B)임을
     확인해 반영. 1-depth/2-depth 항목의 hover/active는 metadata에서 노드는 찾았지만
     실제 스타일 노드가 아니라 번호 매겨진 캡션 텍스트("1. 대메뉴 버튼" 등)였음이 드러나서
     여전히 "부분"으로 남김 — 필요하면 스크린샷 육안 대조로 재시도.
  3. **AlarmListItem 신규 발견 및 코드화**: 기존에 아무도 몰랐던 컴포넌트 — node 163:3039
     "MES 알람 리스트"에 tone(blue/red/yellow/green) × hover × read × 두줄 조합 32개
     variant가 실제로 존재. 좌측 4px tone 강조바 + 제목/시각/설명 텍스트 구조. tone 4색은
     Primary/Danger 등 기존 팔레트와 다른 별도 값이라 `globals.css`에 `--mes-alarm-*`로
     신설. `read` prop의 실제 의미(이름과 시각효과가 반대로 느껴짐)와 "두줄" placeholder의
     정확한 용도는 확인 필요로 남김. 체크리스트 "Alarm List/Table"(있음=Figma 확인만) 행에
     코드 참조 추가.
  - 세 건 모두 `page.tsx` 데모 반영, eslint+tsc 클린 확인 후 커밋 완료.
- (2026-07-30, 4차) 담당자가 "그럼 내가 링크 보내줘야 하는거임?"이라고 질문 — 아직 두 파일도
  다 안 봤다고 답하고 metadata를 계속 더 훑음. 첫 번째 파일(컴포넌트 라이브러리)의 아직 안 본
  부분에서 Sidebar의 진짜 컴포넌트 세트를 발견(앞서 3차에서 찾은 133:2067 등은 캡션
  텍스트였을 뿐, 진짜는 133:2042/2235/2248 세트) — 재검증 완료:
  - 1-depth 항목: hover(Gray-120)와 active(Primary-60, "현재 선택된 페이지")가 서로 다른
    색이라는 걸 처음 확인 — 이전엔 구분 없이 Gray-120 하나로만 처리했었음. `activeKey`
    prop을 `expandedKey`와 별개로 신설.
  - 2-depth 항목: 실측 결과가 기존 판단값(hover=Gray-120, active=Primary-60)과 정확히
    일치 — 처음 스크린샷 육안 대조가 맞았던 걸로 확인.
  - MES/FEMS 토글: hover 배경(Gray-20) 추가.
  - 접기(collapsed rail, `SNB-hide`) 상태는 존재만 확인, 완전히 다른 레이아웃이라 이번엔
    범위 밖 — "부분" 유지.
  - 보너스: `mes/icon-setting`(톱니바퀴) 실제 벡터가 Figma에 있다는 것도 확인(이미지
    애셋이라 코드로 못 뽑음 — 담당자가 export 해주면 lucide placeholder 교체 예정).
  - eslint+tsc 클린 확인 후 커밋.
- (2026-07-30, 5차) 담당자가 신규 발견된 "알림 리스트"(알림모달) organism을 코드화하기로
  선택("알림 드롭다운 패널부터 코드화") — node 157:15771("알림모달 2", 데이터 있음)과
  157:15833("알림 내역 존재 X", 빈 상태) 둘 다 `get_design_context`로 실측해
  `components/ui/notification-panel.tsx` 신규 작성. AlarmListItem을 그대로 재사용하는
  상위 organism 구조(헤더 "전체 알림" 탭+카운트+닫기 / 리스트 350px 스크롤 또는 빈 상태
  문구 / 필터 아이콘 액션 줄) — 3층(합성 패턴 카탈로그) 개념이 실제로 처음 나타난 사례.
  실측 중 "미확인"/"확인" 탭으로 추정되는 빈 자리(너비가 상태마다 10/39/26px로 제각각이고
  두 상태 모두 실제 라벨 텍스트가 렌더링 안 됨)와, 같은 페이지 metadata에서 발견했던
  "모두 확인으로 표시"/"알림 설정" 텍스트 노드가 이 패널의 실제 트리에 자식으로 포함되어
  있지 않다는 걸 `get_design_context`로 재확인 — 셋 다 이번 범위에서 제외하고 컴포넌트
  주석에 확인 필요로 남김. 체크리스트 "Notification / Bell" 행 "없음"→"있음" 승격,
  `page.tsx`에 데이터 있음/빈 상태 2종 데모 추가. eslint+tsc 클린 확인 후 커밋 예정.
- (2026-07-30, 6차) 담당자가 알림 패널 스크린샷을 주며 사이즈 재실측값 지정 — 패널 전체
  폭 440px→400px, 헤더 타이틀 15→16px, AlarmListItem 제목 14/설명 13/날짜 12px(기존 전부
  15px 오류), 좌측 tone 강조바 23px→42px(실측 41.78px 반올림). `notification-panel.tsx`/
  `alarm-list-item.tsx` 수정.
- (2026-07-30, 7차) 담당자가 "색상/폰트를 페이지 상단에 몰아놔야 하지 않냐"고 지적 —
  `page.tsx` 최상단(h1 바로 아래)에 Foundation 섹션 신설. 색상 팔레트 스와치(Gray/Primary/
  Danger/Yellow/Alarm)와 타이포그래피 스케일 표를 모아둠. Tailwind가 동적 클래스명
  (`bg-mes-gray-${step}`)을 정적 스캔 못 하는 문제 때문에 스와치는 inline style로 hex
  직접 지정.
- (2026-07-30, 8차) 담당자가 "Yellow도 단계가 있을 텐데 확인해서 보강, 폰트도 크기·굵기·
  자간·행간까지 표기"라고 요청. Yellow는 이전엔 우연히 마주친 3단계(10/20/50)만 확정
  상태였는데, 담당자가 정확한 Figma 링크(fileKey F4n5Zr04PAbiRjfIFQAo6v, node
  20170:67850, "System Color" 레퍼런스 프레임)를 줘서 `get_variable_defs`/
  `get_design_context`로 전 단계(10~110, Gray/Primary/Danger와 동일한 11단계 구조,
  20=surface/40=Base/50=Text 역할 라벨) 확정 — `globals.css`/`page.tsx`의
  `YELLOW_PALETTE` 갱신. 타이포그래피 표는 "크기당 대표값 1개"에서 실제 코드에 존재하는
  (크기·굵기·자간·행간) 조합 단위로 재정리(16행) — 자간이 컴포넌트마다 다르게 실측돼 있고,
  2026-07-29 이전 컴포넌트 대부분은 자간이 아예 미측정 상태였다는 것도 이번에 명시적으로
  드러남(AlarmListItem 자간 -0.1875px가 같은 크기의 Badge/Tag -0.15px와 다른 것도 예외로
  기록). `docs/디자인_토큰_사용_규칙.md` 6절/9절 동기화.
- (2026-07-30, 9차) 담당자가 8차의 타이포 표를 보고 "이렇게 지저분하게 정리할 거면 왜
  했냐, 참고 이미지(Pretendard 굵기별×크기별 스케일 + 실사용 조합 빨간 점 표시)처럼
  깔끔하게 정리해달라"고 지적. 동시에 "자간은 실측값이 그런 건 알겠는데 그냥 0으로, 행간도
  그냥 150%로 고정하자 — 130% 예외를 굳이 둘 필요를 모르겠다"는 표준화 결정도 내림. 두
  요청을 반영해:
  1. **컴포넌트 코드 자체를 정리**: Tag/Badge/Sidebar MES·FEMS 토글/AlarmListItem/
     NotificationPanel에 있던 개별 tracking(-0.15/-0.1625/-0.1875px) 클래스를 전부
     제거, Table(6곳)/Progress/NoticeBanner의 leading-1.3·1.4를 leading-[1.5]로,
     ConfirmDialog 설명의 leading-normal도 leading-[1.5]로 통일 — 이제 전 컴포넌트가
     자간 0(미지정) / 행간 150% 상태.
  2. **Foundation 타이포 섹션 재설계**: 8차의 자간/행간 열이 있는 16행짜리 표를 폐기하고,
     참고 이미지와 같은 형태로 재구성 — 굵기(Bold/SemiBold/Medium/Regular) 4열 × 크기
     (12~18px) 행의 매트릭스, 실제로 코드에 쓰이는 조합에만 빨간 점 표시. 크기·굵기별
     실제 폰트 스타일로 샘플 텍스트 렌더링.
  `docs/디자인_토큰_사용_규칙.md` 6절도 같은 매트릭스 형태(마크다운 표)로 재작성, 9절의
  "자간 미측정" 항목은 이제 해당 없어져 삭제. eslint+tsc 클린 확인 후 커밋.
- (2026-07-30, 10차) 담당자가 타이포그래피 표에서 빨간 점 때문에 첫 줄만 텍스트가
  오른쪽으로 밀린다고 지적 — 점(leading icon)을 없애고 실사용 조합엔 대신 텍스트에
  회색 밑줄(underline)을 긋는 방식으로 교체. 밑줄은 text-decoration이라 레이아웃 폭에
  영향을 주지 않아 모든 줄이 동일한 x축에서 좌측정렬됨.
- (2026-07-30, 11차) 담당자가 데모 페이지 전반에 대해 세 가지 요청: (1) 각 섹션 제목이
  잘 안 보이니 더 잘 보이게, (2) 섹션 사이사이 구분선, (3) 상단에 하이퍼링크 목록을 둬서
  클릭하면 해당 섹션으로 자동 스크롤. 반영:
  1. **제목 강조**: 모든 섹션 h2(공용 `Section` 헬퍼 포함, 11곳을 한 번에 `replace_all`로
     처리)를 `text-[14px] font-semibold`에서 `border-l-4 border-mes-primary-60 pl-3
     text-[17px] font-bold`로 — 파란 액센트 바 + 확대.
  2. **구분선 보강**: `아이콘 라이브러리`, `Table · 합본 데모` 두 섹션에 누락돼 있던
     `border-b border-mes-gray-30`를 추가(마지막 섹션인 `Table — 구조 요소별 분리
     데모`는 뒤에 아무것도 없어 그대로 둠). 이 외 섹션들은 이미 다 갖고 있었음.
  3. **상단 TOC**: 데모 페이지에 있는 25개 섹션/서브섹션 전부에 `id`를 부여(공용
     `Section` 헬퍼는 `id` prop 신설, 나머지는 `<section id="...">` 직접 지정)하고,
     h1 바로 아래 `TOC_LINKS` 배열 기반 앵커 링크 목록(알약 모양 칩)을 추가 — 클릭하면
     해당 섹션으로 스크롤. `globals.css`의 `html`에 `scroll-behavior: smooth` 추가,
     각 섹션엔 `scroll-mt-6`을 걸어 스크롤 도착 시 위쪽 여백 확보. eslint+tsc 클린
     확인 후 커밋.
- (2026-07-30, 12차) 담당자가 두 가지 추가 지적: (1) 섹션 제목 밑 설명 문단들이 "담당자가
  ~/실측값이 ~" 식으로 너무 장황하니 핵심만 짧게 축약할 것, (2) `Sample`(예: "Button ·
  Basic · Default") 라벨이 너무 작아 안 보이는데 컴포넌트보다 튀지 않을 정도로만 살짝
  키울 것. 반영:
  1. 섹션 설명 문단 10곳(색상 팔레트/타이포/Filter/NoticeBanner/PageTopTabItem/
     Sidebar/AlarmListItem/NotificationPanel/아이콘 라이브러리/Table 분리 데모)을
     전부 1줄 내외로 축약 — "담당자가 준 링크로", "2026-07-30 재검증" 같은 경위 서술은
     빼고 핵심 사실만 남김.
  2. `Sample` 컴포넌트 라벨: `text-[11px] text-mes-gray-70` → `text-[12px] font-medium
     text-mes-gray-90`로 소폭 확대. eslint+tsc 클린 확인 후 커밋.
- (2026-07-30, 13차) 담당자가 "색상/타이포는 페이지에 추가했는데 간격/Radius/그림자
  규칙도 추가해달라"고 요청. `docs/디자인_토큰_사용_규칙.md` 2/4/5절 값을 그대로 Foundation
  섹션에 시각화해서 추가:
  1. **간격**: 1~32px 15개 값을 실제 너비의 바 + px 라벨 + 용도로 나열(4px 배수를 벗어난
     5px/6px 등도 그대로 유지).
  2. **Radius**: 2/3/4/8/12/16px + full(pill) 7종을 실제 `border-radius`를 적용한
     박스로 렌더링 — full은 pill 모양이 드러나게 가로로 긴 박스 사용.
  3. **그림자**: 4개 프리셋(낮은 부유/중간 모달/큰·집중형 모달/토스트)을 흰 배경
     박스에 실제 `filter: drop-shadow(...)`로 적용해 렌더링(box-shadow와 drop-shadow가
     섞여 있었지만 스프레드 없는 값이라 미리보기는 drop-shadow로 통일해도 시각적으로 동일).
  세 섹션 다 Foundation `<section>` 안에 id 부여, TOC_LINKS에 간격/Radius/그림자 3개
  추가. eslint+tsc 클린 확인 후 커밋.
- (2026-07-30) 담당자가 Center Modal을 코드에서 빼라고 지시 — Center Modal과 Side Slide
  Panel이 위계상 비슷한 레벨이라 나중에 두 개를 한꺼번에 자료로 보내주겠다고 함. 또한
  Center Modal 자체도 내부 구성(테이블만 있는 것 / 상단바+테이블 / 폼 등)이 다양해서
  지금 단계에서 하나로 뭉뚱그려 코드화하는 게 맞지 않는다는 점도 언급(아직 구체적 스펙은
  없음). 코드는 `docs/보류_컴포넌트/center-modal.tsx.bak`에 백업해두고 `page.tsx`
  데모/체크리스트에서 제거, 체크리스트 상태는 "보류"로 변경.
- (2026-07-30, 곧바로 이어서) 담당자가 방향을 재정의: 지금 하는 작업이 단순 "컴포넌트
  라이브러리"가 아니라, 이 라이브러리를 기반으로 AI가 화면을 자동으로 조립할 수 있는
  "A-to-Z 디자인 시스템"을 만드는 게 최종 목표라고 명확히 함 — 예: "모달 안에 테이블이
  들어가려면 이렇게 조합해야 하고, 그 사이 간격은 보통 이렇게 쓴다"는 규칙을 AI가 스스로
  판단해서 화면을 만들어낼 수 있어야 함. 다음 단계로 컴포넌트 합성 규칙(composition
  rules)과 화면 레시피를 구조화하는 작업이 필요 — 상세 논의는 대화 로그 참고.
  3층 구조로 정리: 1층 토큰 규칙, 2층 컴포넌트(지금 있는 것), 3층 합성 패턴 카탈로그.
  담당자가 "1층(토큰)부터"를 선택해서 우선 착수.
- (2026-07-30, 곧바로 이어서) 1층 작업 완료: 기존 18개 컴포넌트(button/input/select/
  combobox/table/badge/radio/checkbox/progress/filter/tag/filter-tag/toast/
  confirm-dialog/notice-banner/radio-choice-dialog/page-top-tab-item/sidebar) 전수
  조사해서 간격/radius/그림자/타이포/색상 role 사용 패턴을 규칙표로 정리 —
  `docs/디자인_토큰_사용_규칙.md` 신규 작성. 값 자체는 이미 각 컴포넌트 주석에 있었지만
  "어느 상황에 어떤 값"이라는 역할별 lookup 형태로는 처음 정리된 것. 문서 안에 팔레트에
  일부러 편입 안 한 예외값 목록, 아직 못 채운 부분(위험 텍스트색/Yellow 미완성 단계 등)도
  같이 기록. 다음은 3층(화면 패턴 카탈로그) — 담당자가 Center Modal/Side Slide Panel
  자료를 보내주면 그걸 패턴 예시로 등록하며 시작할 예정.
- 데스크탑/모바일 컴포넌트 체크리스트 문서화 완료 (전수 재검증 완료)
- 신규 컴포넌트 설계 SOP 문서화 완료
- 주요 컴포넌트 기능 변형 심층 분석 완료
- Figma 실측 파일럿 완료 — 5개 패밀리 전체 커버 10개 컴포넌트(Button/Input Textbox/Selectbox/Badge/Center Modal/Toast/Page Top Tab Item/Sidebar(SNB)/Confirm Dialog/Table) 실측
- 색상 팔레트(Gray/Primary/Danger) 확정(CONFIRMED) — 서로 다른 두 Figma 파일에서 각각 재대조해 100% 일치 확인
- 코드 스캐폴딩 완료(`component-library/`) — Next.js 16 + React 19 + TypeScript + Tailwind CSS v4, shadcn/ui 스타일 컨벤션(수동 구성), Pretendard 폰트 자체 호스팅
- Button 컴포넌트 완성 — 사이즈 3종 × 컬러 7종 × 상태(Default/hover/disabled), 아이콘 옵션 포함
- Input Textbox / Selectbox 완성 — Figma 정밀 실측(획 두께 포함), Selectbox는 Radix Select 기반 커스텀 드롭다운으로 구현
- Combobox(검색 내장 셀렉트) 신규 완성 — Selectbox와 별도 컴포넌트로 분리(`combobox.tsx`, Radix Popover 기반). 선택 항목 hover 테두리 색은 미실측 임시값(Primary-40) 적용 중 — devtools 확인 필요(체크리스트 19번 섹션 참고)
- Badge/Radio/Checkbox 완성 — 클라우드MES 파일 정밀실측(`badge.tsx`/`radio.tsx`/`checkbox.tsx`). Badge는 Figma 이름-색상 불일치 2건(orange=실제 gray, yellow=실제 blue) 발견해 실측값 그대로 반영, 원본 확인 필요(체크리스트 19번 섹션). Checkbox는 이전 체크리스트에 "없음"으로 잘못 기재돼 있었으나 실제로 존재함을 확인해 정정. Radio/Checkbox 둘 다 disabled+선택됨 조합은 Figma에 없어 판단값 처리
- (2026-07-29) 코드화된 컴포넌트들의 "미확인" 세부 항목을 담당자가 일괄 확인·정리:
  (1) Table "기본-disable/분할" 변형 — 실제 화면(판매관리 리스트) 스크린샷으로 disable은
  별도 행 스타일 없이 미처리 값을 "-"/"0"으로만 표시한다는 게 확인됨(코드 변경 불필요,
  항목 종결), "분할"은 담당자도 무엇인지 특정 못 해 보류. (2) Combobox의 selected+hover
  테두리 색(Primary-40 임시값)은 "그대로 유지"로 확정 — devtools 재확인 불필요한 최종값이
  됨(select.tsx는 이번에 언급 안 돼 기존 임시값 상태 유지). (3) Badge 7종을 Figma 원본
  이름 대신 실제 색 기준으로 개명(값은 그대로) — orange→`grayFill`, yellow→`blue2`,
  variant6→`blueLight`, variant7→`blueOutline`(blue/red/gray는 이미 정확해서 유지),
  `badge.tsx`·데모 페이지 동시 수정. (4) ConfirmDialog 다른 톤 변형은 "좀 이따 자료
  전달" — 보류. (5) RadioChoiceDialog의 "삭제 모달 - 드롭다운" 변형은 원래 있었는데
  담당자도 못 찾는 상태라 당분간 제외, 필요해지면 판단값으로 만들어도 무방하다고 확인.
  (6) Checkbox "default(회색)/main(파랑)/black(검정) 실사용 상황" 확인 필요 항목 —
  실사용에서는 원래 `color="gray"`(통칭 "checked-gray")를 기본으로 쓴다고 확인, 코드
  변경 없이 항목 종결. `docs/UI_컴포넌트_총망라_체크리스트.md`의 해당 컴포넌트 행에
  각각 반영함.
- (2026-07-29, 곧바로 이어서) 위에서 "Table disable은 별도 스타일 없음"이라고 결론
  내렸던 게 틀렸음 — 담당자가 같은 스크린샷을 다시 근거로 정확한 값을 지정: 비활성 행은
  텍스트 Gray-80, 배경 Gray-10. `table.tsx`의 `DataRow`에서 기존 `opacity-50` 판단값을
  이 값으로 교체(배경은 disabled가 선택 상태보다 우선, 텍스트 색 분기 추가,
  `pointer-events-none`은 유지). 데모에서 `rowR8`을 `disabled: true`로 지정해 확인
  가능하게 함. `docs/Table_수정_대기목록.md` 19번 참고. **교훈**: 스크린샷 한 장으로
  "이런 스타일이 없다"고 성급히 결론 내리지 말고, 애매하면 먼저 확인을 구할 것 —
  이번엔 담당자가 먼저 정정해줘서 큰 문제 없었지만 재발 방지 규칙 7번(범위 확대 전
  확인)과 같은 맥락의 실수.
- Progress Bar 완성(`progress.tsx`) — 트랙 Gray-40, 채움 Gray-100
- 필터 전용 Tag(`filter-tag.tsx`, type1/type2), 범용 3색 Tag(`tag.tsx`, node 9873:83675 —
  담당자 확인상 실사용 빈도 낮음, Badge가 주력), Filter 트리거+활성태그(`filter.tsx`) 완성
- Filter를 트리거+플라이아웃+활성태그 통합 컴포넌트로 완성(`filter.tsx` 하나로 병합, 기존
  `filter-flyout.tsx`는 삭제). 이후 담당자 재검토로 3건 추가 수정: (1) 태그를 "1개=개수
  뱃지/2개 이상=전체보기"에서 선택 개수만 항상 표시하는 방식으로 통일, (2) 트리거 박스와
  활성 태그 박스를 독립된 두 박스로 분리(태그 없으면 트리거만 노출), (3) 트리거 아이콘을
  임의 선택했던 lucide Filter(깔때기)에서 벡터 좌표 재분석 기반 SlidersHorizontal로 교체
- Select/Combobox 트리거에 `icon` prop 추가 완료 — 기본 ChevronDown 대신 다른 아이콘으로 교체 가능
- Tag(범용 3색)를 Button과 동일한 startIcon/endIcon 슬롯 구조로 재구현 — Figma에 X 아이콘이
  앞뒤 2개 있던 건 중복 실수가 아니라 원래 이런 슬롯 구조였음을 담당자가 확인해줌
- Toast 완성(`toast.tsx`) — TOAST-RED/TOAST-BLUE 두 개 개별 프레임 정밀실측. 스낵바는 없음
  (담당자 확인). gap은 담당자 결정으로 8px 통일, 나머지(닫기아이콘 크기/테두리색/BLUE
  배경색이 Primary-60과 다른 점)는 실측 그대로 유지
- ConfirmDialog 완성(`confirm-dialog.tsx`, Radix Dialog 기반) — node 11106:37629
  "modal-error" 정밀실측(에러 톤 + 버튼 1개 형태만). 확인/취소 2버튼형이나 다른 톤
  변형은 미실측(체크리스트 19번 섹션 등록)
- (2026-07-29) 담당자가 준 Figma "모달" 갤러리 링크(node 18887:62605, "모달은 종류가
  되게 많아")로 ConfirmDialog 확장 + NoticeBanner 신규 구현. 스크린샷으로 확인해보니
  확인/취소 2버튼은 기존 `actions` 배열로 이미 가능했음(코드 변경 불필요), 에러(빨강)/
  경고(주황)/알림(파랑) 3톤이 전부 같은 `IconExclamationCircle`을 색만 바꿔 쓰는
  구조라 `tone` prop만 추가(warning=Yellow-50, info=Primary-60, 둘 다
  `get_variable_defs`로 실측). "라벨 생성 불가" 모달에 붙는 노란 안내 배너(안내문+
  "OO 바로가기 →" 링크)는 모달 전용이 아니라 독립 컴포넌트로도 쓰이는 걸 확인해
  `notice-banner.tsx`(`NoticeBanner`)로 분리 구현, ConfirmDialog엔 `banner` prop으로
  통합. 이 과정에서 `get_metadata`/`get_design_context`가 이 노드(모달이 많이 몰려있는
  큰 프레임)에서 "SSE 파싱 에러"로 계속 실패하는 걸 발견 — `get_screenshot`/
  `get_variable_defs`는 정상 동작해서 색상은 실측했지만, 배너의 정확한 padding/radius
  px와 배너 아이콘 벡터는 스크린샷 육안 대조 판단값으로 처리(체크리스트 19번 섹션에
  도구 실패 이력 등록). Yellow 팔레트(10/20/50만, 전 단계 아님)를 `globals.css`에
  신규 추가 — Gray/Primary/Danger처럼 전 단계 확정된 팔레트는 아님. 모바일(배경 딤
  처리) 변형은 담당자 확인 후 범위 밖으로 보류.
- (2026-07-29, 곧바로 이어서) 담당자가 "버튼과 메세지 사이 간격이 네가 한 게 맞냐"고
  재확인 요청 → 배너 없는 일반 형태는 원본 노드(11106:37629)를 다시 직접
  `get_design_context`로 조회해서 32px(본문)+20px(푸터)=52px가 실측값 그대로임을
  재확인(제가 지어낸 값 아님). 배너 포함 형태의 "배너-버튼 간격"만 판단값이었는데,
  담당자가 정확한 값(20px, 기존 52px는 틀렸음)을 직접 줘서 정정 — 배너 아래쪽엔 별도
  padding을 주지 않고 푸터 자체의 20px만으로 맞춤(`confirm-dialog.tsx` 수정). 또한
  담당자가 이 배너를 "배너"가 아니라 "도움말"/"툴팁"이라고 부른다는 것도 확인해 주석에
  기록(컴포넌트명 `NoticeBanner`는 유지).
- (2026-07-29, 곧바로 이어서) 담당자가 배너 아이콘을 지적: "전구 모양이어야 하는데 왜
  느낌표로 했냐". `notice-banner.tsx`에 애초에 "실제 벡터가 다르면(예: 전구 아이콘 등)
  나중에 교체 필요"라고 판단값임을 명시해뒀던 부분 — 실측 자료가 없어 기존
  `IconExclamationCircle`을 임시로 재사용했던 것을 `lucide-react`의 `Lightbulb`로
  교체. 이것도 실측 벡터는 아니라서(담당자가 Figma에서 실제 전구 아이콘을 export해주면
  다른 33종처럼 다시 교체 필요) 계속 "확인 필요" 목록에 남겨둠.
- (2026-07-29, 곧바로 이어서) 담당자가 배너 없는 일반 ConfirmDialog도 "본문-버튼 간격이
  40px쯤 되어 보인다, 20px로 하자"고 지시. 이 32px+20px=52px 값은 앞서
  `get_design_context`로 원본 노드(11106:37629)를 직접 재확인해서 "제가 지어낸 값이
  아니라 진짜 실측값"이라고 담당자에게 확인해줬던 바로 그 값인데, 담당자가 실측치와
  무관하게 더 좁은 값(20px)으로 명시적으로 바꾸자고 확정 지시함 — 배너 케이스와 동일한
  방식(본문 하단 padding 제거, 푸터 자체의 20px에 위임)으로 반영. **핵심**: 실측값이라고
  해서 항상 최종 정답은 아니다 — 담당자가 명시적으로 다른 값을 지정하면 실측치보다
  담당자 지정값이 우선한다(재발 방지 규칙과는 별개로, "실측 = 진실"이 아니라 "실측 =
  출발점"이라는 걸 보여준 사례로 기록).
- (2026-07-29, 곧바로 이어서) 담당자가 "실측만 되고 코드화 안 된 것들 있지 않냐, 그거
  코드화하면 안 되냐, 프레임 링크 새로 줘야 하냐"고 질문 — `docs/신규_컴포넌트_설계_
  프로세스.md`에 이미 기록돼 있던 Center Modal / Page Top Tab Item / Sidebar(SNB) 실측값을
  근거로, 새 링크 없이 바로 착수하되 각 노드를 `get_design_context`로 재조회해 기존 기록과
  대조하는 방식으로 진행(과거 "Center Modal과 Confirm Dialog 값을 착각해 뒤섞었던" 사고
  이력이 있어 재검증 없이 그대로 코드화하지 않음).
  1. **Center Modal**(`center-modal.tsx`, node 168:37994 "modal") — radius 16px(ConfirmDialog
     12px과 다름), 그림자 `0 0 24px rgba(0,0,0,.2)`(offset 없이 사방 확산), 헤더는 ConfirmDialog와
     동일 구조라 재사용, 본문 콘텐츠 영역(Gray-20 배경, 326px 높이)은 `children`으로 교체하는
     범용 슬롯, 푸터 버튼 2개는 고정폭 160px(flex-1 아님) + `fillGray`/`fillBlack` 그대로 재사용.
     재검증으로 기록값 일치 확인, 판단값(전체 너비 `max-w-[720px]`, 스크롤 처리)은 주석에 명시.
  2. **Page Top Tab Item**(`page-top-tab-item.tsx`, node 157:18052 "Property 1=Default") — 높이
     38px, 배경 검정, 북마크(`IconStar`)+제목+닫기(`IconX`) 구조. "Default" variant 1종만
     실측됨(형제 variant를 못 찾음) — `active` prop은 배경만 밝게 하는 판단값으로 임시 구현,
     체크리스트엔 "부분"으로 등록.
  3. **Sidebar/SNB**(`sidebar.tsx`, node 133:1976 "SNB-active") — 로고행+접기버튼, 즐겨찾기/
     대시보드 퀵메뉴, MES/FEMS 토글, 1-depth 항목 리스트(펼침 화살표는 기존 `IconArrow`를
     회전시켜 재사용), 펼쳐진 1-depth의 2-depth 하위 목록(들여쓰기 32px, 선택 항목은
     Primary-60 파랑 배경)까지 한 프레임 안에서 전부 실측. 문서에 적혀 있던 하위 요소별 node id
     (133:2042 등)와 이번에 실제로 뜬 id(133:2030 등)가 표기가 달랐지만 구조/스펙 자체는 문서
     기록과 일치해 실측값 그대로 채택. "MES 설정" 항목만 2-depth가 실측됐고 나머지 1-depth
     항목(자재관리 등)도 동일한 펼침 화살표는 갖지만 하위 내용은 미실측 — 체크리스트 "부분".
     "MES 설정" 아이콘은 33개 아이콘 목록에 톱니바퀴가 없어 `lucide-react` `Settings`를 임시
     placeholder로 사용(확인 필요 목록에 등록).
  - 세 컴포넌트 모두 데모 페이지(`page.tsx`)에 섹션 추가. 빌드 검증은 `npx eslint .`와
    `npx tsc --noEmit` 둘 다 클린 통과 확인 — 이 세션의 샌드박스에서 `next build`(SWC/
    lightningcss 네이티브 바이너리)가 마운트된 네트워크 드라이브 위에서 mmap 시 Bus error로
    죽는 환경 자체의 문제를 발견(파일을 로컬 `/tmp`로 체크섬까지 맞춰 복사해도 동일 — 코드
    문제가 아니라 이 세션 샌드박스의 네이티브 바이너리 로딩 제약으로 결론) — 그래서 이번엔
    eslint+tsc로 대체 검증함. 다음 세션에서 `next build`가 정상 동작하면 한 번 더 전체
    프로덕션 빌드로 재확인할 것.
- RadioChoiceDialog 완성(`radio-choice-dialog.tsx`, Radix Dialog 기반) — node
  18840:61182 "modal"(실측 인스턴스명 "투입품목 추가") 정밀실측. 라디오 2택+되돌릴 수
  없음 경고배너+취소/다음 버튼 구조, 기존 `Radio` 컴포넌트 재사용. radius 16px/그림자
  `0px 0px 24px rgba(0,0,0,.2)`로 ConfirmDialog(radius 12px/그림자 다름)와 값이 달라
  임의로 맞추지 않고 각각 실측값 유지(체크리스트 19번 섹션 등록). 담당자가 지목한 "삭제
  모달 - 드롭다운/라디오버튼" 중 라디오 쪽으로 추정되나 실측 문구 자체는 "삭제"가 아니라
  "투입품목 추가"라 재확인 필요, 드롭다운 쪽은 아직 미전달
- 아이콘 라이브러리 신규 구축(`component-library/src/components/icons/`, 33개 컴포넌트) —
  담당자가 Figma에서 직접 SVG export해 `component-library/icon/mes/`에 전달, 색상
  variant(currentColor 일반화)와 실제 형태가 다른 variant(bell/star/userMono는
  outline·filled 등 진짜 다른 도형 존재)를 구분해서 구현. filter.tsx/toast.tsx(RED만)/
  confirm-dialog.tsx/radio-choice-dialog.tsx의 기존 lucide 대체 아이콘을 실제 벡터로
  교체 완료. 상세는 `docs/아이콘_매핑표.md` 참고
- 아이콘 색상 전수 재검증(2026-07-28) — 담당자 지적으로 각 아이콘 인스턴스 node ID별
  `get_variable_defs`를 다시 개별 호출해 재검증. `get_design_context`의 "Property
  1=black" 같은 컴포넌트 설명 텍스트는 인스턴스별 실제 색과 무관한 공용 설명이라는 것을
  발견(재발방지 규칙 추가, `docs/신규_컴포넌트_설계_프로세스.md` 참고) — 이 착오로
  RadioChoiceDialog 경고아이콘(Gray-130→실제 Gray-60), FilterTag 닫기아이콘(Primary-60→
  실제 Gray-130) 2건 수정. Toast RED/ConfirmDialog/Filter 트리거 아이콘은 재검증 결과
  기존 값 그대로 정확함을 확인. Progress Bar도 라벨 44px 고정폭 우측정렬 구조가 빠져있던
  것을 재실측해 복원(자릿수 바뀔 때 전체폭이 흔들리던 문제 수정)
- Table 완성(`table.tsx`) — 원본 정의 node 9873:83780("Table")과 실제 수정 화면
  node 16938:42501("생산계획(일) 리스트", 담당자가 "테이블 디자인 수정"으로 지목) 대조
  실측. 수정본에서 확인된 변경점: 헤더 배경 Gray-10 추가, 셀 우측 점선 세로 구분선,
  선택행(Primary-20 배경)·신규행(좌측 빨간 점) 둘 다 구분선이 기본 Gray-40보다 진한
  Gray-30으로 바뀜(3개 행 대조로 발견, 담당자가 언급 안 한 부분). 그룹행 핑크 배경
  `#fde9ea`(팔레트 밖 원본값 유지), 그룹 집계값/총계행 SemiBold 우측정렬. 빨간 점 색은
  변수 바인딩 없어(`get_variable_defs` 빈 응답) Danger-60으로 판단. 체크박스는 기존
  `Checkbox` 재사용(미선택 상태 시각 약간 불일치, 체크리스트 등록). 미확인: 원본의
  기본-disable/분할/분할-disable 변형(다음 라운드). 구현 중 `DataRow`/`GroupHeaderRow`/
  `TotalsRow`를 처음엔 `Table` 내부 클로저로 선언했다가 eslint
  `react-hooks/static-components`("Cannot create components during render")에 걸려
  모듈 스코프로 전부 끌어올리고 필요 값을 prop으로 명시 전달하도록 리팩터링
- Table 2차 피드백 반영(2026-07-28, 같은 날) — 담당자가 Figma가 아닌 실제 운영 화면
  (생산실적 그룹화 조회) 스크린샷을 보여주며 지적한 5건: (1) 2·3차 그룹화 지원 —
  `TableGroup`에 재귀 `groups` 필드 추가, 깊이 제한 없이 중첩 가능, depth별 배경색은
  `groupLevelColors` prop(기본값은 스크린샷 육안 대조 판단값, 실측 아님), (2)(4) 그룹
  합계열/총계행이 헤더 컬럼과 어긋나던 버그 수정 — 원인은 펼침 화살표+라벨을 폭 고정 안
  된 별도 요소로 앞에 끼워서 뒤 컬럼들이 라벨 길이만큼 밀렸던 것; 라벨을 "첫 번째 컬럼의
  Cell 안"에 넣고 `overflow-visible`로 시각적으로만 넘치게 처리해서 모든 행 종류가 항상
  같은 컬럼 폭 배열을 쓰도록 구조적으로 고침, (3) 그룹 헤더 행에 체크박스 추가 +
  `Checkbox` 컴포넌트에 `indeterminate`(중간선택) prop 신규 추가(Figma에 없는 상태라
  판단 구현), 최상단 전체선택 체크박스도 동일 적용, (5) 헤더 텍스트 정렬을 데이터 셀과
  항상 일치하도록 수정 — 기존엔 헤더만 정렬 미지정 시 가운데로 강제하던 게 버그 원인.
  이 정렬 버그 패턴은 재발 방지 규칙 6번으로 `docs/신규_컴포넌트_설계_프로세스.md`에
  등록. 데모 페이지도 지시일→설비 2단 중첩 그룹으로 재구성하고 컬럼 align 값을 실제
  화면 기준으로 재조정
- Table 3차 피드백 반영(2026-07-28, 같은 날 재검토) — 담당자가 2차 결과물을 실제로
  조작해보고 지적한 4건: (1) 그룹 펼침 버튼이 체크박스와 거의 같은 스타일(흰 배경+회색
  테두리 사각형)이라 나란히 붙어 있으면 체크박스가 겹쳐 보인다는 지적 → 펼침 버튼에서
  테두리·배경 박스를 없애고 화살표 아이콘만 남김, (2) "3단계 그룹화가 안 된다" → 실제로는
  1차 개편 때 이미 `TableGroup.groups` 재귀 구조로 깊이 제한 없이 지원하고 있었고 데모만
  2단까지였던 것 — 데모를 지시일→설비→담당기사 3단으로 확장해서 확인시킴(컴포넌트 코드
  변경 없음), (3) "접힘/펼침 회전이 90도가 아니라 180도여야 한다" → 펼침=위쪽
  (rotate-90)/접힘=아래쪽(-rotate-90)으로 바꿔서 정확히 180도(위⇄아래) 차이가 나도록 수정
  (기존엔 왼쪽↔위쪽 90도), (4) "그룹화 단계별로 헤더에서 한꺼번에 접는 버튼 필요, 3단계면
  3개" → 헤더 행 맨 앞(체크박스 왼쪽)에 그룹 트리 최대 깊이만큼 마스터 토글 버튼 추가,
  버튼 하나당 해당 depth의 모든 그룹을 재귀로 모아 일괄 접기/펼치기(하나라도 펼쳐져 있으면
  전부 접고 아니면 전부 펼침)
- Table 4차(같은 날, 코드 변경 없이 문서화만) — 담당자가 3차 결과와 원본 화면을 대조해서
  체크박스 위치/순서 규칙 위반·헤더-바디 정렬 재붕괴·요청 범위 밖 디자인 변경(3차 (1)의
  박스 제거)을 지적. 토큰 절약을 위해 이땐 수정 없이 `docs/Table_수정_대기목록.md`
  신설 + 이 파일에 회고 섹션만 추가.
- Table 4차 후속(같은 날, 바로 이어서) — 담당자가 그 펼침 버튼 디자인의 정확한 값(22x22px,
  배경 Gray-0, radius 3px, 테두리 Gray-50 inside 1px)을 직접 줘서, 3차에서 임의로 지웠던
  테두리·배경 박스를 그 값대로 원상 복구(그룹행 펼침 버튼 + 헤더 마스터 토글 버튼 둘 다).
- Table 5차(같은 날, "수정 고고" 지시로 대기목록 전체 반영) — (1)(2) 체크박스를 항상
  최좌측 고정하고 마스터 토글 버튼을 그 오른쪽으로 옮김 + "체크박스+마스터 토글 영역"을
  `masterToggleAreaWidth`(24px×depth 수)로 계산해 헤더/그룹행/데이터행/총계행 전부
  동일하게 예약하도록 통일해서 헤더-바디 정렬 버그를 구조적으로 재수정, (3) 그룹 라벨
  텍스트 잘림은 코드상 원인 없음을 확인해 뷰포트 문제로 결론, (4) 데모 Table 섹션의
  `max-w-[1100px]` 제약 해제, (5) `TableColumn.width`를 `number | { min, grow? }`
  유니온으로 확장해 가변폭 컬럼 지원 기능만 추가(실제 데모 컬럼 전환은 담당자 판단이
  필요해 보류). `docs/Table_수정_대기목록.md` 전체 항목을 해결 처리함.
- Table 6차(같은 날, 5차 재검토 후 3건) — 헤더 마스터 토글 버튼과 그룹행 depth별 펼침
  버튼을 "폭 24px 슬롯을 depth 수만큼 나란히 두고 자기 depth 슬롯에만 버튼을 넣는"
  동일 구조로 통일해서 세로 정렬 일치, 신규행 빨간 점을 체크박스 왼쪽에서 체크박스
  래퍼의 기존 pr-12 여백 안(오른쪽)으로 이동, 그룹/총계 라벨 셀을 컬럼 align과 무관하게
  항상 좌측 고정 + 데모 컬럼 `equipment` 정렬을 다른 짧은-값 컬럼들과 맞춰 가운데로
  통일. `docs/Table_수정_대기목록.md` 7·8·9번 참고.
- Table 7차(같은 날, 6차 재검토 후 3건) — 신규행 빨간 점을 "체크박스 우측 정확히
  10px"로 상수화(`CHECKBOX_COLUMN_WIDTH`/`NEW_DOT_GAP_FROM_CHECKBOX`)하면서
  `TotalsRow`의 체크박스 칼럼이 border-box 특성 때문에 다른 행보다 12px 좁게 렌더링되던
  선행 버그를 같이 발견해 수정, 헤더 라벨 셀은 컬럼 align과 무관하게 항상 가운데정렬로
  고정(데이터 셀은 컬럼별 align 유지), 숫자 컬럼(데이터 행 + 그룹 집계 + 총계)에
  `toLocaleString("ko-KR")` 기반 1000단위 콤마 적용. `docs/Table_수정_대기목록.md`
  10·11·12번 참고.
- Table 7차 후속(같은 날, 데모 구성 3건) — `productionColumns`에서 창고명/품목구분
  컬럼 제거(폭 축소), `manager` 값을 전부 담당자 본인 이름 "이해빈"으로 교체, 기존
  15컬럼 합본 Table 데모는 유지하면서 그 아래에 3컬럼짜리 단순 데이터로 헤더만/
  그룹화만/컬럼 2개 이상(그룹 없음)/총계행만 4개의 분리 미니 데모 추가. 컴포넌트
  코드(`table.tsx`)는 변경 없이 데모 페이지(`page.tsx`) 구성만 조정. `docs/Table_
  수정_대기목록.md` 13·14·15번 참고.
- Table 8차(같은 날, "시선강탈" 지적) — 15컬럼짜리 합본 Table 데모가 페이지에서 가장
  눈에 띄어 부담스럽다는 지적으로, 담당자 확인 후 합본 데모 1개만 기본 접힘 상태의
  토글(`ChevronRight` 회전 + 조건부 렌더)로 변경. 미니 데모 4개는 그대로 유지.
  `docs/Table_수정_대기목록.md` 16번 참고.
- Table 8차 후속(같은 날, 데모 UI 2건) — 합본 데모 아래 있던 라운드별 수정 이력 설명
  문단을 "주절주절하다"는 지적으로 전부 삭제(문서에 이미 기록돼 있어 데모 화면엔
  불필요), 접기/펼치기 헤더 줄 폭이 다른 섹션들과 안 맞던 것을 섹션 자체는
  `max-w-[960px]`로 맞추고 `<Table>`만 내부 `overflow-x-auto`로 감싸서 해결.
  `docs/Table_수정_대기목록.md` 17·18번 참고.
- 나머지 몰큘/오가니즘(Center Modal/Page Top Tab Item/Sidebar)은 아직 코드 없음
- (2026-07-31, 14차) 담당자가 당근 Seed Design System(seed-design.io) Foundations
  전체 15개 페이지를 읽고 구조를 파악해달라고 요청 → 공통 골격(제목+요약→개요→섹션별
  설명+다이어그램→토큰 레퍼런스 표→관련 문서/이전·다음 문서 네비→우측 On this page
  목차)과, 가장 중요한 인사이트인 "스케일(raw) vs 시맨틱(용도) 토큰 2계층 구조"를 정리해
  보고. 담당자가 "그러면 그렇게 다 바꿔봐"라고 지시해 실제로 우리 시스템에 시맨틱 토큰
  레이어를 도입함:
  1. `docs/디자인_토큰_사용_규칙.md`의 기존 "역할별 표"(1~5절, 색상/간격/radius/그림자)를
     근거로 시맨틱 토큰 스키마 설계 — 텍스트 7종(`text-default/secondary/placeholder/
     disabled/inverse/brand/danger`), 배경·테두리 15종(`border-default/strong/
     warning-subtle`, `bg-subtle/subtler/disabled/brand/brand-hover/brand-subtle/
     brand-subtle-strong/danger/warning-subtle/info/strong`, `icon-warning`),
     radius 6종(`radius-control-xs/sm/control/panel/modal-sm/modal-lg`), spacing
     5종(`spacing-tight/default/card/dialog-x/dialog-header-end`), 그림자 4종
     (`shadow-panel/modal-sm/modal-lg`, `drop-shadow-toast`).
  2. `globals.css`에 `:root`(정의, 전부 스케일 토큰 `var()` 간접 참조) +
     `@theme inline`(Tailwind 유틸리티 노출) 두 레이어로 추가 — 예:
     `text-mes-text-default`, `bg-mes-bg-brand`, `rounded-mes-panel`,
     `p-mes-dialog-x`, `shadow-mes-modal-sm`, `drop-shadow-mes-toast`.
  3. 18개 컴포넌트 전부(Button/Input/Select/Combobox/Badge/Tag/FilterTag/Filter/
     Checkbox/Radio/ConfirmDialog/RadioChoiceDialog/NoticeBanner/NotificationPanel/
     Toast/Table/Sidebar/PageTopTabItem/AlarmListItem)를 raw 스케일 클래스(예:
     `bg-mes-primary-60`, `rounded-[4px]`, `shadow-[0_2px_8px_rgba(...)]`)에서
     해당하는 시맨틱 토큰 클래스로 전환. 문서상 "예외값"(`#696f83`, `#e8f0fe`,
     `#156be9` 등 팔레트에 억지로 편입 안 하기로 확정된 값)과, 컴포넌트마다 disabled
     배경/테두리 범위가 30~40으로 갈리는 것처럼 시맨틱 토큰과 값이 정확히 일치하지
     않는 애매한 지점은 의도적으로 raw 값 그대로 남김(성급한 승격 방지).
  4. 데모 페이지(`page.tsx`) Foundation 섹션 맨 아래에 "시맨틱 토큰" 서브섹션 신설 —
     카테고리별(텍스트/배경·테두리/Radius·Spacing/그림자)로 `토큰명 → 가리키는 스케일
     값 · 역할` 표 렌더링, TOC_LINKS에도 추가.
  5. `docs/디자인_토큰_사용_규칙.md` 서두에 2계층 구조 설명 추가.
  eslint+tsc 클린 확인 후 커밋 예정.
- (2026-07-31, 15~17차, 같은 흐름) Seed 구조 조사 결과를 실제 레이아웃에 반영. 커밋
  단위로는 3개(상단바+사이드바 도입 → 상단 탭 추가 → 사이드바 상하위 메뉴 그룹화)로
  나눴지만 한 요청 흐름이라 묶어서 기록:
  1. 상단 얇은 헤더 바 + 좌측 고정 사이드바(Foundations/Components 그룹, `TOC_LINKS`
     재사용) + 본문 3단 레이아웃 신설, 기존 상단 pill 네비게이션 제거. Seed는 다크
     테마지만 톤은 안 가져오고 구조만 차용 — 담당자가 "화이트 톤이 더 맘에 든다"고
     확정. `IntersectionObserver`로 스크롤 위치에 따라 사이드바 활성 항목 강조.
  2. 헤더에 Foundations/Components 탭 추가(사이드바 각 그룹 첫 섹션으로 스크롤,
     스크롤 위치와 연동해 활성 표시) + 3층 로드맵(합성 패턴 카탈로그)에 대응하는
     "Patterns" 탭을 비활성("예정")으로 미리 배치. "스캐폴딩 확인용" 문구 제거.
  3. 담당자가 "Button 사이즈/컬러/아이콘처럼 하위 항목끼리는 [Button] 상위 메뉴로
     묶여야 한다"고 지적 — 사이드바를 leaf/branch 2종 노드 트리로 재구성, Button(3개)·
     Table(2개)을 상위 메뉴로 묶고 나머지는 그대로 단일 항목 유지. 스크롤 스파이가
     보는 실제 앵커 목록(`TOC_LINKS`)은 그대로 두고 트리는 표시용 레이어로만 분리.
  각 단계 tsc 클린 확인 후 커밋.
- (2026-07-31, 18차) Table 데모 버그 3건 리포트 반영:
  1. "그룹화 3개까지 된 것도 해줘야지" — 분리 데모(table-parts) 쪽엔 1단 그룹화
     예시(`miniGroups`)만 있었던 것을 발견, 합본 데모의 지시일→설비→담당기사와
     동일한 3단 재귀 그룹화 예시(`miniGroups3`)를 추가.
  2. "체크박스가 기동하지 않아" — 원인: 분리 데모의 미니 Table 4개가 전부
     `selectedIds`/`onSelectedIdsChange`를 안 넘기고 있었음. Table 내부
     toggleOne/toggleAll/toggleGroup은 `if (!onSelectedIdsChange) return;`로
     시작해서 콜백이 없으면 클릭해도 반응이 없는 게 애초에 의도된 동작이었던 것 —
     데모마다 독립 state를 만들어 연결.
  3. "테이블 합본이 하단에 있도록" — table-parts(분리 데모)를 위로, table-full(합본
     데모)을 페이지 맨 아래로 순서 이동. `TOC_LINKS`/사이드바 Table 하위 메뉴 순서도
     분리→합본으로 맞춤. 내용 변경 없음, 순서만 이동.
  tsc 클린 확인 후 커밋.
- (2026-07-31, 19차) "다음에 뭐 해야 됨"이라는 질문에 체크리스트/AGENTS.md/컴포넌트
  주석을 근거로 현황 보고(3층은 담당자가 Center Modal/Side Slide Panel 자료를 줘야
  풀리는 상태, 2층은 티어2 47개 없음/부분 남음, 그 외 "확인 필요" 11개) → 담당자가
  "티어2부터 하자"로 방향 확정. 1차 배치로 아톰 6종(Icon Button/Close Button(X)/
  Divider·Separator/Tooltip/Loading Spinner/Skeleton) 신규 코드화 — 전부 Figma
  디자인이 없는("없음") 항목이라, 이미 여러 컴포넌트가 각자 인라인으로 반복해서
  만들어 쓰던 패턴(닫기 버튼, 구분선 등)을 역으로 관찰해 공용 컴포넌트로 뽑아내거나
  기존 스케일/시맨틱 토큰 체계를 그대로 재사용하는 "판단값" 방식으로 구현(각 파일
  주석에 Figma 근거 없음을 명시). `icon-button.tsx`(IconButton + CloseButton 프리셋
  같이 export), `divider.tsx`, `tooltip.tsx`(Radix 의존성 추가 없이 CSS
  group-hover 기반 경량 구현), `loading-spinner.tsx`, `skeleton.tsx`. 데모 페이지에
  Button 섹션 바로 아래 5개 Section 추가, `UI_컴포넌트_총망라_체크리스트.md`의
  해당 6개 행(Close Button은 13번 섹션에 별도 행) 상태를 있음으로 갱신. tsc 클린
  확인 후 커밋.
- (2026-07-31, 20차) 담당자 피드백 2건 반영:
  1. "제목에 (신규, 판단값 — CSS 경량 구현) 이런 거 욱여넣는 게 말이 되냐, 칩으로
     빼라" — 19차에서 추가한 5개 Tier2 Section의 `title`에 부가 설명을 붙여 쓰던
     방식을 지적받음. `page.tsx`의 `Section` 헬퍼에 `badge?: string` prop을 추가해
     제목은 컴포넌트명만 깔끔하게 두고, 부가 설명(예: "판단값")은 제목 옆 작은 회색
     pill로 분리. 5개 호출부(Icon/Close Button, Divider, Tooltip, Loading Spinner,
     Skeleton) 전부 갱신.
  2. "사이드탭(Sidebar) 원본 이거야, 마음대로 아이콘 바꾸고 스크롤 만들지 마" +
     Figma 링크(node 9873:83335, fileKey F4n5Zr04PAbiRjfIFQAo6v) 제공, 별도로
     "mes/fems 탭은 빼"라고 명시 지시. `get_design_context`로 실제 SNB-active
     심볼(node 9873:83338)을 재조회해 3가지 반영:
     - 메인 네비 컨테이너가 원본은 `overflow-clip`(스크롤 없음)인데 기존 코드가
       `overflow-y-auto`였던 걸 원본대로 `overflow-clip`으로 교체.
     - MES/FEMS 토글은 원본에 실제로 존재함을 재확인했지만, 담당자 지시가 원본
       실측값보다 우선하는 케이스로 판단해 `mode`/`onModeChange` prop과 토글 JSX를
       통째로 제거(주석에 "정정이 아니라 의도적 제거"임을 명시).
     - 6개 1-depth 아이콘(자재/생산/품질/설비/통계/MES설정)을 원본 JSX와 하나씩
       대조 — 5개(자재관리~통계분석)는 이미 기존 구현이 원본과 정확히 일치함을
       확인(임의 교체 아니었음). "MES 설정"만 원본이 커스텀 `mes/icon-setting`
       벡터인데, `download_assets`로 SVG export URL은 받았으나 샌드박스 네트워크
       정책상 실제 다운로드는 실패(curl 403 차단, web_fetch 타임아웃)해서 기존
       lucide `Settings` 임시 아이콘을 유지 — 판단값 placeholder로 이미 주석에
       명시돼 있던 항목이라 "방치된 임의 교체"는 아님을 재확인.
     `sidebar.tsx` 상단 주석에 "4. 2026-07-31 담당자 원본 재대조" 섹션으로 근거
     기록. tsc 클린 확인 후 커밋.
- (2026-07-31, 21차) 20차 결과물 스크린샷을 보고 담당자가 재차 4가지 지적:
  1. "사이드바가 잘리잖아" — 내부 스크롤을 없앤 뒤 데모 박스가 여전히 `h-[600px]
     overflow-hidden`이라 실제 콘텐츠 높이(로고+즐겨찾기/대시보드+1-depth 6개+MES
     설정 하위 7개+하단바 ≈ 800px)를 못 담고 잘렸음 — `h-[820px]`로 확대.
  2. "제목에 여전히 불필요한 텍스트가 있다" — Sidebar 섹션 h2가 Section 헬퍼를 안 쓰는
     구식 수기 섹션이라 19차/20차 배지 분리가 적용 안 돼 있었음. h2를 "Sidebar / SNB"
     로만 남기고 node 인용·실측 설명은 바로 아래 `<p>` 설명 문단으로 이동.
  3. "접힌 것도 없고, 하위메뉴들 좌측에 있는 선도 없다" — 두 가지 원본 대조 누락을
     발견:
     - 원본은 1-depth 6개 항목 전부에 펼침 화살표가 구조적으로 붙어 있는데, 코드는
       실제 `children` 데이터가 있는 "MES 설정"에만 화살표를 그리고 있었음 — 화살표
       렌더링을 `hasChildren` 조건에서 분리해 항상 표시.
     - 원본 2-depth 목록엔 세로 트렁크 선("Line")과 각 항목을 트렁크에 잇는 L자
       코너("Radius")가 있는데 코드에 전혀 없었음 — 항목 개수에 따라 늘어나는
       세로선(`top-[17px] bottom-[17px]`, 첫/마지막 항목 중심에 맞춤)과 항목별
       L자 코너(`absolute -left-[13px]`, `border-b-2 border-l-2`)를 추가.
  4. "선택된 게 스샷 보면 두 개 있다" — 데모가 `activeKey="stats"`(통계분석, 파랑)와
     `activeSubKey` 기본값 "user-setting"(사용자 설정, 파랑)을 동시에 켜놔서 파란
     하이라이트가 2군데였음. 원본 실측엔 "사용자 설정" 1개만 선택 표시였으므로
     `activeKey="stats"`를 제거.
  `sidebar.tsx` 주석에 "5. 2026-07-31 담당자 2차 피드백" 섹션으로 근거 기록. tsc
  클린 확인 후 커밋.
- (2026-07-31, 22차) 21차 직후 "접고 펴는게 안되는데?" 재지적 — 화살표는 6개 항목
  전부에 보이게 됐지만, 클릭 토글 로직(`onExpandedKeyChange` 호출)은 여전히
  `hasChildren`(="MES 설정"만 true) 조건으로 막혀 있어서 나머지 5개는 화살표만
  있고 눌러도 반응 없는 상태였음 — 화살표 노출과 토글 가능 여부가 서로 다른
  조건으로 갈라져 있었던 게 원인. `onClick`에서 `hasChildren` 게이팅을 완전히
  제거해 6개 항목 전부 클릭 시 배경/화살표 방향이 토글되도록 수정(실측 안 된
  하위 목록은 펼쳐도 내용 없이 빈 채로 유지 — `item.children`이 있을 때만 목록
  렌더). tsc 클린 확인 후 커밋.
- (2026-07-31, 23차) "사이드바 자체를 접고 펴는 거, 우상단 화살표" — 22차까지
  손댄 건 1-depth 항목 펼침이었는데, 담당자가 말한 건 사이드바 전체를 62px
  아이콘 레일로 접는 별개 기능이었음(3.에서 "범위 밖"으로 미뤄뒀던 부분).
  링크를 다시 확인해 `get_design_context`로 `SNB-hide` 심볼(node 9873:83651,
  fileKey F4n5Zr04PAbiRjfIFQAo6v)을 실측 후 `collapsed` prop을 신규 추가:
  - 폭 260px↔62px 토글, 접기 버튼 아이콘 180도 회전.
  - 로고/즐겨찾기/대시보드/1-depth 항목 전부 라벨 숨기고 아이콘만 중앙 정렬.
  - MES/FEMS 토글은 원본이 "M"/"F" 한 글자로 축약해서 계속 보여주지만, 이미
    4.에서 담당자 지시로 이 토글 자체를 제거해뒀으므로 접힌 상태에서도 일관되게
    렌더링 안 함.
  - 1-depth 항목 중 `children`이 있는 항목은 hover 시 우측에 2-depth 목록
    플라이아웃(원본 node 9873:83620 "hover" 배리언트)을 띄우도록 구현 —
    Tooltip 컴포넌트와 동일한 group/group-hover CSS 패턴 재사용, 신규 의존성
    추가 없음.
  - 하단 메뉴얼/로그아웃을 좌우 2칸 대신 상하로 쌓는 원본 레이아웃 반영.
  데모 페이지에 `sidebarCollapsed` state 추가해 우상단 버튼으로 실제 토글되도록
  연결, 데모 컨테이너 폭도 260px↔62px 연동. 체크리스트 Sidebar 행을 "부분"→
  "있음"으로 갱신(마지막 남았던 접기 상태까지 구현 완료). tsc 클린 확인 후 커밋.
- (2026-07-31, 24차) "moncat factory 텍스트도 빼고 공란으로" — Sidebar 데모
  `logo` prop에 넣어뒀던 placeholder 텍스트 제거, prop 자체를 안 넘겨서 공란으로.
- (2026-07-31, 25차) RadioChoiceDialog 섹션 제목("RadioChoiceDialog (라디오 2택
  + 경고배너 팝업 — node 18840:61182 실측, 원래 문구는 "투입품목 추가")")을
  예로 들며 "이거 걍 다 빼라 싹" — Sidebar 하나만 고치고 끝난 게 아니라 페이지
  전체 섹션 제목에 남아있던 동일 패턴(node 인용/실측 날짜/변경이력/부연설명)을
  전수 조사해서 제거. 대상: button-color("(7종)"), select("(Selectbox)"),
  badge("(7종 — 2026-07-29 실제 색 기준 개명...)"), checkbox("(Figma에 disabled
  상태 자체가 없음 — 판단값으로 구현)"), Filter("(트리거 + 플라이아웃 + 활성
  태그, 통합 컴포넌트)"), tag("(범용 3색 — 실사용 빈도 낮음...)"),
  combobox("(검색 내장 셀렉트)"), toast("(RED/BLUE — ...실측값이 다름)"),
  confirm-dialog("(작은 확인/안내 팝업 — 2026-07-29 톤 3종/2버튼로 확장)"),
  NoticeBanner("(안내 배너, 링크 포함 — 2026-07-29 신규...)"),
  radio-choice-dialog(위 예시), PageTopTabItem("(...node 157:18051 실측...)"),
  AlarmListItem("(...node 163:3039 실측...)"), NotificationPanel("(...node
  157:15771 / 157:15833 실측...)"), 아이콘 라이브러리("(담당자가 Figma에서 직접
  SVG export...)"), Table 합본 데모 토글 버튼("(원본 node 9873:83780 + 수정본
  node 16938:42501 대조 실측)") — 총 16곳. 전부 컴포넌트명만 남기고, checkbox의
  "판단값" 같은 개별 샘플 캐릭터는 이미 `Sample label`에 있던 걸 그대로 두고
  제목에서만 뺌. `grep`으로 "node"/"실측" 패턴이 제목에 남아있는지 전수 재확인
  후 tsc 클린 확인, 커밋.
- (2026-07-31, 26차) "판단값 칩을 임시로 바꾸고 파란색으로" — `Section` 헬퍼의
  `badge` prop 렌더링을 회색(`bg-mes-bg-subtle`/`text-mes-gray-70`)에서
  파랑(`bg-mes-bg-brand-subtle-strong`/`text-mes-text-brand`, `badge.tsx`의
  blueLight 변형과 동일 톤)으로 변경, 5개 호출부(icon-button/divider/tooltip/
  loading-spinner/skeleton)의 `badge="판단값"`을 전부 `badge="임시"`로 교체.
  Sample label 안의 "판단값" 텍스트(Radio/Checkbox disabled 등)는 칩이 아니라
  일반 라벨 문구라 이번 대상에서 제외. tsc 클린 확인 후 커밋.
- (2026-07-31, 27차) "또 딴거 만들어" — 티어2 없음 목록에서 다음 배치로 판단해서
  진행: Switch/Toggle, Textarea, Label, Link, Backdrop/Dim Overlay 5개. 전부
  Figma 디자인 없는 "없음" 항목이라 19차와 같은 방식(기존 컴포넌트의 검증된
  패턴/토큰 재사용)으로 구현:
  - `switch.tsx`: Checkbox와 동일한 `peer` 오버레이 패턴(네이티브 input 숨기고
    시각 레이어만 커스텀) 재사용, on=`bg-mes-bg-brand`(Checkbox main과 동일),
    44x24px 트랙 크기는 판단값.
  - `textarea.tsx`: `input.tsx` 주석에 이미 "Selectbox와 완전히 같은 톤 공유"
    라고 확인돼 있던 원칙을 그대로 따라 Input의 테두리/배경/포커스/radius를
    재사용, min-h/py만 여러 줄에 맞게 판단값 조정.
  - `label.tsx`: Input/Select와 같은 텍스트 색 체계, required(*) 표시는
    `text-mes-text-danger`(기존 danger 토큰 재사용, 새 값 아님).
  - `link.tsx`: `notice-banner.tsx`가 이미 쓰고 있던 링크 스타일
    (`text-mes-text-brand underline-offset-2 hover:underline`)을 그대로
    역추출 — 체크리스트에 "테이블 셀 링크는 있었는데 일반 텍스트 링크가
    누락"이라고 적혀 있던 항목.
  - `backdrop.tsx`: ConfirmDialog/RadioChoiceDialog가 각자 반복해서 쓰던
    Radix Overlay 값(`fixed inset-0 z-50 bg-black/40`)을 역추출 — 두
    다이얼로그는 Radix Overlay 슬롯에 종속돼 있어 직접 교체는 안 하고, 향후
    Radix 없이 만들 커스텀 오버레이용으로 공용 아톰만 분리.
  데모 페이지에 Skeleton 섹션 바로 아래 5개 Section 추가(Switch/Textarea/
  Label/Link/Backdrop), `TOC_LINKS`/`COMPONENT_NODES`에 순서대로 삽입.
  체크리스트 5개 행 상태를 있음으로 갱신. tsc 클린 확인 후 커밋.
- (2026-07-31, 28차) 27차 배치 피드백 3건:
  1. "링크에 밑줄 넣어줘" — `link.tsx`가 NoticeBanner 값 그대로(`hover:underline`)
     여서 평소엔 밑줄이 안 보였음. Link는 독립 아톰이니 항상 밑줄이 맞다고
     판단해 `underline`으로 상시 표시로 변경.
  2. "스위치 디스에이블이 진짜 비활성인지 잘 안 보여. 색상이 비슷해서" —
     원인 확인: disabled 트랙 색(`bg-mes-bg-disabled`=Gray-30/#e4e7ee)이
     기본 off 트랙 색(Gray-40/#d7dce5)이랑 헥스가 거의 붙어 있어서 육안 구분이
     안 됐음. 색상 스왑 방식을 버리고 트랙/썸 둘 다 `peer-disabled:opacity-40`
     로 전체를 흐리게 하는 방식으로 교체 — on/off 색은 그대로 유지한 채
     흐려지므로 원래 상태 + 비활성 여부가 동시에 명확해짐.
  3. "백드롭은 왜 넣었냐 빼라" — `backdrop.tsx`를 진짜 삭제하려 했으나 이
     샌드박스는 파일 삭제(`rm`/cross-device `mv`) 자체가 막혀 있어서(기존
     git lock 파일과 같은 FUSE 마운트 제약), 같은 디렉터리 내 rename은 되는 걸
     확인하고 `backdrop.tsx.removed-per-user-feedback.<timestamp>`로 이름을
     바꿔 빌드 대상에서 제외(이 저장소에 이미 있던
     `filter-flyout.tsx.removed-merged-into-filter.*` 파일과 동일한 기존
     컨벤션을 따름). 데모 Section, import, `TOC_LINKS`/`COMPONENT_NODES` 항목도
     전부 제거, 체크리스트 Backdrop 행을 "있음"→"없음"으로 롤백. tsc 클린
     확인 후 커밋.
- (2026-07-31, 29차) "깃허브를 private으로 바꿔도 작업 가능하냐" — 이 세션은
  GitHub에 push/pull한 적이 없고(로컬 git commit만 15개 이상 쌓여있고
  `origin/main`엔 전혀 반영 안 됨) 마운트된 로컬 폴더만 다뤄서 public/private
  여부와 무관하다고 답변. 이어서 "GitHub Pages로 퍼블리싱했더니 md파일만
  나온다"는 질문 — 원인은 `next.config.ts`에 정적 export 설정이 아예 없어서
  GitHub Pages가 빌드 결과물을 못 찾고 저장소 루트 README.md를 Jekyll로
  렌더링해서 보여주고 있었던 것. 해결:
  - `component-library/next.config.ts`에 `output: "export"` 추가.
    GitHub Pages 프로젝트 사이트는 `<user>.github.io/<repo>/` 서브패스에서
    서빙되므로 `basePath`/`assetPrefix`를 저장소 이름("MES-Design")으로 설정
    — 단, 로컬 dev/build는 서브패스가 없어야 하니 `GITHUB_PAGES` 환경변수가
    있을 때만 적용(GitHub Actions에서만 세팅). `images.unoptimized: true`도
    추가(이 프로젝트는 `next/image` 미사용이라 실질 영향 없지만 향후 대비).
  - `.github/workflows/deploy-pages.yml` 신규 작성 — `main` push 시
    `component-library`에서 `npm ci && npm run build`(정적 export) 후
    `actions/upload-pages-artifact` + `actions/deploy-pages`로 자동 배포.
    담당자가 GitHub 저장소 Settings → Pages → Source를 "GitHub Actions"로
    바꿔줘야 최초 1회 활성화됨(이건 코드로 못 하는 부분이라 README에 안내
    추가).
  - 로컬 빌드 검증 중 마운트된 폴더(`node_modules` 포함)에서 `next build`가
    `Bus error (core dumped)`로 죽는 걸 발견 — 이 세션의 FUSE 마운트가
    Next.js/SWC 네이티브 바이너리의 mmap과 안 맞는 것으로 추정(기존 git
    lock 파일 이슈와 같은 계열의 마운트 제약). `/tmp`에 소스만 복사하고
    `npm install`로 로컬 filesystem에 새로 `node_modules`를 깐 뒤 빌드하니
    정상 완료, `out/index.html`에 `/MES-Design/...` 경로가 제대로 박히는 것도
    확인. 이 크래시는 이 세션 샌드박스 특유의 문제이고 GitHub Actions
    러너에서는 재현 안 될 것으로 판단(별도 조치 불필요).
  `component-library/README.md`에 GitHub Pages 배포 안내 섹션 추가. tsc
  클린 확인 후 커밋.
- (2026-07-31, 30차) "티어1 두 개 다 해볼래??" — 남은 티어1(부분) 2개
  전부 진행:
  1. **Bulk Selection + Action Toolbar Grid**(+ 티어2 "Bulk Action
     Toolbar"도 동시 해결) — Table의 다중 선택 자체(`selectedIds`)는
     이미 있었지만 선택 시 뜨는 액션 바가 없었던 것. `bulk-action-toolbar.tsx`
     신규 구현(Figma 없어서 기존 Gray-130 배경 톤 + Divider/CloseButton
     재사용 판단값), table-parts 데모의 "그룹화만" Table에 실제로 연동해
     선택하면 위에 뜨도록 함. 체크리스트 두 행(262번/338번) 모두 "있음"으로
     갱신.
  2. **Nested Modal (2-depth)** — 담당자가 "네스티드 모달이 먼데"라고 물어서
     "팝업 위에 또 다른 팝업이 겹쳐 뜨는 구조"라고 설명. 착수 전 체크리스트
     원본 근거를 다시 보니 이 항목은 Figma "Side Modal 검사/커스텀 정보
     등록"에서 겹친 형태로 **추정만** 한 상태였고, 그 원본이 속한 Center
     Modal 자체가 2026-07-30에 담당자 지시로 "자료 나중에 줄 때까지 코드에서
     빼라"고 보류된 상태(`docs/보류_컴포넌트/center-modal.tsx.bak`)라는 걸
     재확인 — Center Modal을 건드리지 않고 진행할 방법을 찾음: 이미 완성된
     `ConfirmDialog`를 두 개(바깥 "삭제 확인" → 안쪽 "최종 확인") 겹쳐 여는
     방식으로 "팝업 위에 팝업" 패턴 자체를 데모/코드화(`page.tsx` `nested-modal`
     섹션, Radix Dialog가 각자 Portal로 열려서 나중에 연 게 자연히 위에
     쌓임). 체크리스트는 "있음"이 아니라 "부분" 유지 — 패턴 자체는 됐지만
     원래 추정 근거였던 실제 Center Modal 겹침 구조는 여전히 미확인이라는
     걸 비고에 명시.
  tsc 클린 확인 후 커밋.
- (2026-07-31, 31차) 담당자 피드백 2건:
  1. "섹션별로 간격을 좀 줘봐, 지금 너무 다닥다닥 붙어있는듯" — `<main>`의
     `gap-10`(40px)이 각 섹션 자체 `pb-8`(32px)과 합쳐져도 좁아 보인다는
     지적. `gap-20`(80px)으로 확대(섹션 자체 padding은 안 건드림 — 늘어난
     간격은 섹션 사이에만 생기게 유지).
  2. "벌크액션툴바같은건 있으면 좋을거같긴 한데 일단 빼야될듯? 우리가
     지금 안쓰고있는거고 사실 그게 없는 상황이라가지고" — 30차에서 만든
     `bulk-action-toolbar.tsx`를 롤백. Table의 다중 선택 기능 자체(`selectedIds`)는
     그대로 남겨두고(이건 실제로 쓰이고 있음), 그 위에 얹었던 액션 바만
     제거. Backdrop 때와 동일하게 샌드박스가 파일 삭제를 막아서
     `bulk-action-toolbar.tsx.removed-per-user-feedback.<timestamp>`로
     rename. 데모 Section(`bulk-action-toolbar`)과 table-parts "그룹화만"
     Table에 연동해뒀던 부분, import, `TOC_LINKS`/`COMPONENT_NODES` 항목
     전부 제거. 체크리스트 두 행(Bulk Action Toolbar → 없음, Bulk Selection +
     Action Toolbar Grid → 부분으로 롤백, 다만 Table 다중 선택 자체는 여전히
     되니 "없음"이 아니라 "부분" 유지) 갱신. tsc 클린 확인 후 커밋.
- (2026-07-31, 32차) "파운데이션 영역도 간격 넓혀줘, 왜 컴포넌트만 넓힌거야" —
  31차에서 `<main>`의 `gap-20`을 늘렸는데 Foundations(색상 팔레트~시맨틱 토큰
  6개)는 안 넓어져 보인다는 지적. 원인 확인: Components 쪽은 각 컴포넌트가
  `<Section>`/`<section>`으로 각각 독립된 `<main>`의 직계 자식(형제)이라 `gap-20`이
  그 사이사이에 그대로 적용되는데, Foundations 6개는 전부 `<div id="...">`
  형태로 **단일 `<section>` 하나** 안에 얹혀 있었음(그 section의 내부
  `gap-6`만 적용되고 `<main>`의 gap과는 무관) — 구조 자체가 달랐던 게 원인
  (담당자가 "구조가 달라?"라고 정확히 짚음). 6개 `<div id="...">`를 각각
  Components와 똑같은 형태의 독립 `<section id="..." className="...border-b
  border-mes-gray-30 pb-8">`로 분리해서 `<main>`의 직계 자식으로 만듦 — 이제
  Foundations도 Components와 동일하게 `gap-20`이 적용됨. id/스크롤스파이
  로직은 안 바뀜(`getElementById`가 이제 section 자체를 찾음, 이전엔 내부
  div였음 — 동작상 차이 없음). tsc 클린 확인 후 커밋.
- (2026-08-03, 33차) 담당자가 "생산지시" 실제 화면 스크린샷 + Figma 링크
  (node 17360:46222, fileKey F4n5Zr04PAbiRjfIFQAo6v)로 새 컴포넌트 2개 요청:
  1. **GroupQuery(그룹화 조회)** — "필터 왼쪽에 있는 그룹화 조회, 컴포넌트가
     없더라, 이거 사진 기반으로 만들어줘"(Figma 링크 없이 스크린샷 기반
     판단값으로 지정). 아이콘(`mes/icon-group-down`)+"그룹화 조회" 라벨 +
     Level 1~3 셀(각각 드롭다운: 값 있으면 filter-tag-item 스타일 칩+X,
     없으면 "전체" 평문). `group-query.tsx` 신규.
     ⚠ 조사 과정에서 우연히 발견: "빠른 조회" 참고용으로 준 Figma 섹션
     노드(17360:46222)를 `get_design_context`로 열어보니, 그 안에 그룹화
     조회 UI 자체도 실측 노드(17360:46223 하위 17360:46226~46247)로 포함돼
     있었음 — 스크린샷과 레이아웃/색이 정확히 일치해 실측값을 채택함(단,
     담당자가 이 컴포넌트 전용으로 지정해준 링크는 아니라서 문서상 "스크린샷
     기반 판단값" 딱지는 유지). 우측에 붙는 "+필터 추가" 박스(Figma
     data-name "fillter-group")는 기존 `Filter` 컴포넌트와 완전히 동일해
     새로 안 만들고 데모에서 나란히 배치.
  2. **QuickQuery(빠른 조회)** — "조회 기준을 즐겨찾기로 설정할 수 있는 거,
     링크로 줄게" — node 17360:46359(트리거 바: 북마크 아이콘+"빠른 조회"
     라벨+프리셋 칩 최대 3개+톱니 아이콘)와 node 17963:81433("조회 조건
     프리셋" 관리 모달, "라디오버튼버전")을 각각 재조회해 실측. 모달
     radius/shadow가 기존 `RadioChoiceDialog`의 `rounded-mes-modal-lg`/
     `shadow-mes-modal-lg` 토큰과 정확히 일치해 그대로 재사용. 톱니 아이콘은
     실제 SVG를 못 받아와서 Sidebar의 `SidebarSettingsIcon`과 동일하게
     `lucide-react`의 `Settings`를 임시 placeholder로 사용(판단값). 모달의
     프리셋 행 3가지 상태(미설정/저장됨/저장 중)는 실측이지만, 클릭
     흐름(빈 슬롯 클릭→이름 입력→저장, 저장된 슬롯 삭제 등)은 정적 실측에
     없어 다른 관리형 팝업 관례에 맞춰 판단으로 구현(행 내부 액션은 즉시
     반영, 하단 취소/저장 버튼은 닫기 전용) — 파일 상단 주석에 명시.
     `quick-query.tsx` 신규.
  둘 다 `page.tsx`에 데모 섹션 추가(`group-query`/`quick-query`, GroupQuery는
  "임시" 배지 유지, QuickQuery는 실측 비중이 높아 배지 없이), `TOC_LINKS`/
  `COMPONENT_NODES`에 Filter 다음 순서로 삽입. 체크리스트("11. SaaS 제품에서
  자주 쓰이는 복합 패턴")에 두 행 신규 추가(둘 다 티어1·있음). tsc 클린
  확인 후 커밋.
- (2026-08-03, 34차) 담당자 피드백 2건:
  1. "나는 분명 노란 별로 했다" — QuickQuery 북마크 아이콘을 outline(검정 계열
     기본값)으로 구현했던 게 잘못. Figma 실측 코드가 `mes/icon-star`를 이미지
     애셋(`<img>`)으로 내보내서 정확한 채움색을 코드로 못 읽어와 `IconStar`
     기본값을 그대로 뒀던 게 원인. `variant="filled"` + `text-mes-icon-warning`
     (Yellow-50/#F2A406, ConfirmDialog 경고 아이콘과 동일 토큰)으로 교정.
  2. "빠른조회 너비가 왜그럼" — 데모에서 트리거 바(`QuickQuery`)가 실제 내용
     폭보다 훨씬 넓게(섹션 폭 960px까지) 늘어나 보이는 버그. 원인: 이
     컴포넌트를 `flex-col` 섹션의 직계 자식으로 바로 배치했는데, flexbox
     `align-items: stretch` 기본값 때문에 flex item인 루트 div(테두리 있음)가
     부모 폭까지 늘어남 — `inline-flex`는 "자기 자식 배치"만 결정할 뿐 "자신이
     부모의 flex item으로서 늘어나는지"는 못 막아줌. `QuickQuery`(직접 원인)와
     `GroupQuery`(같은 구조라 방어적으로 동일 적용) 루트에 `self-start`+
     `shrink-0` 추가해 항상 내용 폭만큼만 차지하도록 고정.
  이어서 담당자가 Figma 링크(node 20186:68084)로 "이게 검색창"이라며 표 상단
  검색창(값을 입력하면 배경색이 깔려 "검색어가 명확히 입력됨"을 보여주는
  컴포넌트)을 전달 — 조사해보니 그룹화 조회/빠른 조회 조사 중 같은 상단바에서
  이미 봤던 "Input Textbox"(node 17360:46256)와 완전히 동일한 컴포넌트(200×32px
  고정폭, 값 있을 때 배경 Primary-20/테두리 Primary-30)라 새로 발견한 게 아니라
  같은 걸 담당자가 재확인차 다시 짚어준 것으로 판단. `search-input.tsx` 신규
  구현: 값 없음(판단값 — Input 컴포넌트 기본 상태 재사용)/값 있음(실측) 2상태,
  값 있을 때만 X 지우기 버튼 노출(판단값). `page.tsx`에 독립 Section(`search-input`)
  추가 + GroupQuery 데모 줄에도 실제 화면처럼 `justify-between`으로 같이 배치.
  `TOC_LINKS`/`COMPONENT_NODES` 갱신, 체크리스트 "Search Input" 행 비고 갱신
  (기존 "있음" 상태 유지, 신규 전용 컴포넌트 추가 사실만 명시). tsc 클린 확인
  후 커밋.
- (2026-08-03, 35차) 담당자가 "지금까지 했던거 다 검증 — 코드가 꼬이진
  않았는지, 재사용이 용이하게 되었는지" 요청 — 이번 세션에 새로 만든
  GroupQuery/QuickQuery/SearchInput 3개 위주로 종합 검증 진행:
  1. tsc --noEmit / eslint 클린 확인, git log·status 정합성 확인, 삭제된
     파일(backdrop/bulk-action-toolbar) 잔존 참조 없음 확인.
  2. `TOC_LINKS`(42개)/`COMPONENT_NODES`(leaf/branch)/실제 렌더된 `<section id>`
     3개 목록을 스크립트로 상호 대조 — 중복·누락·불일치 전부 없음 확인.
  3. `/tmp`에 복사해 실제 `next build`(정적 export) 끝까지 성공, `out/index.html`에
     신규 3개 컴포넌트 텍스트 전부 포함 확인(런타임 크래시 없음).
  4. 새 파일 3개를 직접 재검토하다가 `group-query.tsx`에서 진짜 버그 발견:
     Popover 트리거 `<button>` 안에 칩의 X(선택 해제)를 `<span role="button">`으로
     중첩해뒀던 것 — 버튼 안에 클릭 가능한 엘리먼트를 또 넣는 건 HTML 스펙 위반
     (키보드 포커스/스크린리더 꼬임). X를 트리거 버튼 밖으로 빼서 형제
     `<button>`으로 분리(드롭다운 열기=화살표 버튼, 선택 해제=X 버튼으로 역할 분리).
  5. `general-purpose` 서브에이전트로 독립 2차 리뷰(사전 컨텍스트 없이 코드만
     보고 판단하도록) — 실제 버그 1건 + 재사용성 문제 1건 추가로 발견:
     - **버그**: `QuickQueryPresetDialog` 푸터의 "저장" 버튼이 "취소"와 완전히
       똑같은 함수(`close`)를 호출해서, 행 내부 "저장"을 안 누르고 바로 푸터
       "저장"을 누르면 입력하던 이름이 조용히 버려짐(라벨은 "저장"인데 동작은
       "취소"). 편집 중인 슬롯이 있으면 커밋 후 닫는 `saveAndClose`로 분리해 수정.
     - **재사용성**: `GroupQuery`가 "전체"를 고르려면 호출부의 `options` 배열에
       반드시 `id: "all"`인 항목을 넣어야 하는 숨은 문자열 결합이 있었음(안 넣으면
       드롭다운에서 전체를 선택할 방법이 없어짐). "전체"를 컴포넌트가 항상 목록
       맨 위에 자체 렌더링(`onChange(null)`)하도록 바꿔 `options`는 순수하게
       실제 선택지만 넘기면 되게 API 단순화(`page.tsx`의 `groupQueryOptions`에서
       `{id:"all"}` 항목 제거).
  결과: 새 진짜 버그 2건 + 재사용성 결함 1건 발견해 전부 수정. 그 외엔(raw hex
  색상 하나가 select.tsx/combobox.tsx와 동일하게 기존 관례를 따른 것, `.indexOf`
  기반 라벨 계산 등) 기존 코드베이스와 일관되거나 영향 없는 수준이라 그대로 둠.
  수정 후 tsc/eslint 재검증 + `/tmp` next build 재검증 클린 확인 후 커밋.
- (2026-08-03, 36차) 담당자가 실제 서비스 알림 관련 스크린샷 2건으로 지시
  ("1. 알람은 목록에서 클릭하면 사라짐 .. 그리고 알람에서 환경설정 누르면
  팝업이 이렇게 바뀜") — `notification-panel.tsx` 2가지 확장(둘 다 Figma
  링크 없음, 스크린샷 기반 판단값):
  1. **클릭 시 목록에서 제거**: 컴포넌트 자체는 `items`를 그대로 렌더링만
     하는 순수 컨트롤형 원칙을 유지하고, 항목 클릭 시 그 id를 알려주는
     `onItemClick(id)` 콜백만 신규 추가(항목 자체 `onClick`이 있으면 그것도
     같이 호출해서 기존 호출부 안 깨지게 함). 실제 제거 로직은 데모(`page.tsx`)
     쪽 상태(`notificationItems`)에서 처리.
  2. **알림 설정 화면**: 스크린샷은 뒤로가기 화살표 + "알림 설정" 제목 +
     알림 유형별 라벨+Switch 토글 목록(입고 완료/입고 검사 요청/입고 검사
     완료/작업 지시 생성/작업 지시 변경/생산 완료/공정 검사 요청/공정 검사
     완료). 이전 30차 이전 라운드에서 "알림 설정" 텍스트 노드는 발견했지만
     이 패널의 실제 자식이 아니라 실측을 못 해 범위에서 뺐던 부분 — 이번
     스크린샷으로 목적지 화면은 확정됐지만 트리거 아이콘 자체는 스크린샷에
     없어서 Sidebar/QuickQuery와 동일한 `lucide-react` `Settings` placeholder를
     액션 줄(기존 필터 아이콘 옆)에 판단으로 추가함. 패널 내부에 `view`
     state("list"/"settings")를 둬서 콘텐츠 전체를 스와핑 — 이 정도 내부
     네비게이션은 Combobox의 열림 상태처럼 비제어로 두는 게 프로젝트 관례와
     맞다고 판단(완전 제어형으로 만들면 호출부가 항상 view까지 관리해야 해서
     번거로움). 뒤로가기 아이콘은 `IconArrow`가 이미 왼쪽 화살표 모양이라
     회전 없이 그대로 재사용. 각 행의 Switch는 기존 `Switch` 컴포넌트 재사용,
     `settingsItems`/`onSettingsItemChange`로 완전 제어형.
  `page.tsx` 데모 갱신(알림 목록 상태화 + 설정 목록 상태화), 체크리스트
  "Notification / Bell" 행 비고 갱신. tsc/eslint 클린 확인 + `/tmp` next
  build 재검증 후 커밋.
- (2026-08-03, 37차) 담당자 후속 피드백 2건, 둘 다 알림 관련:
  1. "알람에서 '비활성화' 처리된 내역은 삭제해줘" — `AlarmListItem`의
     `read=false`(흐림) 상태 배경(Gray-10)이 `table.tsx`에서 담당자가 확정한
     "비활성화(disabled) = 배경 Gray-10" 규칙과 정확히 일치 — `read=false`가
     실제로는 "비활성화"를 가리키는 것으로 추정하고, `notification-panel`/
     `alarm-list-item` 데모에서 read=false 예시 항목을 제거함(컴포넌트 자체의
     `read` prop/두 상태 지원은 그대로 유지 — 이번 지시는 "내역(데모 데이터)
     삭제"이지 API 변경이 아니라고 판단해 prop 이름은 안 건드림, 이 판단
     근거를 `alarm-list-item.tsx`에 명시).
  2. "알람 하단에 환경설정 아이콘이 두개 있는데, 작동하지 않는 작대기형 설정
     아이콘은 빼고 톱니바퀴형 아이콘만 남겨줘" — 36차에서 새로 추가한 톱니
     (Settings) 아이콘 옆에 원래부터 있던 필터 아이콘(`IconFilter`, "작대기형"
     — 슬라이더 모양)을 가리킨 것으로 판단, 실제로 처음부터 "클릭 시 어떤
     UI가 뜨는지 미실측"이라고 문서화돼 있던(=동작 없는) 슬롯이었음이 확인됨
     — `onFilterClick` prop과 버튼 JSX를 컴포넌트에서 완전히 제거. 액션
     줄도 이제 `settingsItems`가 있을 때만 렌더링(필터 없이 톱니만 남아
     아무 액션도 없으면 빈 줄을 보여줄 이유가 없어짐).
  체크리스트("Notification / Bell", "Alarm List/Table" 행) 갱신, tsc/eslint
  클린 확인 + `/tmp` next build 재검증 후 커밋.
- (2026-08-03, 38차) 37차의 1번(비활성화 내역 삭제) 해석이 틀렸다고 담당자가
  바로 정정: "알람리스트아이템 말고 노티피케이션페널 내 비활성화 처리된
  내역을 삭제해야지. 걍 클릭하면 리스트에서 지워지는 형식임." — 즉 "비활성화
  처리된 내역 삭제"는 `read=false`라는 별도 상태와 무관하게, 36차에서 이미
  만든 `NotificationPanel`의 `onItemClick` 클릭→제거 동작 그 자체를 가리키는
  말이었음. 37차에서 `read=false`(흐림) 배경이 `table.tsx`의 "비활성화=배경
  Gray-10" 규칙과 일치한다는 정황만으로 세운 이론은 틀렸던 것으로 확인 —
  AlarmListItem 데모(작업 지시 생성/출하 승인 취소·read=false/작업 지시
  변경/입고 완료·read=false 4종)와 NotificationPanel 데모(id "2" 출하 승인
  취소에 `read: false` 복원)를 원래대로 되돌림. `alarm-list-item.tsx`
  doc comment의 "정황" 문단도 "정정" 문단으로 교체해 이 왕복을 기록. 필터
  아이콘 제거(37차 2번)는 이번 정정과 무관해 그대로 유지. 체크리스트
  "Alarm List/Table"/"Notification / Bell" 행에 정정 내용 반영. tsc/eslint
  클린 확인 후 커밋.
- (2026-08-03, 39차) 담당자 재정정: "AlarmListItem 데모에서도 흐림 처리 아예
  삭제해 — Figma엔 있지만 실제 구현엔 없다. 실제 알림 패널에도 없다. 상태는
  기본(강조바 있는 원래상태)/클릭해서 없어진 상태 두 개뿐." → `read` prop과
  흐림 스타일을 `alarm-list-item.tsx`에서 완전히 제거(옵션이 아니라 아예
  없는 상태로). 데모(AlarmListItem 단독 섹션 + NotificationPanel 초기
  데이터)에서도 `read` 전달 부분 제거. 추가로 "새로 추가하는 데모 설명에
  '범위 밖' 같은 군더더기를 왜 자꾸 쓰냐"는 지적 — NotificationPanel/
  GroupQuery 데모 `<p>` 설명을 핵심만 남기고 정리. 체크리스트 갱신,
  tsc/eslint 클린 확인 + `/tmp` next build 재검증 후 커밋.
- (2026-08-03, 40차) 담당자 지시: "너가 직접 피그마 읽어가면서 하면 안되나?
  있는건 있는거대로 명확하게, 없으면 너가 임시로 만들어서" — 티어2 남은
  32개 컴포넌트를 직접 판단해서 진행하라는 포괄 승인. `search_design_system`
  으로 Breadcrumb("breadcrumb-mid/chip" 등, 컴포넌트 라이브러리 파일)/
  Pagination("NEW Pagination"/"NEW numbering")/Date Picker("달력", 클라우드
  MES 파일) 후보를 찾았으나, 이 MCP는 componentKey(라이브러리 전역 퍼블리시
  키)만 반환하고 실제 파일 내 node-id로 해석하는 수단이 없음 — `get_metadata`
  로 페이지 전체를 훑어 node-id를 찾으려 했지만 결과가 73만자를 넘어 도구
  한도 초과, 텍스트 검색도 빈 결과라 실측 경로를 포기. Card/Popover 등은
  검색해도 무관한 라이브러리("디자인 시스템" — 범용 머티리얼 아이콘셋) 노이즈
  뿐이라 애초에 실측 불가.
  → 1차 배치로 8개를 판단값으로 구현: Card/EmptyState/ErrorState/Popover/
  Accordion/Collapsible/ButtonGroup/ToggleButton. 전부 기존 토큰·기존
  variant·기존 의존성(Radix Popover)만 재사용해 새로 지어낸 값을 최소화
  (Card radius는 `--mes-radius-control` 주석에 이미 "카드형 배경"으로 지정된
  값, ToggleButton은 Button의 lineBlacktxt/opacityMain 배색 재사용, Popover는
  Combobox가 이미 쓰는 `@radix-ui/react-popover` 재사용, Accordion/Collapsible
  은 Tooltip처럼 새 Radix 의존성 없이 순수 state + 기존 table-full의
  ChevronRight/rotate-90 규칙 재사용). 체크리스트 8개 행 갱신, page.tsx에
  데모 섹션 8개 추가, tsc 클린 확인 + `/tmp` next build 재검증 후 커밋.
  남은 24개는 후속 배치로 계속 진행 예정.
- (2026-08-03, 41차) 담당자 지시: "다시시도해도 실패할 가능성이 더 높으면 시도하지
  말고 다음거. 판단값 우선." — 40차에서 보류했던 Breadcrumb/Pagination/Date Picker
  Figma 재탐색을 포기하고 전부 판단값으로 전환, 나머지 항목도 Figma 재탐색 없이
  바로 판단값으로 진행. 2차 배치 10개 신규 구현: NumberInput/PasswordInput/
  MultiSelectInput/Breadcrumb/Pagination/DropdownMenu/List·ListItem/Panel/
  Fieldset/Descriptions. 전부 기존 컴포넌트 재사용 원칙 유지(NumberInput·
  PasswordInput은 Input의 `inputVariants` 재사용, MultiSelectInput은 Tag 재사용,
  DropdownMenu는 40차에서 만든 Popover 재사용, Panel은 NotificationPanel/Combobox
  패널 톤 재사용). Bulk Action Toolbar와 Backdrop/Dim Overlay는 이전에 담당자가
  "빼라"고 명시적으로 제거했던 항목이라 이번 배치에서 제외(새 지시 없이 부활 안
  시킴). Spacing Scale/Z-index Scale은 React 컴포넌트가 아니라 문서 항목이라 이번
  배치에서 제외.
  이어서 담당자가 두 가지를 추가 요청:
  1. "'임시'인 건 좌측 메뉴 리스트에도 '임시' 태그를 달아줘" — 지금까지
     `<Section badge="임시">`로 표시해온 27개 섹션 id를 `TEMP_BADGE_IDS`(Set,
     FOUNDATION_IDS와 같은 수동 동기화 방식)로 모아, 좌측 사이드바 트리의 leaf/
     branch-child 링크 옆에도 동일한 파란 "임시" 뱃지를 작게 표시하도록 함.
  2. "파운데이션과 컴포넌트가 메인 화면에도 이케 구분자로 있어야 할거같아" — 사이드바의
     Foundations/Components 그룹 제목과 짝을 맞춰, 메인 콘텐츠 영역에도 각 그룹
     시작 지점(색상 팔레트 섹션 앞 / Button 사이즈 섹션 앞)에 "Foundation"/
     "Components" 이름표 + 한 줄 설명을 추가.
  tsc 클린 확인 + `/tmp` next build 재검증 후 커밋. 남은 항목은 계속 후속 배치로
  진행.
- (2026-08-03, 42차) 담당자가 다시 한번 "재시도 실패 가능성 높으면 넘어가고 판단값
  우선" 확인 + "이것도 하다가 말았었구나"(중단 없이 끝까지 진행하라는 뜻으로 이해) —
  티어2 3차 배치로 남은 실제 컴포넌트 10개를 전부 판단값으로 구현: DatePicker/
  DateRangePicker/TimePicker/Navbar/Container·Grid/ScrollArea/StickyHeader·
  StickyFooter/Logo/UserAccountMenu/LoadingOverlay.
  - DatePicker: 순수 Date 계산(달력 그리드, 요일, 월 이동)만 구현하고 외부 날짜
    라이브러리 추가 안 함. 계산 헬퍼(`buildMonthMatrix`/`formatDate`/`WEEKDAYS`)를
    DateRangePicker가 그대로 import해서 재사용 — 같은 달력 그리드를 두 번 안 짬.
  - TimePicker/DropdownMenu 계열은 전부 Popover(40차) 재사용.
  - Navbar 높이 56px은 이 데모 페이지 자체 헤더가 이미 쓰는 값을 재사용(임의 아님).
  - LoadingOverlay는 "특정 영역을 덮는 로딩"이고, Backdrop("모달 배경 딤 처리")은
    이전에 담당자가 명시적으로 제거를 지시했던 별개 항목이라 헷갈리지 않게 구분해서
    새로 구현(Backdrop을 되살린 게 아님).
  - Bulk Action Toolbar/Backdrop은 이번에도 제외(제거 지시가 아직 안 뒤집힘).
  - Spacing Scale/Z-index Scale은 React 컴포넌트가 아닌 토큰 문서 항목 — Z-index
    Scale은 Figma에 없는 개념이라 코드에 이미 쓰이고 있던 z-10/30/50 실사용값을
    그대로 스케일로 정리해 `디자인_토큰_사용_규칙.md` 8-1절에 문서화하고 체크리스트
    "있음"으로 갱신(새 값 발명 아님). Spacing Scale은 여전히 숫자 스케일이 미확인이라
    "부분" 상태 유지(억지로 "있음"으로 안 올림).
  전 항목 체크리스트 갱신, page.tsx에 데모 섹션 10개 + 사이드바 임시 뱃지/TOC 반영,
  tsc 클린 확인 + `/tmp` next build 재검증 후 커밋. 이걸로 티어2 32개 항목 중
  Bulk Action Toolbar/Backdrop(보류) 2개를 뺀 나머지가 전부 처리됨.
- (2026-08-03, 43차) 담당자가 GroupQuery 데모 스크린샷을 보내며 지적: "필터 추가" 글자가
  한 글자씩 세로로 쪼개지며 GroupQuery 섹션 제목/설명 위로 겹쳐 보이는 렌더링 버그.
  "이런 문제가 앞으로도 발생할 수 있는 구조라면 근본적으로 바꾸고, 티어 1~5도 좌측
  리스트에 표기해달라"는 두 가지 요청.
  1. **원인 규명**: `group-query` 데모 줄(GroupQuery+Filter+SearchInput을 한 flex row에
     배치)에서, 형제 컴포넌트인 GroupQuery/SearchInput은 35차 너비 버그 수정 때 이미
     루트에 `shrink-0`을 넣어 "나는 안 줄어든다"고 선언해뒀는데 `Filter`만 그 방어가
     없었음 — flexbox가 부족한 너비를 전부 Filter 하나에 떠넘기면서 트리거 버튼이
     찌그러지고(한글은 글자 단위 줄바꿈이 가능해 세로로 쌓임), `overflow: visible`
     기본값 때문에 그 결과가 이웃 섹션 위로 겹쳐 보인 것.
  2. **직접 원인 수정**: `filter.tsx` 루트/트리거 버튼/태그 박스에 `shrink-0` +
     `whitespace-nowrap` 추가. `group-query` 데모 줄에도 방어적으로 `flex-wrap` 추가(폭이
     정말 부족하면 이제는 SearchInput이 다음 줄로 내려감 — 찌그러지지 않음).
  3. **구조적 재발 방지(담당자가 요청한 "근본적으로 바꿔" 부분)**:
     - 같은 문제가 있을 만한 다른 hug-width 트리거/칩 컴포넌트를 감사해 동일하게
       `shrink-0`(+필요시 `whitespace-nowrap`) 추가: Tag, ButtonGroup, ToggleButton,
       Breadcrumb, Pagination, Logo, UserAccountMenu 트리거.
     - `Section`이 쓰는 `grid-cols-4`는 컬럼 폭을 넘는 콘텐츠가 있어도 grid item 기본값
       (`min-width: auto`)이 줄어드는 걸 막아서, 넘친 부분이 이웃 셀 위로 겹쳐 보일 수
       있는 구조였음 — `Sample`(모든 데모 예시가 공통으로 쓰는 wrapper)에 `min-w-0` +
       내부 콘텐츠에 `overflow-x-auto`를 추가해, 개별 컴포넌트가 `shrink-0` 방어를
       빠뜨리더라도 최악의 경우가 "가로 스크롤"로 끝나도록 안전망을 깔아둠(겹침/깨짐 방지).
     - 새 hug-width 컴포넌트를 만들 때 루트에 `shrink-0` 기본 적용을 컨벤션으로 확정
       (`filter.tsx` 5번 주석에 기록).
  4. **티어 표기(TierBadge)**: `docs/UI_컴포넌트_총망라_체크리스트.md`의 티어 값을
     `TIER_BY_ID`(TEMP_BADGE_IDS와 같은 수동 동기화 방식)로 옮겨, 사이드바 각 항목
     라벨 옆에 T1~T5 작은 뱃지로 표시(`TierBadge` 컴포넌트, 티어별 색 구분).
  tsc 클린 확인 + `/tmp` next build 재검증(빌드된 정적 HTML에서 `shrink-0`/`flex-wrap`/
  `T1`·`T2` 뱃지가 실제로 반영됐는지 직접 확인) 후 커밋. 참고: 이 샌드박스엔 네트워크
  allowlist 때문에 헤드리스 브라우저(playwright chromium)를 설치할 수 없어 픽셀 단위
  스크린샷 재현은 못 했고, 빌드된 HTML의 클래스명 검증 + 코드 레벨 CSS 추론으로 검증함.
- (2026-08-03, 44차) 담당자가 Toast 데모 스크린샷을 보내며 43차에서 넣은
  `overflow-x-auto` "안전망"이 Toast 아래에 불필요한 가로 스크롤바를 만든 걸 지적:
  "컴포넌트 안에 스크롤 만드는 건 극도로 지양", "줄바꿈도 좀 그래 솔직히". 추가로
  사이드바 관련 3가지 요청: (1) 티어 아이콘을 라벨 왼쪽으로, (2) 티어별로 순서 배치 +
  같은 티어 안에서는 알파벳순 정렬, (3) 우측 상단에 이름 검색창.
  1. **스크롤/줄바꿈 안전망 → 진짜 해결로 교체**: `overflow-x-auto`가 가리기만 하고
     실제 원인(콘텐츠가 grid-cols-4 한 칸(~222px)보다 넓음)은 안 고친다는 지적이 맞음.
     `Sample`에 `wide` prop 추가(4칸 전체 차지, `col-span-4`) — 실측 결과 컬럼보다 넓은
     기존 샘플 전부에 적용: Toast(red/blue), Card, Accordion, Collapsible,
     MultiSelectInput, Breadcrumb, Pagination, Fieldset, Descriptions, Navbar,
     Grid, DateRangePicker. `overflow-x-auto`는 제거, `min-w-0`은 grid item이
     콘텐츠 때문에 트랙을 밀어 늘리는 "grid blowout"만 막는 용도로 유지(스크롤 유발
     안 함, 부작용 없음). Date/DateRange/TimePicker 트리거 라벨엔 방어적으로
     `whitespace-nowrap`도 추가.
  2. **사이드바 티어 위치**: `TierBadge`를 라벨 `<span>`보다 앞에 렌더링하도록 순서
     변경(leaf/branch child 둘 다).
  3. **티어별 정렬**: `COMPONENT_NODES.sort()`로 티어 오름차순 → 동일 티어면
     `label.localeCompare(..., "en")`로 알파벳순 재정렬(제자리 정렬이라
     `SIDEBAR_GROUPS`에도 그대로 반영됨). Foundations(6개, 순서 자체가 이미 논리적)는
     건드리지 않음.
  4. **검색창**: 헤더 우측(`ml-auto`)에 검색 input 추가, `sidebarSearch` state로
     leaf/branch label 부분일치(대소문자 무시) 필터링 — branch는 자기 라벨이나 자식
     중 하나라도 맞으면 노출, 자식은 맞는 것만 남김. 검색은 사이드바 목록만 필터링하고
     실제 페이지 스크롤은 클릭해야 이동(자동 스크롤 안 함).
  tsc 클린 확인 + `/tmp` next build 재검증(빌드된 정적 HTML에서 `col-span-4`, 검색
  input, 티어 정렬 순서, TierBadge 위치까지 직접 grep으로 확인) 후 커밋.
- (2026-08-03, 45차) 담당자 요청: "네스티드모달은... 선택 항목을 삭제하시겠습니까에서
  확인 누르면 삭제되었습니다가 뜰 수 있도록 구성". Nested Modal 데모의 최종 "삭제
  확정" 클릭이 지금까지 두 모달을 조용히 닫기만 했던 걸, 3번째 단계로 성공 알림
  ConfirmDialog("알림"/"삭제되었습니다", info 톤, 확인 1버튼)를 추가로 띄우도록 확장 —
  같은 파일에 이미 있던 "삭제 완료 알림"(infoDialogOpen) 패턴과 동일한 톤/구조 재사용.
  `nestedModalSuccessOpen` state 추가. tsc 클린 + `/tmp` next build 재검증(닫힌 상태
  Dialog는 Radix가 언마운트해 정적 HTML엔 안 잡히는 게 정상 — 기존 "삭제 완료" 다이얼로그도
  동일하게 안 잡히는 것으로 재확인) 후 커밋.
- (2026-08-03, 46차) 담당자 정정: "검색어를 입력하면 좌측에서 필터링되는 게 아니라
  좌측 리스트는 그대로 있고 검색창 아래에 컴포넌트들이 리스트로 떠야지 마치 콤보박스
  처럼." 44차에서 만든 "사이드바 자체를 필터링" 방식을 되돌리고, 검색창을
  Popover(40차에서 만든 것 재사용)의 트리거로 감싸 그 아래에 결과 드롭다운을 띄우는
  방식으로 교체 — 사이드바(`SIDEBAR_GROUPS` 렌더링)는 43차 이전 형태로 완전히 원복
  (필터링 로직 삭제, 전체 목록 항상 그대로). 검색 대상은 `FOUNDATION_NODES`/
  `COMPONENT_NODES`를 평탄화한 `ALL_SEARCHABLE_ITEMS`(leaf + branch의 children 전부).
  드롭다운은 `open={searchResults.length > 0}`으로 제어(입력 있고 매치 있을 때만 열림),
  항목 클릭 또는 바깥 클릭/Esc(`onOpenChange`) 시 검색어를 비워 자동으로 닫힘 — 콤보박스
  선택 동작과 동일하게. tsc 클린 + `/tmp` next build 재검증(사이드바가 다시 전체
  70개 항목을 보여주는지 직접 확인) 후 커밋.
- (2026-08-03, 47차) 담당자 지적 2건: (1) 사이드바 "Foundations"/"Components" 구분
  텍스트가 너무 작아서 헤더처럼 안 보임 — `text-[11px] font-bold uppercase
  tracking-wide text-mes-gray-60`에서 `text-[15px] font-extrabold tracking-tight
  text-mes-gray-130` + 하단 구분선(`border-b`)으로 확대, 그룹 간 여백도 mb-6→mb-7.
  (2) 사이드바 항목 클릭 시 앵커 스크롤이 sticky 상단바(header `h-14`=56px, `sticky
  top-0 z-30`)에 가려서 스크롤을 더 올려야 제목이 보이는 문제 — 전 섹션(`Section`
  헬퍼 + 개별 `<section>` 19곳)의 `scroll-mt-6`(24px, 상단바 높이 미고려)을
  `scroll-mt-20`(80px = 56px 상단바 + 여유분)으로 일괄 변경. tsc 클린 확인(전체
  next build은 샌드박스에서 백그라운드 프로세스가 호출 간 유지되지 않아 이번 라운드는
  생략 — 순수 className 문자열 변경이라 타입 영향 없음) 후 커밋.
- (2026-08-03, 48차) 47차 수정이 부족하다는 재지적: "텍스트 크기가 좀 더 커야돼 완전
  헤더가 되어야". 추가로 메인 화면(우측 콘텐츠 영역)에도 같은 지적 — 55차 때 이미
  넣어뒀던 Foundation/Components 구분자(13px, 섹션 h2 17px보다 오히려 작았음)를
  섹션 h2(17px)보다 뚜렷이 큰 28px + `border-l-8`(h2의 `border-l-4`보다 두꺼운 좌측
  바)로 확대 — "섹션 헤더보다 더 큰 크기로 확 나눠줘" 요청 반영, 상위 카테고리
  임을 시각적으로 명확히 함. 사이드바 그룹 제목도 15px→18px + `border-b-2`(진한
  gray-90)로 한 단계 더 확대. tsc 클린 확인 후 커밋.
- (2026-08-03, 49차) 담당자 지시 4건 일괄 처리.
  1) "당근 Seed 보니까 Foundation에도 icon이 들어가있어" — 사이드바 그룹 제목 +
     메인 콘텐츠 구분자(Foundation/Components) 앞에 아이콘 추가(Palette/Blocks,
     lucide-react). 사이드바는 18px 옆에 18px 아이콘, 메인은 28px 옆에 28px 아이콘.
  2~3) "더 작업이 필요한 것들의 구역을 미리 생성해 둬" — SIDEBAR_GROUPS에 3번째
     그룹 "예정"(nodes: [], Hammer 아이콘) 추가, 메인 콘텐츠 맨 끝에 같은 스타일의
     "예정" 구분자 + EmptyState 2개(티어3/티어4 안내, 항목 125개를 지금 다 나열하진
     않고 자리만) 추가. 티어5(28개)는 체크리스트상 이미 "제외" 확정이라 제외.
  4~5) 담당자가 준 클라우드MES "Modal" 스펙 페이지(node 9873:82872, Type01=Center
     Modal/Type02=Side Slide Panel) — 2026-07-30에 "Center Modal과 Side Slide
     Panel이 위계가 비슷해서 같이 자료 보내주겠다"며 보류시켰던 바로 그 약속된
     자료라 판단해 보류 해제.
     - `center-modal.tsx`: `docs/보류_컴포넌트/center-modal.tsx.bak`(2026-07-29
       코드, 폭 720px은 당시 판단값) 복원 후 이번 스펙으로 갱신 — 폭 960px 확정
       (스펙 페이지 실측 프레임과 페이지 전체 max-w-960 관례 둘 다와 일치), 최대
       높이 80vh(스펙 페이지 빨간 주석 "모달창 최대 높이값은 화면의 80%") 추가,
       헤더/푸터는 `shrink-0`로 고정하고 본문만 `flex-1 overflow-y-auto`로 스크롤
       되도록 구조 변경(기존엔 본문 안 플레이스홀더 박스가 h-326px 고정이었음 —
       이건 원본의 "콘텐츠 영역" 예시일 뿐 실제 규칙이 아니었다고 재해석).
     - `side-slide-panel.tsx`: 신규 작성. 같은 스펙 페이지 Type02 — 화면 우측 고정,
       세로 100%, 폭 960px(원본 텍스트 설명은 960px이 기본이라는데 예시 프레임
       자체는 900px로 그려져 있어 텍스트 쪽을 확정값으로 채택, 900px은 판단값
       각주로 남김), 헤더/푸터/버튼 구조는 Center Modal과 완전 동일해 재사용.
       슬라이드 인/아웃 애니메이션은 프로젝트에 애니메이션 유틸이 없고 다른 Dialog
       계열도 전부 무애니메이션이라 판단값으로 생략.
     - 오버레이 딤은 두 컴포넌트 다 스펙 페이지의 rgba(0,0,0,.6) 대신 기존
       ConfirmDialog와 통일된 `bg-black/40`으로(스펙 페이지 자체 배경일 뿐 컴포넌트
       토큰이라는 근거가 약하다고 판단, 일관성 우선).
     - `page.tsx`에 두 섹션 데모 추가(더미 14/24행으로 헤더·푸터 고정 확인용),
       Nested Modal 섹션 설명문에서 "Center Modal 보류 중" 문구 제거, 체크리스트
       Center Modal 보류→있음/Side Slide Panel 코드화 완료로 갱신.
  tsc 클린 확인 후 커밋.
- (2026-08-03, 50차) 담당자 지시로 데모 페이지 `Section`/`Sample` 레이아웃 전면
  재구성. "지금 컴포넌트들이 다 가로로 정렬되어있잖아? 세로 정렬로 바꾸기 / 세로로
  바뀌면서 남는 공간에 사이즈(패딩·마진 등) 적기 / 우측 빈 공간에 그 섹션 하위
  컴포넌트 리스트 두고 클릭하면 이동" — 적용 범위를 물어봤더니(AskUserQuestion)
  "전체 섹션 한번에 적용"으로 확답받고 52개 `<Section>`(126개 `<Sample>`) 전체를
  한 번에 재구성.
  - `Section`: 내부 컨테이너를 `grid grid-cols-4`(한 칸 ~222px)에서
    `flex flex-col divide-y`(세로 스택, 구분선)로 교체. 이전 라운드(44차)에서 만든
    `wide` prop(좁은 칸보다 넓은 콘텐츠를 4칸 전체로 펼치던 안전장치)은 이제 모든
    행이 항상 전체 폭을 쓰게 되면서 존재 이유가 사라져 13개 사용처(Toast/Card/
    Accordion/Collapsible/MultiSelectInput/Breadcrumb/Pagination/Fieldset/
    Descriptions/DateRangePicker/Navbar/Grid) 전부에서 제거.
  - "사이즈 적기"는 컴포넌트마다 padding/margin을 손으로 재서 써넣는 대신
    `useMeasuredSize`(ResizeObserver 기반 커스텀 훅) 신규 작성 — Sample이 감싼
    콘텐츠의 실제 렌더링 W×H를 라이브로 측정해 라벨 옆에 "248 × 40px" 식으로 표시.
    padding/margin 자체는 컴포넌트 내부 구조라 바깥에서 일반적으로 측정할 방법이
    없어 판단값으로 제외(각 컴포넌트 파일 실측 주석에 이미 기록돼 있음).
  - "우측 하위 컴포넌트 리스트"는 페이지 우측의 비어있던 여백(왼쪽 사이드바 240px +
    가운데 960px 콘텐츠 바깥)에 두 번째 사이드바 `RightRail` 신규 추가 —
    좌측 사이드바와 같은 `activeId`(스크롤스파이)를 재사용해 현재 보고 있는 섹션의
    Sample 라벨 목록을 보여주고, 클릭하면 앵커(`href="#섹션id--s번호"`)로 해당
    Sample까지 스크롤 이동. `xl:` 이상에서만 노출(중간 화면폭에서 3단 컬럼이
    비좁아지는 것 방지).
  - 배선: `Section`이 렌더링될 때마다 자기 자식 중 `Sample` 엘리먼트만 걸러
    `Children.map`+`cloneElement`로 고유 id(`${섹션id}--s${순번}`)를 주입하고,
    동시에 `{id,label}` 목록을 `SectionRegistryContext`(신규, `createContext`)로
    전달받은 `Map` ref에 등록. `RightRail`은 페이지 최상단에서 만든 같은 ref를
    받아 `activeId`에 해당하는 목록을 읽음 — Section 호출부 52곳에 prop을 일일이
    추가하지 않고도 배선되도록 Context로 우회(직접 데이터 배열을 넘기는 방식은
    JSX children에 로컬 상태/핸들러가 섞인 기존 Sample 콘텐츠를 전부 데이터
    구조로 다시 써야 해서 비현실적이라 판단). "렌더 중 ref 뮤테이션"이라는 약간
    비순수한 패턴이지만, JSX가 문서 순서대로(왼쪽 사이드바→메인→RightRail)
    렌더링되는 걸 이용해 RightRail이 같은 렌더 패스에서 이미 채워진 값을 읽게 됨 —
    멱등 연산(`Map.set`)이라 React 19 Strict Mode의 이중 호출에도 문제 없음.
  - Foundation 계열(색상 팔레트/타이포 등)·Table·아이콘 섹션은 `Section` 헬퍼가
    아니라 순수 `<section>`을 직접 쓰는 곳이라 레지스트리에 안 잡힘 — RightRail이
    그 구간에서는 폭만 유지한 채 빈 채로 표시(레이아웃 덜컹거림 방지).
  - 검증: tsc 클린, `npx eslint src/app/page.tsx` 클린(React Hooks 규칙 위반 없음
    확인) — `next build`는 이 샌드박스에서 계속 "Bus error"로 죽어(코드와 무관한
    환경 문제로 판단, 메모리는 2.4GB 여유 있었음) 실행 못 함, tsc+eslint로 대체.
- (2026-08-03, 51차) 담당자가 당근 Seed(seed-design.io) Snackbar 문서 페이지
  스크린샷을 보여주며 여러 건 지적/정정.
  1) **정정**: "foundation에 icon이 들어가있다"는 49차 때 헤더 옆에 아이콘을 넣으라는
     뜻으로 오해했는데, 실제로는 "섹션들을 다 검토해서 파운데이션에 들어가야 하는
     것들을 파운데이션으로 옮겨라"는 뜻이었음. 체크리스트 레이어 기준으로 재검토해
     "아이콘"(Icon Set, 레이어=토큰)과 "Grid/Container"(레이어=레이아웃 유틸) 둘을
     Components→Foundation으로 재분류. `FOUNDATION_IDS`/`FOUNDATION_NODES`가
     기존엔 `TOC_LINKS.slice(0, 6)`처럼 위치 기반이라 취약했던 걸 `FOUNDATION_ID_LIST`
     명시적 배열로 리팩터링(6→8개). 사이드바 그룹과 스크롤 순서가 어긋나지 않도록
     두 섹션의 JSX 자체를 Components 구분자보다 위(semantic-tokens 바로 다음)로
     물리적으로 이동. ScrollArea는 같은 "레이아웃 유틸" 레이어지만 실제로는 다른
     컴포넌트 안에 끼워 쓰는 상호작용 유틸에 가까워 Components에 남김(판단값).
  2) "가로에서 세로로 바뀌었으니 Sample 간 간격도 있어야" — `Sample` 루트의
     `py-4`→`py-7`로 확대, `Section` 컨테이너의 `divide-mes-gray-20`→
     `divide-mes-gray-30`으로 구분선도 살짝 더 보이게.
  3) "텍스트가 너무 작고 연하다" — 라벨을 12px→13px+font-semibold+Gray-90→Gray-100,
     실측 사이즈 표기를 10px+Gray-50(거의 안 보이던 수준)→11px+Gray-50 유지하되
     "실측" 접두사를 붙여 자동측정값임을 명시(사람이 적은 스펙과 구분되도록).
  4) "단순 사이즈만 적지 말고 패딩 때문에 그 크기다, 아이콘 크기·패딩, 색상
     토큰명(main60 등)까지 적어야" — `Sample`에 `spec?: ReactNode` prop 신규 추가.
     자동 측정 W×H는 그대로 두고, 그 아래에 사람이 적은 스펙 문장을 얹는 구조.
     126개 Sample 전부를 이번에 채우진 못했고, 담당자가 직접 예로 든 IconButton
     8개(각 variant/size의 버튼 고정 크기+아이콘 px+색상)와 Button 컬러 7개(각
     variant의 배경/hover/텍스트 색상 토큰명, `button.tsx`/`icon-button.tsx` 파일
     자체의 실측 주석 값 그대로 인용)에만 우선 적용 — **나머지 세션 전체에 spec
     채워넣기는 후속 작업으로 남음**.
  5) 우측 서브내비(RightRail)를 당근 Seed의 "On this page"처럼 Anatomy/Properties/
     Variant/Guidelines처럼 중첩된 구조로 만드는 건 어떤지 물어봤다가 "이건 페이지
     단위로 달라지는 거라 이렇게까지 길게 하진 않을지도... 일단 기억만 해둬"라고
     스스로 정리 — **구현하지 않음, 지시 대기**. 나중에 필요해지면: 컴포넌트별로
     Anatomy 다이어그램(파츠에 화살표+라벨) / Properties 표 / Variant 목록 /
     Guidelines 산문 설명 / Specification 상세값을 갖춘 개별 문서형 섹션으로 키우고,
     RightRail도 그 하위 목차(중첩 리스트)를 보여주는 형태로 확장하는 방향.
  tsc 클린 확인(next build는 여전히 샌드박스 Bus error) 후 커밋.
- (2026-08-03, 52차) 담당자가 51차의 자동 실측(ResizeObserver) 방식 자체를 지적:
  "실측값은 내부 텍스트나 뭐가 들어갔는지에 따라 달라지는데, 그걸 다른 컴포넌트랑
  같이 화면 그릴 때 문제 생기지 않을까?" — 정확한 지적. Button처럼 높이는 고정이지만
  너비는 hug(내용 텍스트 길이 따라 가변)인 컴포넌트에서, 데모에 우연히 들어간
  "fillMain" 같은 라벨 텍스트로 잰 픽셀값을 마치 컴포넌트의 실제 스펙인 것처럼
  보여주면 오히려 잘못된 정보를 유포하는 셈 — 실측 화면 구성 시 그 숫자를 믿고
  레이아웃을 짜면 실제로는 다른 텍스트가 들어갈 때 깨짐.
  - `useMeasuredSize` 훅(ResizeObserver 기반) 완전 제거, `Sample`에서 자동
    측정 W×H 표시 삭제. 사이즈 정보는 이제 오직 `spec`(사람이 직접 적는, 내용과
    무관하게 항상 참인 값 — 고정 높이, 패딩, radius, 아이콘 px, 색상 토큰명)
    하나로만 제공. 너비가 hug라 고정값이 없으면 숫자 대신 "hug(가변)"라고 사실
    자체를 적도록 `Sample`의 `spec` doc 주석에 명시.
  - 51차에서 채운 IconButton 8개(진짜 고정 정사각형이라 안전)/Button 컬러 7개
    (높이+패딩만 적었고 너비는 원래도 안 적었음)는 그대로 유지 — 애초에 가변폭을
    숫자로 박아 넣지 않았어서 이번 지적과 충돌 없음.
  tsc 클린 확인 후 커밋.
- (2026-08-03, 53차) 담당자 지적 2건.
  1) "이거 왜 텍스트로 주절주절 적냐, 색상:크기:R값:테두리 이렇게 우측에
     구조화해서 적어라" — `Sample`의 `spec` prop을 산문 문자열(`React.ReactNode`)에서
     `{label, value}[]` 배열로 변경. 렌더링도 라벨/컴포넌트 아래에 얹던 방식에서
     컴포넌트 오른쪽에 별도 박스(회색 배경, key-value 줄바꿈 나열)로 이동 —
     `justify-between` flex row로 Sample 전체 구조 변경. 기존에 채워뒀던 Button
     컬러 7개/IconButton 8개의 산문 spec을 전부 구조화 배열로 재작성(배경/hover/
     텍스트/테두리/크기/R값 필드로 통일).
  2) "textarea 같은 것도 텍스트박스 크기, 텍스트가 좌우로 몇 px 떨어져 적히는지
     같은 내용이 없다. 버튼 아이콘도 아이콘↔텍스트 간격, 아이콘/텍스트↔테두리
     간격(상하좌우) 적어야" — `textarea.tsx`(px-[10px]/py-2/border-default/
     control radius/min-h-20)와 `button.tsx`(gap-1.5=6px, basic px-4=16px,
     고정높이 40px)의 실제 코드 값을 그대로 인용해 Textarea 4개 + Button 아이콘
     3개 Sample에 spec 채움 — 특히 Button 아이콘 쪽은 좌/우/아이콘↔텍스트를
     각각 분리해서 표기(요청한 그대로: "아이콘과 텍스트 사이는? 아이콘과
     테두리는? 상하는? 좌우는?"). 나머지 Sample들은 여전히 후속 작업.
  tsc 클린 확인 후 커밋.
- (2026-08-03, 54차) 담당자가 53차까지의 부분 적용(126개 중 32개만 spec 있음)을
  강하게 지적: "왜 그 내용들이 없는것도 잇고 잇는것도 잇지? 잇을거면 다 잇고
  없을거면 다 없어야하지않나? 왜 드문드문잇지?" — 드문드문 채워진 상태 자체가
  문제라는 지적(일부 컴포넌트만 정확한 값이 있고 나머지는 아무 정보도 없으면,
  "정보가 없다"는 사실이 "이 컴포넌트는 뭐든 상관없다"는 오해로 이어질 수 있음).
  전체 126개 Sample(51개 Section) 전수에 spec을 채우는 작업을 진행 — 남아있던
  약 94개(Select/Badge/Radio/Checkbox/Progress/SearchInput/Tag/Combobox/Toast/
  ConfirmDialog/RadioChoiceDialog/티어2 "임시" 뱃지가 붙은 32개 컴포넌트 전부/
  Button 사이즈 4개)를 각 컴포넌트 소스 파일(`src/components/ui/*.tsx`)의
  doc 주석과 실제 Tailwind 클래스를 그대로 인용해서 채움 — 51~53차와 동일한
  원칙 유지: 내용(텍스트 길이 등)에 따라 달라지는 값(주로 너비)은 숫자를
  지어내지 않고 "hug(가변)"이라고 사실 그대로 적고, Figma 실측이 없는 티어2
  "임시" 컴포넌트는 각 소스 파일 주석에 이미 있던 "Figma 전용 컴포넌트 없음
  (판단값)" 문구를 spec에도 그대로 노출해서 실측값과 판단값을 섞어서 보여주지
  않도록 함(예: DropdownMenu/List/Panel/Fieldset/Descriptions/Navbar/ScrollArea
  등 재사용 관계가 있는 것들은 "OO와 동일 규격 재사용"이라고 출처를 남김).
  126개 전수 확인은 정규식으로 `<Sample` 태그마다 `spec=` 존재 여부를 검사하는
  1회성 스크립트로 검증(0개 누락 확인). 작업 도중 button-size 섹션(Basic/Small/
  Xsmall/Disabled 4개)이 실수로 이전 라운드에서 빠져있던 것도 이번에 같이 발견해
  채움. tsc 클린 확인 후 커밋.
- (2026-08-03, 55차) 담당자가 54차 결과물에 두 가지를 지적.
  1) "똑같이 R값이 보이는데 왜 어디는 R값 얘기가 없고 어디는 있냐" — 정확한
     지적. 같은 Section 안에서 첫 Sample(예: Badge blue, Checkbox Unchecked,
     Switch off)에만 R값을 적고 나머지 variant/state Sample은 "배경만 다름"
     식으로 생략했었는데, 실제로 화면에는 둘 다 똑같이 둥근 모서리가 보이니
     소비자 입장에서는 왜 한쪽만 적혀있는지 알 수 없는 게 당연함. 각 컴포넌트의
     실제 소스 파일에서 `rounded-mes-*`/`rounded-full` 클래스 유무를 전수
     재조사(`grep rounded-mes ui/*.tsx`)해서, 반지름이 있는 컴포넌트는 같은
     Section의 모든 Sample에 "R값"(원형인 Radio/Switch on 등은 "형태") 항목을
     예외 없이 추가 — Badge 5개/Checkbox 5개/Switch 3개/Radio 4개/Select 3개/
     Toast 1개/Button아이콘 3개/IconButton CloseButton 1개/UserAccountMenu/
     ToggleButton/NumberInput/PasswordInput/DatePicker/DateRangePicker/
     TimePicker 각 1개, 총 29곳. 이 조사 과정에서 두 가지 실수도 발견해 같이
     고침: Panel의 R값이 토큰 이름("rounded-mes-panel")만 적혀 있어 실제 px가
     안 보였던 것(→ 8px로 수정), Popover가 R값을 아예 안 적고 "Combobox 패널과
     동일값 재사용"이라고만 적어놨던 것(→ 8px 명시 + 그림자 항목 분리).
     "별도 padding값 없음"처럼 없는 개념을 굳이 설명하는 문장도 지적받아
     Button아이콘 3개 Sample에서 "높이 40px, 수직 중앙 정렬"로 단순화.
  2) "좌측만 알파벳순 정렬하고 메인은 안 하면 안 되지 않냐, 그래서 스크롤해도
     사이드바가 안 따라오는 것처럼 보인다" — 원인 파악: 사이드바(`COMPONENT_NODES`)는
     이미 `.sort()`로 티어 오름차순→라벨 알파벳순 정렬돼 있었는데(52차 이전에
     이미 반영됨), 그 아래 실제 `<Section>`/`<section>` JSX는 지금까지 작업한
     연대순 그대로 남아있었음 — 스크롤 스파이(IntersectionObserver, id 기반)
     자체는 정상 동작하지만, 화면을 순서대로 내려가며 activeId가 바뀔 때마다
     사이드바에서는 그 id가 리스트 위아래로 널뛰어 보였던 것(버그가 아니라
     두 순서의 불일치가 원인). 파이썬 스크립트로 TOC_LINKS/TIER_BY_ID/
     COMPONENT_NODES를 파싱해 실제 `.sort()`와 동일한 로직으로 목표 순서를
     계산하고, `<Section id="...">`/`<section id="...">` 마커 기준으로 64개
     물리 블록(Section 자체 + 뒤에 딸린 ConfirmDialog/CenterModal 등 부속
     컴포넌트까지 한 덩어리로 포함)을 잘라내 목표 순서대로 재배치— Foundation
     구간(color-palette~grid-container)은 이미 사이드바 순서와 일치해서 안 건드림.
     Button/Table처럼 브랜치로 묶인 항목은 내부 순서(사이즈→아이콘→컬러 등)를
     유지한 채 그룹째로 정렬 위치에 배치. 재배치 후 126개 Sample spec 전수 재확인
     (0개 누락) + tsc 클린 확인. "Button 바로 아래 IconButton을 배치한 이유는
     개념적으로 가장 가까운 이웃이라서"라던 기존 주석은 이제 사실과 달라져서
     정렬 규칙을 설명하는 내용으로 교체, Components 헤더 바로 위에도 앞으로
     컴포넌트를 추가할 때 이 순서를 어떻게 유지해야 하는지 신규 주석 추가.
     tsc 클린 확인 후 커밋.
- (2026-08-03, 55차 직후 긴급 수정) 배포 직후 브라우저에서 React 경고 발생:
  "Encountered two children with the same key, `R값`". 원인: 55차의 R값
  일괄 삽입 스크립트가 `spec={[...]}` 배열의 닫는 괄호를 `\n          ]}`
  (줄바꿈+들여쓰기) 패턴으로 찾았는데, 일부 Sample은 항목이 1개뿐이라 배열이
  `spec={[{ label: "...", value: "..." }]}` 한 줄로 적혀 있었음 — 이 경우
  해당 Sample 자신의 닫는 괄호를 못 찾고 텍스트상 다음에 나오는 (전혀 다른)
  Sample의 닫는 괄호에 잘못 삽입됨. 그 결과 Checkbox·Checked·gray/black,
  Switch·disabled(off)/disabled(on) 4개는 의도한 R값이 아예 안 들어갔고,
  그 자리에 들어갔어야 할 값들이 각각 엉뚱하게 뒤쪽의 Checkbox·Disabled(판단값)
  Sample과 Textarea·Default(placeholder) Sample에 중복으로 쌓여 `label:"R값"`
  키가 3번씩 겹치는 사고가 남. 정규식으로 "각 Sample 블록 안에 label이 두 번
  이상 등장하는 키가 있는가"를 전수 검사해 정확히 이 2곳(Checkbox Disabled,
  Textarea Default)을 찾아내고, 이번엔 "의도한 값이 실제로 그 라벨의 Sample
  블록 안에 들어있는가"까지 교차검증해서 놓친 4곳도 함께 찾아 정확한 자리에
  옮겨 넣음. 교훈: 스크립트로 JSX 배열에 항목을 삽입할 때 배열 포맷(한 줄 vs
  여러 줄)이 섞여 있으면 텍스트 패턴 매칭만으로는 위험 — 다음에 비슷한 일괄
  삽입을 할 땐 항상 "삽입 후 의도한 자리에 실제로 들어갔는지" 재검증 스크립트를
  같이 돌릴 것. tsc 클린 확인 후 커밋.
- (2026-08-03, 56차) 담당자 지시로 전수검증 + 문서 정리 진행.
  1) **전수검증**: `<Sample>` 126개 spec 존재/중복 key 0건, `<Section>` id 75개 중복
     0건, `TOC_LINKS`와 실제 렌더 id 1:1 일치, Components 물리 순서가 `COMPONENT_NODES`
     정렬 결과와 정확히 일치함을 스크립트로 재확인. tsc 클린(eslint 전체 실행은 이
     샌드박스에서 45초 제한을 넘겨 완주 못 함 — 기존에도 알려진 제약, tsc+구조검증
     스크립트로 대체).
  2) **문서 정리**: "AGENTS.md에 쓸데없는 내용 있으면 지우고 말 긴 데는 축약해라"
     지시. 존재하지 않는 `CLAUDE.md`를 같이 갱신하라는 안내 문구(사실과 다름) 제거,
     "Table 컴포넌트 작업 회고"의 1~8차 라운드별 장문 서술(134줄, 핵심 교훈은 이미
     별도 정리돼 있었음)을 라운드당 1~2문장으로 압축(약 20줄), "현재 진행 상태"
     헤더가 실제로는 갱신 안 된 채 두 번 중복돼 있던 것(각각 "최종 갱신:
     2026-07-30"/"2026-07-31"이라고 적혀 있었지만 그 뒤로도 40차 넘게 이어짐)을
     하나로 병합. 나머지 로그 본문은 지시대로 "살짝씩만" 손대고 원형 유지 — 재발
     방지 규칙/알려진 이슈/회고의 핵심 교훈처럼 향후 세션에 실질적으로 쓰이는
     내용은 안 건드림.
- (2026-08-03, 57차) 담당자 지적: "Center Modal/Side Slide Panel/Nested Modal이
  Button처럼 [Modal]이라는 상위 메뉴 밑에 묶여야 하는데 다 찢어져 있다". 실제로
  세 섹션 모두 클라우드MES "Modal" 스펙 페이지(node 9873:82872, Type01=Center/
  Type02=Side Slide) 기반이거나 그 둘을 조합한 2-depth 데모(Nested)라 한 컴포넌트
  패밀리가 맞음 — Button(사이즈/아이콘/컬러)·Table(분리/합본)과 동일하게 `branch()`로
  묶어야 했는데 그동안 각자 최상위 leaf로 흩어져 있었음. `TOC_LINKS`의 세 라벨을
  "Center Modal"/"Side Slide Panel"/"Nested Modal" → "Modal 중앙"/"Modal 사이드"/
  "Modal 중첩"으로 변경(Button/Table처럼 "{상위명} {구분자}" 형식이어야 `branch()`의
  stripPrefix가 정상적으로 하위 라벨을 뽑아냄 — 기존 라벨엔 "Modal "이 접두사 자리에
  없어서 그대로 뒀으면 stripPrefix가 무의미했음), `COMPONENT_NODES`에서 leaf 3개를
  `branch("Modal", ["center-modal","side-slide-panel","nested-modal"], "Modal")` 하나로
  교체(자식 순서는 알파벳이 아니라 Button 방식처럼 기본형→변형→합성 패턴 순으로 수동
  배치: 중앙→사이드→중첩). 각 섹션의 `<h2>` 표시 텍스트("Center Modal" 등)는 Figma
  컴포넌트 이름 그대로라 안 건드림 — 사이드바 표시만 바뀜, 요청 범위 밖 변경 안 함.
  묶은 결과 `COMPONENT_NODES.sort()`의 정렬 키가 3개 항목("Center Modal"/"Nested
  Modal"/"Side Slide Panel", 각각 알파벳순으로 다른 컴포넌트들 사이에 흩어짐)에서
  1개("Modal")로 바뀌어 전체 정렬 순서가 달라짐 — 55차와 동일한 방식(TOC_LINKS/
  TIER_BY_ID/COMPONENT_NODES를 파싱해 목표 순서 재계산 → `<Section id="...">` 마커
  기준 64개 물리 블록을 새 목표 순서로 재배치)으로 Components 영역 물리 순서를
  다시 동기화. 재배치 후 Sample 126개/중복 key 0건/Section id 75개 중복 0건/물리
  순서-정렬 결과 일치를 스크립트로 재확인, tsc 클린 확인 후 커밋.
- (2026-08-03, 58차) 담당자 지적: "이런 식으로 이름만 달라서 찢어진 게 아니라 성격이
  비슷한 애들도 마찬가지로 묶어야 한다". 임의로 "비슷해 보이는" 것끼리 묶지 않고,
  각 컴포넌트 소스 파일(`ui/*.tsx`)의 doc 주석에서 "OO(파일명)의 실측 스타일을 그대로
  재사용"/"OO를 그대로 감싸" 같은 명시적 재사용·래핑 관계가 적힌 것만 후보로 추림
  (반대로 Select/Combobox는 소스에 "별도 컴포넌트로 분리"라는 의도적 분리 사유가
  있어서 제외, Filter/GroupQuery/QuickQuery는 서로 재사용 관계가 없는 독립 컴포넌트라
  제외 — 이 판단 기준은 `COMPONENT_NODES` 위 주석에도 그대로 남겨둠). 후보를
  AskUserQuestion으로 제시해 담당자가 선택한 3개 그룹만 실행:
  1) **Input**(input/number-input/password-input) — NumberInput·PasswordInput 소스에
     "Input의 실측 스타일을 그대로 재사용" 명시.
  2) **Picker**(date-picker/date-range-picker/time-picker) — DateRangePicker가
     date-picker.tsx를 직접 import, TimePicker도 같은 트리거(Input)+패널(Popover)
     패턴 공유.
  3) **State**(empty-state/error-state) — "레이아웃은 동일, 아이콘 색만 다름"이 소스에
     명시(단, 코드상 두 컴포넌트를 하나로 합치라는 뜻은 아님 — 사이드바 표시만 묶음).
  TOC_LINKS 라벨을 Modal 때와 같은 "{상위명} {구분자}" 포맷으로 변경: Input→"Input
  기본"/"Input 숫자"/"Input 비밀번호", DatePicker/DateRangePicker/TimePicker→"Picker
  날짜"/"Picker 기간"/"Picker 시간", EmptyState/ErrorState→"State 없음"/"State 오류".
  DropdownMenu/UserAccountMenu(UserAccountMenu가 DropdownMenu를 그대로 감쌈)와
  Accordion/Collapsible(서로 명시적으로 대응 관계 언급)도 근거는 있었으나 담당자가
  이번엔 선택 안 해 보류 — 다음에 필요하면 같은 방식으로 다시 후보 제시.
  `COMPONENT_NODES`에서 leaf 6개(input/number-input/password-input, date-picker/
  date-range-picker/time-picker, empty-state/error-state)를 branch 3개로 교체,
  55차·57차와 동일한 방식으로 목표 정렬 재계산 → Components 영역 64개 물리 블록
  재배치. 재배치 후 Sample 126개/중복 key 0건/Section id 75개 중복 0건/물리 순서-
  정렬 결과 일치 재확인, tsc 클린 확인 후 커밋.
- (2026-08-04, 59차) 담당자가 "다음에 뭐 하면 되냐" 질문 — 체크리스트 19번 열려있는
  질문들을 먼저 해소하는 쪽으로 진행(티어3 59개 신규 착수보다 우선). 이 세션에서
  Figma live MCP(`get_metadata`/`get_design_context`/`search_design_system`)가 정상
  연결된 걸 확인해서 재시도: "FMS Make Metrics" 컬렉션이 실사용 컴포넌트(컴포넌트
  라이브러리/클라우드MES 라이브러리)와 무관한 별도 라이브러리("기본 디자인시스템",
  변수 설명에 "Target FMS UI... for Figma Make" 명시) 소속임을 `search_design_system`으로
  확인해 미사용 보일러플레이트로 확정(체크리스트/신규_컴포넌트_설계_프로세스.md 갱신).
  node 18887:62605(모달 갤러리)의 `get_metadata` SSE 파싱 에러는 이번에도 동일하게
  재현(재시도로 해결 안 됨 — 다음에 필요하면 담당자가 개별 자식 노드 URL을 직접
  지정해줘야 진행 가능). Checkbox/Radio disabled+checked 조합, Nested Modal 정확한
  구조는 `search_design_system`이 컴포넌트/변수 이름 검색이라 화면 인스턴스 탐색에는
  안 맞아 이번엔 해소 못 함. 나머지(Badge orange/yellow 이름, Warning/Success 데스크탑
  색 신설 여부, Breakpoint Scale 필요 여부, ConfirmDialog/RadioChoiceDialog
  radius·shadow 통일 여부)는 담당자만 판단 가능한 디자인 결정이라 AskUserQuestion으로
  확인 요청, 답변 받은 대로 처리:
  1) Badge orange/yellow — 확인해보니 2026-07-29에 이미 코드에서 grayFill/blue2로
     개명 완료된 상태였음(체크리스트만 미갱신). 체크리스트만 바로잡음, 코드 변경 없음.
  2) Breakpoint Scale — "화면(템플릿) 단위에서나 필요한 거 아니냐"는 담당자 반문이
     맞는 판단이라 확인해주고, 템플릿 작업 시작 시점까지 보류로 체크리스트에 확정.
  3) ConfirmDialog/RadioChoiceDialog — "그대로 유지"로 확정, 변경 없음.
  4) Warning/Success 색 — 담당자가 "모바일과 같은 값 그대로 사용"으로 결정. 확인해보니
     Warning(코드상 Yellow)은 2026-07-30에 이미 데스크탑 전용 레퍼런스 프레임(node
     20170:67850)으로 확정돼 `globals.css`에 반영까지 끝나 있었음(체크리스트만
     미갱신 — 마침 담당자가 고른 "모바일과 같은 값"과 우연히 일치하는 값이 이미 있었음).
     Success는 데스크탑에 끝내 없어서 신규 추가: `globals.css`에 `--mes-success-10~110`
     (모바일 체크리스트 0-1절 확정값 그대로) + 시맨틱 토큰(`text-success`,
     `border/bg-success-subtle`, `icon-success`, Danger/Warning과 동일 패턴) 추가,
     `page.tsx` 색상 팔레트 섹션에 `SUCCESS_PALETTE` 행과 시맨틱 토큰 표에도 반영.
     아직 실사용 컴포넌트는 없음(선제 정의만, 필요해지면 ConfirmDialog `tone="success"`
     등으로 확장 — 이번 요청 범위 밖이라 손 안 댐). Badge blueLight/blueOutline 용도는
     "실사용 화면 확인 필요"로 여전히 열려있음(질문에 포함 안 함 — 예/아니오로 답할
     수 있는 질문이 아니라 담당자 도메인 지식이 따로 필요). tsc 클린 확인 후 커밋.
- (2026-08-04, 60차) node 18887:62605 에러를 설명하다가 Nested Modal 얘기가 나오자
  담당자가 근본적인 질문: "이게 따로 컴포넌트화가 필요한 걸까? 모달 뜨면 뒤에 배경
  딤 깔린다는 것만 정의돼 있으면 모달을 몇 개를 겹쳐 열어도 문제없는 거 아니냐,
  없는 걸 만들어내면서까지 그래야 하나?" — 코드로 확인한 결과 이 판단이 정확했다.
  `confirm-dialog.tsx`/`center-modal.tsx`/`side-slide-panel.tsx`/`radio-choice-dialog.tsx`
  전부 Radix Dialog 기반에 오버레이·컨텐츠가 동일하게 `z-50`이라, 여러 개를 동시에
  열면 Radix Portal이 DOM에 붙는 순서(=연 순서)대로 자동으로 위에 쌓인다. "Nested
  Modal"은 애초에 별도 컴포넌트가 아니었고(2026-07-31에 만든 것도 그냥 ConfirmDialog
  2개를 겹쳐 연 데모 섹션일 뿐), 별도 사이드바 항목으로 두는 게 오히려 "따로 만들어야
  할 컴포넌트"라는 오해를 준다는 담당자 판단에 따라 항목 자체를 삭제하기로 함(옵션:
  완전 삭제/"별도 아님" 명시만/유지 — 완전 삭제 선택).
  `page.tsx`에서: `TOC_LINKS`/`TIER_BY_ID`/`COMPONENT_NODES`의 `nested-modal` 참조 제거
  (Modal branch가 3종→2종: 중앙/사이드만 남음), `<section id="nested-modal">` 블록과
  거기 딸려있던 `<ConfirmDialog>` 3개, 관련 state 3개(`nestedModalOpen` 등) 전부 제거.
  삭제만으로는 물리 순서가 안 어긋남(제거는 순서를 안 바꿈, 재배치 스크립트 불필요) —
  스크립트로 재확인: Sample 126개 그대로(원래 nested-modal엔 Sample 없었음), Section id
  75→74개(전부 유일), 물리 순서-정렬 결과 일치. 체크리스트 15번/19번의 관련 항목도
  "질문 자체가 무의미해짐"으로 갱신. tsc 클린 확인 후 커밋.
- (2026-08-04, 61차) 담당자가 이 프로젝트 목적(컴포넌트 라이브러리 구축 → AI 바이브코딩
  참고 컨텍스트)과 티어 분류 근거를 되짚어 묻다가 세 가지를 지적:
  1) 티어 1~5 분류가 누구 판단이었는지 — 솔직히 답함: 에이전트가 4개 기준으로 임의
     분류한 초안이고, 담당자가 항목별로 확정 검수한 적은 없음(체크리스트 자체에도
     "이 선별안은 초안"이라고 적혀 있었음).
  2) "말도 안 되는 UI는 필요 없다, 범용성이 있어야 한다" — 티어3·4(아직 미착수, 78개)를
     지금 다시 거르는 게 나중에 빼는 것보다 싸다는 점 안내, 다음에 필요하면 재검토
     라운드 진행하기로.
  3) **"ConfirmDialog랑 RadioChoiceDialog는 같은 dialog인데 왜 따로 있냐, 화면 이름이
     전부 영어라 UX를 전혀 고려 안 했다"** — 가장 크게 작업한 부분. RadioChoiceDialog
     소스 주석을 다시 보니 애초에 "실제 삭제 용도로 쓸 땐 title/question/options/
     actions 텍스트만 갈아끼우면 된다"고 변형 가능한 패턴으로 설계돼 있었음 — 담당자
     말대로 "같은 계열의 변형"이 맞았고, 그렇게 안 보인 건 순전히 영어 이름 때문.
     다만 "개념적으로 비슷하면 사이드바에서도 묶자"는 제안에는 담당자가 "무슨 기준으로
     판단할지 모르겠다"고 반려 — 코드 재사용 관계가 없는 것끼리는 여전히 안 묶음
     (57·58차에 세운 "소스에 재사용 근거가 명시된 것만 묶는다" 원칙 유지, 이번에
     느슨하게 풀지 않음). 대신 표기 방식을 바꾸기로 확정: "원래 위치에는 한국어,
     그 아래 한국어보다 살짝 작은 글씨로 영문 병기".
     구현: `Section` 컴포넌트에 `titleEn?` prop 추가(제목 아래 회색 작은 글씨 줄),
     `<Section title="Y">` 51곳을 정규식 스크립트로 일괄 치환(예: `title="확인 모달"
     titleEn="ConfirmDialog"`), `<Section>` 래퍼를 안 쓰는 raw `<section>` 12곳(개별
     데모 레이아웃이라 구조가 다 달라서 손으로 하나씩)도 동일한 2줄 형식으로 교체.
     `TOC_LINKS`도 `{id, label, labelEn}` 구조로 바꿔 사이드바 라벨도 똑같이 한국어
     메인+영문 보조 2줄로(Foundation 8개 항목은 코드 컴포넌트 파일과 1:1 대응이 아니라
     범위에서 제외, 기존 한국어 라벨 그대로 유지). `branch()` 함수는 기존 "stripPrefix
     문자열에서 접두어 잘라내기" 방식이 필요 없어져서(TOC_LINKS가 이미 짧은 한국어
     라벨을 직접 갖고 있음) `branch(labelKo, labelEn, ids)` 시그니처로 단순화, 6개
     호출부(Button/Input/Modal/State/Picker/Table) 전부 한국어 부모 이름(버튼/인풋/
     모달/상태/피커/테이블)으로 교체. 검색 드롭다운(`ALL_SEARCHABLE_ITEMS`)도 영문
     라벨까지 검색 대상에 포함시키고 결과에도 2줄로 표시.
     라벨이 전부 한국어로 바뀌면서 `COMPONENT_NODES.sort()`의 로케일 비교 기준도
     `"en"`→`"ko"`로 변경(가나다순이 정확해짐) — 이 때문에 정렬 결과가 또 달라져서,
     이번엔 Python이 아니라 **Node.js로 직접 실제 `.sort()`+`localeCompare(..., "ko")`
     를 실행**해 목표 순서를 뽑아냄(Python은 ICU 가나다 정렬을 정확히 재현 못 해서
     신뢰 불가 — 55·57·58차 때는 영문 비교라 Python replica로 충분했지만 이번엔 실제
     JS 엔진 실행이 필요했음). 그 목표 순서로 Components 영역 63개 물리 블록 재배치.
     재배치 후 Sample 126개/중복 key 0건/Section id 74개 중복 0건/물리 순서-정렬 결과
     일치 재확인, tsc 클린 확인 후 커밋. 코드 파일명(`confirm-dialog.tsx` 등)은 안 건드림
     — 개발자 참조용이라 화면에 안 보이고, 바꾸면 오히려 git 이력 추적에 방해.
- (2026-08-04, 62차) 담당자 요청 3가지: "우상단 검색을 좌측 리스트 최상단으로 두고,
  한 페이지에 스크롤 개길게 하지 말고 약간 분할을 하자, 브레드크럼으로".
  1) 검색창 이동: 헤더 우측 상단 Popover 검색을 `<aside>` 사이드바 리스트 맨 위로
     그대로 옮김(기능 동일 — 사이드바 자체는 필터링 안 하고 검색창 밑에 콤보박스형
     결과 드롭다운).
  2) 페이지 분할: 지금까지 Foundations 8개 + Components 63개(71개 항목)를 전부 한
     페이지에 렌더링하고 앵커(`#id`)로 스크롤 이동하던 구조를, 항목당 실제 라우트
     (`/foundations/{id}`, `/components/{id}`)로 전환. 이 프로젝트가 GitHub Pages
     정적 export(`output: "export"`, next.config.ts, 24차)라 서버가 없다는 게 핵심
     제약 — 동적 라우트([...slug])는 빌드 시점에 `generateStaticParams()`로 만들
     경로를 전부 알려줘야 하는데, 이 함수는 서버 컴포넌트에서만 쓸 수 있고 기존
     페이지는 "use client" + 훅 범벅이라 같은 파일에 못 둠. 그래서 3개 파일로 분리:
     - `src/lib/sidebar-data.ts`(신규): TOC_LINKS/COMPONENT_NODES/TOP_NAV 등 JSX 없는
       순수 데이터·함수만 페이지 파일에서 뽑아냄 — 서버·클라이언트 양쪽이 씀(중복 방지).
     - `app/[...slug]/page.tsx`(신규, 서버): `generateStaticParams()`로 경로 73개(그룹
       루트 2 + 항목 71) 나열, `client-page.tsx`를 렌더링만 함.
     - `app/[...slug]/client-page.tsx`(기존 `app/page.tsx` 전체를 옮김): 실제 화면.
       `useParams()`로 현재 slug를 읽어 `activeId`/`activeGroup` 파생(스크롤 위치
       기반 IntersectionObserver 추적은 제거 — 더 이상 필요 없음). `/components`처럼
       구체적 id가 없는 그룹 루트는 그 그룹 첫 항목을 기본으로 보여줌.
     - `app/page.tsx`(신규, 얇은 서버 컴포넌트): "/"는 캐치올이 못 받아서 별도로
       `/foundations`로 즉시 리다이렉트.
     - 렌더링은 "현재 activeId가 아니면 언마운트"가 아니라 **CSS `hidden` 처리**로
       구현(51곳은 `Section` 컴포넌트 하나에 새 `ActiveIdContext`를 배선해서 자동
       적용, 19곳 raw `<section>`은 각각 className에 조건부 `hidden` 추가) — 다른
       항목으로 이동해도 각 데모의 내부 상태(useState)가 유지되고, Sample 레지스트리
       (`RightRail`용)도 계속 채워짐.
     - 사이드바 leaf/branch, 상단탭(TOP_NAV), 검색결과의 `href="#id"` 앵커를 전부
       `next/link` `Link` + 실제 경로로 교체.
  3) 브레드크럼: 메인 상단에 새로 추가 — 디자인 시스템 자체 컴포넌트인 `Breadcrumb`
     (id="breadcrumb" 데모와 동일 컴포넌트, 코드 재사용)를 그대로 갖다 써서 "Home >
     Foundations/Components > (브랜치가 있으면 그 이름) > 현재 항목" 표시, 클릭하면
     `router.push`로 실제 이동.
  검증: `npx tsc --noEmit` 클린(4개 변경 파일 전부 프로그램에 포함되는 것까지
  `--listFiles`로 확인). `npm run build`는 기존과 동일하게 샌드박스 Bus error로
  로컬에서 끝까지 못 돌림(코드와 무관 — 24차 이후 계속 문서화된 한계, tsc로 대체
  검증). 로컬 커밋(`ea79d6d`)까지 완료, push는 담당자가 GitHub Desktop으로.
- (2026-08-04, 63차) 62차에서 그룹 루트(`/foundations`, `/components`)를 "그 그룹 첫
  항목을 바로 보여주기"로 구현했더니 담당자가 SEED 디자인 시스템 사이트 스크린샷을
  보여주며 지적: "화면 구분이 되게 애매한데, 이런 느낌으로 카드 그리드로 좀 구분지을
  수 있지 않나(다크 말고 라이트로)". 두 가지 확인 후 진행:
  1) 카드 안에 실제 컴포넌트 미니 미리보기까지 넣을지, 이름+티어뱃지만 넣을지 →
     "이름 + 티어뱃지만"(미리보기는 71개 전부 만들면 시간이 오래 걸림, 나중에 추가
     가능).
  2) Components 루트에만 적용할지 Foundations도 같이 할지 → "둘 다".
  구현: 그룹 루트에서 "첫 항목 기본 표시" 로직을 제거하고, `activeId`를 `string |
  undefined`로 바꿔 "구체적 항목이 없는 상태"를 정직하게 표현(그러면 모든 Section/
  raw section의 `hidden` 조건이 자동으로 전부 hidden 처리됨 — 이미 62차에 심어둔
  조건부 렌더링을 그대로 재사용, 별도 수정 불필요). 새 `OverviewGrid`/`OverviewCard`
  컴포넌트가 `SIDEBAR_GROUPS`와 같은 데이터(`FOUNDATION_NODES`/`COMPONENT_NODES`)를
  그리드로 펼쳐서 보여줌 — branch(버튼/인풋/모달/상태/피커/테이블)는 하위 항목마다
  "버튼 — 사이즈"처럼 상위 이름을 붙여 카드화(펼쳐서 보여주는 자체 로직, 기존
  `flattenSidebarNodes`는 이 접두어 병합을 안 해서 새로 작성). 카드 클릭 시
  `idToHref`로 실제 항목 페이지 이동. 브레드크럼도 "구체적 항목 없음" 상태를 반영해
  이때는 "Home > Foundations/Components" 2단계만 표시(3번째 크럼 생략).
  검증: `npx tsc --noEmit` 클린. `npm run dev`로 로컬 서버 기동을 시도했으나 샌드박스
  리소스 제약으로 12초 내 응답 없음(기존에도 `npm run build`가 Bus error로 안 되던
  것과 같은 계열 한계로 판단 — 새 문제 아님) — tsc 클린으로 대체 검증.
- (2026-08-04, 64차) 63차 배포 직후 담당자가 실제로 로컬에서 켜보고 버그 3개 리포트:
  1) "홈 가면 foundation 카드만 뜨고 컴포넌트는 안 떠" — 원인: `app/page.tsx`("/")가
     그냥 `redirect("/foundations")`였음(62차 때 만듦). 리다이렉트를 없애고 같은
     `ClientPage`(= `[...slug]/client-page.tsx`)를 "/"에서 직접 렌더링하도록 변경.
     `activeGroup` 타입에 `"home"`을 추가(`slug.length === 0`일 때) — 홈에서는
     Foundation 카드 그리드 + Components 카드 그리드를 둘 다 보여줌.
  2) "좌상단 'MES Design System' 누르면 홈으로" — 그냥 `<span>`이었던 걸 `NextLink
     href="/"`로 교체.
  3) "파운데이션에 radius 보고 있는데 하단에 컴포넌트들이랑 예정이 같이 뜨는거야" —
     실제 원인을 찾아보니 진짜 버그였음: Foundation/Components "구분자" 배너(28px
     큰 타이틀 + 설명문, 62차 이전부터 있던 요소)가 애초에 `activeGroup`과 무관하게
     항상 렌더링되고 있었음 — 62차에서 실제 컴포넌트 섹션들은 다 `activeId` 기준
     `hidden` 처리했는데, 이 두 배너 자체는 그 대상에서 빠뜨렸던 것. 그래서 Foundation
     항목을 보든 Components 항목을 보든 "Foundation" 배너 + "Components" 배너가
     둘 다 항상 보이고 있었음(radius를 볼 때 "Components" 배너 아래로 보였던 게 바로
     이것 — 실제 컴포넌트 데모 콘텐츠 자체는 정상적으로 숨어 있었음). 두 배너 각각에
     `(activeGroup === "foundations" || activeGroup === "home")` /
     `(activeGroup === "components" || activeGroup === "home")` 조건을 추가해 자기
     그룹(또는 홈)일 때만 보이도록 수정 — 카드 그리드(`OverviewGrid`)도 같은 조건
     안으로 옮겨서 일관되게 관리. 티어3/4 "예정" 안내 블록의 조건식도 이중부정
     (`!(A && !B)`)이라 헷갈리기 쉬워서 긍정문(`A !== "components" || Boolean(id)`
     → hidden)으로 다시 씀(로직 자체는 원래도 맞았음 — 담당자가 본 "예정"은 사실
     이 블록이 아니라 바로 위 Components 배너였을 가능성이 높음).
  검증: `npx tsc --noEmit` 클린. 이번에도 로컬 dev 서버로 직접 화면 확인은 샌드박스
  제약상 못 함 — 담당자가 로컬에서 재확인 필요.
- (2026-08-04, 65차) 64차가 실제로는 안 고쳐졌다는 스크린샷 리포트: "/components/date-
  range-picker"(브레드크럼 Home > Components > 피커 > 기간)를 보고 있는데도 "Components"
  배너와 "예정" 배너가 위에 같이 떠 있음. 64차에서 Foundation/Components 배너 2개는
  고쳤다고 생각했는데, 실은 **세 번째 배너가 하나 더 있었음** — 61차("'작업 필요' 구역
  사이드바/메인에 미리 생성")에 추가된, Components 목록 물리적 순서 중간(정확히는
  `sticky-header-footer` 섹션 바로 앞)에 끼워져 있던 별도의 "예정" 배너
  (`<Hammer>` 아이콘, `border-mes-gray-60`)를 완전히 놓치고 있었음 — 64차에서
  `border-l-8` 배너를 찾을 때 Foundation/Components 2개만 찾고 grep으로 전체 재검증을
  안 해서 발생한 실수. 이 배너에 `activeGroup === "components" && !activeId` 조건 추가
  (맨 아래 upcoming-tier3/4 EmptyState 두 개와 동일 조건 — 원래 이 배너도 그 둘과
  세트로 "Components 개요를 볼 때만" 보이는 게 맞음). 이번엔 `grep border-l-8`로 파일
  전체를 다시 훑어서 배너가 정확히 3개(Foundation/Components/예정)뿐이고 셋 다 조건이
  걸려 있는 것까지 확인. `npx tsc --noEmit` 클린.
- (2026-08-05, 66~69차) Patterns(3층: Foundations → Components → Patterns) 신규 구축.
  담당자가 클라우드MES Figma 파일의 "1차로 만들었던 화면 예시들" 보드(node
  20274:73333, 25~30개 화면)를 가리키며 "이거를 패턴으로다가 등록해봐"라고 요청 —
  보드 전체는 `get_metadata`가 SSE 파싱 에러(대형 노드 재현, Figma재현 문서 사례와
  동일 계열)로 실패해서, "몇 개씩 끊어서 등록"으로 담당자와 합의 후 개별 프레임
  링크 4개를 받아 1차 배치로 진행.
  - 66차: 라우팅 인프라. `sidebar-data.ts`에 `PATTERN_ID_LIST`/`PATTERN_NODES` 3개
    (리스트형 등록 모달/검사 체크리스트 모달/그룹화 리스트 관리 화면) 추가,
    `SIDEBAR_GROUPS`/`TOP_NAV`/`idToHref`/`BREADCRUMB_MAP`을 Foundations/Components
    2분기에서 3분기로 확장. `client-page.tsx`의 `activeGroup`도 `"patterns"` 추가,
    Foundation/Components 배너와 동일한 구조의 Patterns 구분자 배너 신설(64~65차에서
    고친 "배너가 조건 없이 항상 뜨는" 버그를 처음부터 안 만들도록 같은 조건 패턴 적용).
  - 67차: 패턴 1 "리스트형 등록 모달"(공정 등록 node 19414:94157, 작업지시 등록 node
    19098:64815) — `CenterModal` + 기존 Input/Button/Radio/Table/SearchInput/Badge로
    구성. 신규 헬퍼 `PatternFieldRow`(라벨 100px+인풋 한 줄) 추가.
  - 68차: 패턴 2 "검사 체크리스트 모달"(공정검사, node 19414:93662) — 좌측 대상정보
    폼(13개 필드, "*" 표시가 hidden 속성으로 켜진 4개만 필수로 정확히 반영) + 우측
    검사항목 O/△/X/− 4단 토글(신규 `QaToggleGroup`, 이전 세션에 이미 확보해둔
    IconQaO/IconQaTriangle/IconQaX 재사용 — 이게 이 패턴을 신규 아이콘 없이 완성할
    수 있었던 근거). 신규 헬퍼 `PatternGroupHeader`(회색 필 섹션 제목) 추가.
  - 69차: 패턴 3 "그룹화 리스트 관리 화면"(메인 리스트, node 17000:39999) — 이 노드는
    `get_metadata`가 76,712자를 반환해 도구 처리 한도를 넘김(SSE 실패가 아니라 순수
    크기 문제라는 점에서 66차 보드 전체 실패와는 다른 원인) — 스크린샷 기반 판단값
    구현으로 전환(프로젝트 기존 관례, GroupQuery/QuickQuery 때와 동일). 신규
    컴포넌트를 만들지 않고 Sidebar(접힘 레일)+PageTopTabItem+DateRangePicker+
    GroupQuery+Filter+QuickQuery+SearchInput+Table을 한 화면으로 합성 — 이 페이지에
    이미 있는 컴포넌트 데모들의 state를 그대로 재사용(사이드바 접힘 여부만 다른
    Section과 결합 방지 목적으로 별도 로컬 state 추가). Table에 쓰인
    `productionColumns`/`productionGroups` 데이터 자체가 애초에 이 계열("생산실적/
    생산지시") 화면 스크린샷에서 나온 값이었다는 것도 이번에 재확인.
  공통: 각 단계마다 Figma metadata를 다시 조회해서 씀(이전 세션 요약 재사용 안 함 —
  `AI_에이전트_구조적_한계_기록.md` 3번 "그 순간엔 알았지만 코드 짤 때 다시 안 씀"
  재발 방지), 판단값/대체값은 전부 JSX 주석에 "왜 대체했는지" 남김, 각 차수마다
  `npx tsc --noEmit` 클린 확인 후 개별 커밋. 로컬 브라우저 렌더링 확인은 이번에도
  샌드박스 제약상 불가 — 담당자 재확인 필요.

# 디자인 시스템 레지스트리와 시각 회귀 검사 (2026-08-10)

새 화면 또는 패턴 작업을 시작하기 전에 `component-library/src/design-system/registry/`를 먼저 조회한다.

AI 화면 조합의 공통 기준은 `docs/AI_UI_조합_문법_공통정책.md`와 `component-library/src/design-system/registry/composition-policy.json`이다. 2026-08-12 복수 `patternRefs`와 Shell·Section·Behavior·ActionSet 이관은 완료됐다. 이후 새 충돌이 발견되면 이미 종결된 이관을 되돌리지 말고 새 `migrationHolds` 항목으로 분리해 사용자 승인과 마이그레이션 계획 없이 구조를 변경하지 않는다.

`src/components/patterns/*.tsx`를 추가·수정하면 `npm run audit:composition`으로 관찰 인벤토리를 갱신한다. 자동 탐지 인벤토리는 `observed-not-canonical`이지만, 승인 결과가 `patterns.json`에 등록된 Section·Behavior·ActionSet은 표준으로 사용할 수 있다. 새 자동 탐지 후보만 사용자 승인 전까지 표준으로 사용하지 않는다.

1. `screens.json`에서 가까운 MES 화면을 찾는다.
2. 화면의 현재 `patternRefs`와 가장 가까운 shell·section·behavior·action-set 후보를 `patterns.json`에서 조회한다.
3. 후보 패턴의 `requiredComponents`와 각 컴포넌트의 `source`/`rules`를 `components.json`에서 확인한다.
4. 기존 조합과 요구사항의 차이를 `reuse`, `compose`, `extend`, `propose-new`, `normalize` 중 하나로 판정한다.
5. 기존 컴포넌트로 표현할 수 없는 차이만 optional prop 또는 variant로 확장한다.
6. 작업 후 `npm run check:design-system`, `npx tsc --noEmit`, `npm run lint:design-system`, `npm run test:visual`을 실행한다.

활성 `src/components/ui/*.tsx` 파일은 전부 레지스트리에 등록해야 한다. 화면과 pattern은 1:1 관계가 아니며, 화면은 shell·content·behavior 패턴을 하나 이상 조합할 수 있다. 등록된 컴포넌트를 사용했다는 사실만으로 디자인 시스템 준수로 판정하지 않는다. 코드 작성 전에 기존 패턴 후보와 차이를 비교해 `reuse`, `compose`, `extend`, `propose-new`, `normalize` 중 하나로 판단 근거를 남긴다. 미승인 `extend`와 `propose-new`, 임의 wrapper·정보 위계는 표준 레지스트리에 넣지 않고 생성 시안 검토함에 격리한다. 신규 패턴과 기존 패턴의 의미 변경은 AI가 스스로 승인하지 않는다. 의도한 시각 변경이 아니면 기준 PNG를 갱신하지 않는다. 상세 절차는 `docs/AI_MES_화면_생성_아키텍처.md`, `docs/AI_생성화면_평가_및_승격_규칙.md`, `docs/디자인_시스템_레지스트리_및_시각회귀_테스트.md`를 참고한다.
