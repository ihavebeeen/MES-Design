"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox, type CheckboxColor, type CheckboxUncheckedAppearance } from "./checkbox";
import { IconArrow } from "../icons/icon-arrow";

/**
 * MES Table (표) — Figma 실측 기반 1차 + 실제 화면 스크린샷 기반 2차 피드백 반영
 *
 * 출처: 클라우드MES 파일(F4n5Zr04PAbiRjfIFQAo6v)
 * - 원본: node 9873:83780("Table") — Header/Body 상태별 매트릭스 정의부
 * - 수정본(실제 화면): node 16938:42501("생산계획(일) 리스트") — 담당자가 "테이블 디자인
 *   수정"으로 지목한 실제 사용 화면.
 * - 2026-07-28 2차: 담당자가 실제 운영 화면("생산실적" 그룹화 조회, Figma 아님 — 실제
 *   서비스 스크린샷)을 보여주며 지적한 5건 반영. 이 스크린샷은 Figma가 아니라 실제 배포된
 *   화면이라 정확한 hex/px를 도구로 뽑을 수 없음 — 아래 명시된 값들은 스크린샷 육안 대조
 *   기반 판단값이며, 실측 아님을 각 항목에 표시함.
 *
 * ── 1. 담당자가 지적한 수정본과 원본의 차이(1차, 실측으로 확인) ─────
 * - 헤더 배경에 색 추가: Gray-10(#F8FAFC) — 원본엔 없던 배경색(재확인 필요하나 수정본
 *   기준 확정 채택)
 * - 세로 구분선 추가: 각 셀 우측에 점선(border-dashed) 1px, 기본 Gray-40(#D7DCE5)
 * - "이번 세션에서 추가된 정보"에 빨간 점(6x6 Ellipse, node 17061:41475) — 벡터라 정확한
 *   hex는 get_variable_defs로도 못 뽑았고(바인딩된 변수 없음), 스크린샷 기준 Danger-60
 *   (#F04452)으로 판단(다른 곳의 "system-red60" 참조와 시각적으로 일치)
 * - 강조행(선택됨/신규) 구분선이 기본 Gray-40보다 한 단계 진한 Gray-30(#E4E7EE)으로
 *   바뀜을 3개 행 실측 대조로 확인: 선택행(bg Primary-20)·신규행(빨간점) 둘 다 Gray-30,
 *   일반행만 Gray-40 — 담당자가 언급 안 한 부분이지만 실측 중 발견해 반영
 *
 * ── 2. 담당자가 지적한 2차 피드백 5건과 반영 내용 ────────────────────
 * (1) "2·3차 그룹화도 가능해야 함" → `TableGroup.groups`로 재귀 중첩 지원(깊이 제한 없음,
 *     실제 화면처럼 생산일→공정→담당자 3단 구성 가능). 그룹 배경색은 깊이(depth)별로
 *     `groupLevelColors` prop(기본값 3단계)에서 가져옴 — 실제 화면 스크린샷 육안 대조로
 *     depth0=연한 핑크(`#fde9ea`, 기존 1차에서 이미 확정값), depth1=중간 톤 파랑
 *     (`#dbe9ff`), depth2=아주 옅은 파랑(`#eef5ff`)으로 판단(실측 아님 — 정확한 값 필요시
 *     devtools로 재확인 후 `groupLevelColors` prop으로 교체 가능하게 열어둠). 4단 이상은
 *     depth2 색이 반복됨.
 * (2) "그룹 합계열이 헤더 컬럼 위치와 안 맞음" → 원인 파악: 그룹행/총계행에서 펼침
 *     화살표+라벨을 별도의 폭-고정 안 된 `<button>`으로 렌더링해서, 그 다음에 오는
 *     `columns.map(Cell)`들이 전부 라벨 텍스트 길이만큼 밀렸던 게 버그였음. 수정: 화살표
 *     +라벨을 "첫 번째 컬럼의 Cell 안"에 넣고(`overflow-visible` + `whitespace-nowrap`로
 *     텍스트가 길면 다음 빈 셀 위로 시각적으로만 넘치게 처리) 두 번째 컬럼부터는 일반
 *     데이터 행과 완전히 동일한 `columns.map(Cell)` 구조를 그대로 사용 → 헤더/데이터행/
 *     그룹행/총계행이 전부 같은 Cell 폭 배열을 공유해서 구조적으로 어긋날 수 없게 만듦.
 * (3) "그룹 영역에도 체크박스+중간선택(indeterminate) 필요" → 각 그룹 헤더 행에 체크박스
 *     추가(해당 그룹 하위 모든 행 id를 재귀로 모아서 전체선택/부분선택/미선택 판정).
 *     `Checkbox` 컴포넌트 자체에 `indeterminate` prop이 없어서 이번에 새로 추가함
 *     (Figma에 없는 상태라 실측 아닌 판단 구현 — `checkbox.tsx` 주석 5번 참고). 최상단
 *     "전체선택" 체크박스도 동일하게 indeterminate 지원하도록 같이 개선.
 * (4) "총계행도 컬럼 위치 맞아야 함" → (2)와 같은 원인/같은 방식으로 수정("총계" 라벨을
 *     첫 컬럼 Cell 안으로 이동).
 * (5) "컬럼명 정렬이 제멋대로" → 원인: 헤더 셀 렌더링 시 `column.align ?? "center"`로
 *     기본값을 항상 가운데로 강제해서, 실제 데이터 셀(정렬 지정 없으면 좌측 기본)과
 *     따로 놀았던 게 버그였음. 수정: 헤더도 데이터 셀과 동일하게 `column.align`을 그대로
 *     사용(지정 없으면 좌측 기본)해서 헤더 텍스트 정렬 = 그 컬럼 데이터 정렬이 항상 일치
 *     하도록 통일. 데모 페이지의 각 컬럼 align 값도 실제 화면 기준(텍스트=좌측,
 *     코드/시간/단위 등 짧은 값=가운데, 숫자·금액=우측)으로 재조정함.
 *
 * ── 3. 공통 실측값(1차, 유지) ─────────────────────────────────────
 * - 행 높이 30px(헤더/그룹행/일반행/총계행 전부 동일), 각 행 좌우 padding 20px
 * - 체크박스 칼럼: 체크박스 24px + 우측 padding 12px, 이후 첫 데이터 컬럼 시작
 * - 헤더 텍스트: Pretendard SemiBold 13px, Gray-130, border-b Gray-30(정렬은 위 2-(5) 참고)
 * - 일반 셀 텍스트: Pretendard Regular 14px, Gray-130
 * - 링크형 셀(품목명/투입/라벨정보 등): Primary-60, 링크는 Regular 14px 밑줄, 액션형
 *   링크(투입정보/LOT조회)는 SemiBold 13px 밑줄로 서로 다름 — render prop으로 개별 처리
 * - 그룹행 집계값/총계행 값: SemiBold 14px 우측정렬(집계 없는 컬럼은 빈칸)
 *
 * ── 4. 체크박스 시각 차이(사소한 불일치, 판단으로 흡수) ───────────
 * Figma 원본의 표 전용 체크박스 아이콘("mes/icon-checkcyc")은 미선택 상태가 Gray-50
 * 채움 사각형인데, 기존에 실측 완성해둔 `Checkbox` 컴포넌트(checkbox.tsx)의 미선택
 * 상태는 흰 배경+Gray-40 테두리라 살짝 다름. 체크됨(검정) 상태는 완전히 일치(Gray-130
 * 채움) — 새로 컴포넌트를 안 만들고 기존 Checkbox를 그대로 재사용함(중복 구현 방지
 * 우선), 미선택 상태 불일치는 체크리스트에 등록.
 *
 * ── 5. 아직 미확인 (다음 라운드) ──────────────────────────────────
 * - 원본에 있던 "기본-disable", "분할", "분할-disable" 변형(node 9873:83780 하위) 중
 *   "기본-disable"은 2026-07-29 담당자가 정확한 값(텍스트 Gray-80, 배경 Gray-10)을 줘서
 *   `DataRow`에 반영 완료(기존 opacity-50 판단값 교체, 아래 9번 참고). "분할"/"분할-disable"은
 *   담당자도 정확히 뭘 가리키는지 특정 못 해서 여전히 보류.
 * - 그룹행 들여쓰기(depth당 20px)는 스크린샷 육안 대조 기반 판단값, 정확한 px 미확인
 *
 * ── 6. 2026-07-28 3차 피드백(같은 날, 2차 화면 재검토 후) 4건 ───────
 * (1) "체크박스가 겹쳐 보임" → 이때는 원인을 "펼침 버튼이 체크박스와 스타일이 비슷해서"
 *     라고 스스로 추측하고, 요청받지도 않은 채 펼침 버튼의 테두리·배경 박스를 제거해버림.
 *     ↓↓↓ 4차에서 이 판단이 틀렸다는 게 확인됨(아래 7번 참고) — 실제 원인은 스타일이
 *     아니라 위치/정렬 문제였을 가능성이 높음(체크박스 자체가 최좌측 고정이 아니었거나,
 *     헤더 마스터 토글 버튼이 체크박스보다 왼쪽에 있었던 것 등).
 * (2) "3단계 그룹화(생산일>설비>담당기사)가 안 됨" → 컴포넌트 자체는 1차 개편에서 이미
 *     `TableGroup.groups` 재귀 구조로 깊이 제한 없이 지원하고 있었음(2단만 데모했던 게
 *     문제) — 데모 페이지를 지시일→설비→담당기사 3단 중첩으로 재구성해서 실제로 3단계가
 *     동작함을 보여줌. 컴포넌트 로직 변경 없음.
 * (3) "접힘/펼침 회전이 90도가 아니라 180도여야 함" → 펼침 상태를 위쪽(rotate-90), 접힘
 *     상태를 아래쪽(-rotate-90)으로 바꿔서 두 상태가 정확히 180도(위⇄아래) 차이가 나도록
 *     수정(기존엔 왼쪽↔위쪽, 90도 차이였음).
 * (4) "그룹화 단계별로 헤더에서 한꺼번에 접는 버튼이 필요, 3단계면 3개" → 헤더 행 맨
 *     앞(체크박스 왼쪽)에 그룹 트리의 최대 깊이만큼(`getMaxGroupDepth`) 마스터 토글
 *     버튼을 렌더링. 버튼 하나당 해당 depth의 모든 그룹을 재귀로 모아서(`getGroupsAtDepth`)
 *     한꺼번에 접거나 펼침 — 그중 하나라도 펼쳐져 있으면 전부 접고, 전부 접혀있으면 전부
 *     펼침. 정확한 위치/스타일은 실제 화면(Figma 아님) 상단에 보였던 아이콘 배치를 육안
 *     대조한 판단값. (참고) 그 화면 최상단의 "Level 1/2/3 그룹 기준 컬럼 선택 바"(어떤
 *     컬럼으로 그룹화할지 고르는 UI) 자체는 여전히 범위 밖 — 이번엔 이미 정해진 그룹
 *     트리를 depth별로 한꺼번에 접고 펴는 버튼만 추가함.
 *
 * ── 7. 2026-07-28 4차 정정: 펼침 버튼 디자인은 "원본에서 더 멀어진" 임의 변경이었음 ──
 * 3차의 (1)에서 스스로 판단해 제거했던 펼침 버튼의 테두리·배경 박스가, 실제로는 원본
 * 디자인 값 그대로였다는 걸 담당자가 정확한 수치로 재확인시켜줌: **22x22px, 배경
 * Gray-0(`#FFFFFF`), radius 3px, 스트로크 Gray-50(`#B4C0D3`) inside 1px**. 요청받지
 * 않은 범위에서 "이게 더 원본에 가까울 것"이라고 스스로 판단한 게 실제로는 틀렸던
 * 사례 — 재발 방지 규칙 7번(요청 범위를 스스로 넓히지 않기)의 실제 근거. 그룹행 펼침
 * 버튼과 헤더 마스터 토글 버튼 둘 다 위 수치로 원상 복구함.
 *
 * ── 8. 2026-07-28 5차: `docs/Table_수정_대기목록.md` 1·2번 구조 버그 수정 ─────────
 * (1) 체크박스가 항상 최좌측·고정이어야 하는데 헤더의 depth별 마스터 토글 버튼이
 *     체크박스보다 왼쪽에 있었던 문제 → 순서를 [체크박스] → [마스터 토글 영역]으로 교체.
 * (2) 그 마스터 토글 버튼들의 폭(depth 수 × `MASTER_TOGGLE_SLOT_WIDTH`)만큼 그룹행/
 *     데이터행/총계행에는 여백이 없어서 헤더 컬럼과 바디 컬럼이 어긋났던 문제 → "체크박스
 *     → 마스터 토글 영역"을 헤더/그룹행/데이터행/총계행 전부가 공유하는 고정폭 블록으로
 *     취급해서, 헤더는 그 안에 실제 버튼을 그리고 나머지 행 종류는 정확히 같은 폭의 빈
 *     스페이서(`masterToggleAreaWidth`)를 렌더링하도록 통일 — 2차 때 세운 "여러 행
 *     종류가 새 요소를 반영할 땐 전부 같은 폭을 예약해야 한다" 원칙(재발 방지 규칙 6번)을
 *     이번엔 실제로 전체 행 종류에 다 적용함.
 * (3) (확인) "펼침 버튼 오른쪽에 라벨 텍스트가 안 보인다"는 지적은 코드상 원인을 못
 *     찾음 — `overflow-visible`/`whitespace-nowrap`로 라벨은 항상 렌더링되고 있고, 담당자
 *     본인도 "화면이 좁아서 그런 걸 수도 있다"고 언급했던 만큼 뷰포트 폭에 의한 시각적
 *     잘림으로 잠정 결론. 넓은 화면에서 다시 문제 재현되면 별도로 조사 필요.
 * (4) 데모 페이지의 Table 섹션 `max-w-[1100px]` 제약을 풀어서 전체 폭으로 표시(가로 스크롤
 *     여전히 필요할 수 있으나 컨테이너 제약으로 인한 불필요한 압박은 제거).
 * (5) 컬럼 폭 유연화: `TableColumn.width`가 숫자(고정 px)뿐 아니라 `{ min, grow? }` 형태도
 *     받을 수 있도록 타입 확장(하위호환 — 숫자면 기존과 100% 동일하게 동작). 어떤 컬럼을
 *     실제로 가변으로 바꿀지는 담당자 판단이 필요해서 이번엔 "기능만 추가"하고 데모 컬럼은
 *     전부 기존 고정값 그대로 둠.
 *
 * ── 9. 2026-07-28 6차: 5차 결과 재검토 3건 ──────────────────────────
 * (1) 헤더 마스터 토글 3개와 그룹행 자체의 depth별 펼침 버튼이 서로 다른 좌표계(헤더는
 *     고정폭 블록에 나란히, 그룹행은 라벨 앞 paddingLeft로 들여쓰기)를 쓰고 있어서 세로로
 *     안 맞았음 → 헤더/그룹행 모두 "폭 `MASTER_TOGGLE_SLOT_WIDTH`(24px) 슬롯을 depth 수
 *     만큼 나란히 두고, 자기 depth 슬롯에만 실제 버튼을 넣는" 동일 구조로 통일. 라벨의
 *     시각적 들여쓰기는 별도로 유지(`paddingLeft: depth*12`, 이제 라벨 전용).
 * (2) 신규행 빨간 점이 체크박스 왼쪽에 있던 것 → 체크박스 래퍼의 기존 pr-12 여백 안에
 *     `absolute`로 넣어 오른쪽으로 이동(1차 정정, 정확한 10px 간격은 10번에서 재수정).
 * (3) "정렬이 여전히 제멋대로" → 그룹/총계 라벨이 자기 컬럼의 align을 물려받아 라벨
 *     길이별로 시작 위치가 달라 보였던 게 실제 원인 중 하나 → 라벨 셀은 컬럼 align과
 *     무관하게 항상 좌측 고정. 데모 컬럼 `equipment`도 다른 짧은 값 컬럼들과 맞춰 가운데로
 *     통일.
 *
 * ── 10. 2026-07-28 7차: 6차 결과 재검토 3건 ─────────────────────────
 * (1) "빨간 점을 체크박스 우측 10px 지점에" → 체크박스 칼럼 자체의 폭을
 *     `CHECKBOX_COLUMN_WIDTH`(40px = 체크박스 24 + 간격 10 + 점 6)로 상수화하고 헤더/
 *     그룹행/데이터행/총계행 네 곳 전부 이 값을 쓰도록 통일. 이 과정에서 `TotalsRow`가
 *     `pr-[12px]`와 명시적 `width:24`를 같이 써서 실제로는 24px(다른 행의 36px과 불일치)
 *     만 차지하고 있던 잠재 정렬 버그를 같이 발견해 수정함.
 * (2) "숫자 컬럼명(헤더)이 숫자가 아닌데 왜 우측정렬이냐, 헤더는 가운데정렬 쌔려야지" →
 *     헤더 라벨 셀은 이제 컬럼의 `align`과 무관하게 항상 가운데 정렬로 고정(데이터 셀은
 *     기존대로 컬럼별 align 유지 — 숫자는 계속 우측). 2차에서 "헤더 align = 데이터
 *     align으로 통일"했던 것에서 다시 바뀐 것처럼 보이지만, 2차의 문제는 "정렬 안 지정한
 *     컬럼만 헤더가 가운데로 강제되던 불일치"였고 지금은 "헤더는 의도적으로 항상 가운데"
 *     라는 별개의 명시적 정책 — 데이터 셀 정렬 규칙엔 변화 없음.
 * (3) "숫자에 1000단위 콤마 넣어줘" → 데모 컬럼(`packCount`/`qty`/`defectQty`/`packQty`)에
 *     `toLocaleString("ko-KR")` 기반 `render` 추가, 그룹 집계값/총계도 동일 포맷.
 *
 * ── 11. 2026-07-29 비활성(disabled) 행 정확한 값 확정 ──────────────────
 * 5번 섹션에서 "기본-disable" 변형은 실측 못 해서 `opacity-50`으로 임시 처리해뒀었는데,
 * 담당자가 실제 화면 스크린샷 기준으로 정확한 값을 줌: 텍스트 Gray-80, 배경 Gray-10.
 * `DataRow`를 다음과 같이 수정: 행 배경을 `row.disabled ? "bg-mes-gray-10" : (선택 시
 * Primary-20, 아니면 흰색)` 순서로 결정(disabled가 선택 상태보다 우선), 셀 텍스트 색을
 * `row.disabled ? "text-mes-gray-80" : "text-mes-text-default"`으로 분기. 클릭/체크 상호작용을
 * 막는 `pointer-events-none`은 유지하되 `opacity-50`은 제거(더 이상 임시값이 아니므로
 * 불투명도로 뭉뚱그릴 필요 없음). "분할"/"분할-disable" 변형은 담당자도 정확히 뭘
 * 가리키는지 특정 못 해서 여전히 보류.
 */

export interface TableColumn<T> {
  key: string;
  label: string;
  /**
   * 숫자면 고정 px 폭(기존과 동일). `{ min, grow? }` 객체를 주면 가변폭 컬럼이 됨 —
   * `min`px 밑으로는 안 줄어들고, 남는 공간을 `grow`(기본 1) 비율로 나눠 가짐.
   * 2026-07-28 5차에서 타입만 확장함 — 실제로 어떤 컬럼을 가변으로 바꿀지는 담당자
   * 판단 필요, 데모는 아직 전부 고정폭 사용 중.
   */
  width: number | { min: number; grow?: number };
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

export interface TableRowData<T> {
  id: string;
  data: T;
  /** 이번 세션(또는 최근)에 추가/변경된 행 — 좌측에 빨간 점 + 진한 구분선 */
  isNew?: boolean;
  disabled?: boolean;
  /** 선택 열의 폭은 유지하되 해당 행의 체크박스만 숨긴다. */
  hideSelection?: boolean;
}

export interface TableGroup<T> {
  id: string;
  label: string;
  /** 컬럼 key별 집계값(합계 등). 없는 컬럼은 빈칸 */
  summary?: Record<string, React.ReactNode>;
  /** 리프 그룹(더 이상 하위 그룹 없음)일 때 실제 데이터 행 */
  rows?: TableRowData<T>[];
  /** 하위 그룹(2·3차 그룹화) — 지정하면 rows 대신 이쪽이 렌더링됨 */
  groups?: TableGroup<T>[];
  defaultExpanded?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  groups?: TableGroup<T>[];
  rows?: TableRowData<T>[];
  selectedIds?: string[];
  /** 체크 여부와 별개로 파란 활성 행을 지정한다. undefined면 기존처럼 선택 행이 활성 행이다. */
  activeId?: string | null;
  /** 표 안 체크박스의 기본 색. 활성 행은 원본 화면처럼 black을 우선한다. */
  selectionColor?: CheckboxColor;
  /** 미선택 체크박스 외형. MES 표에서는 회색 체크형을 사용한다. */
  unselectedCheckboxAppearance?: CheckboxUncheckedAppearance;
  /** 일부 행만 선택됐을 때 헤더의 indeterminate 표시 여부. */
  selectionHeaderIndeterminate?: boolean;
  /** 테이블 좌우 내부 여백. 기본 표는 20px, 화면 실측 표는 0px도 허용한다. */
  edgePadding?: number;
  /** 선택 열 전체 폭. 기본값은 신규 점까지 포함한 40px. */
  selectionColumnWidth?: number;
  /** 데이터 행 체크박스를 선택 열 가운데에 배치한다. */
  centerSelection?: boolean;
  /** 헤더/데이터 셀 사이 점선 구분선 표시 여부. */
  columnDividers?: boolean;
  /** 화면별 표 헤더 배경. 기존 표는 gray10, 흰색 헤더 원본은 white를 사용한다. */
  headerBackground?: "gray10" | "white";
  /** 내용이 넘칠 때 가로 스크롤을 허용할지 여부. */
  horizontalScroll?: boolean;
  /** 비활성 행 텍스트 색조. */
  disabledTextTone?: "gray60" | "gray80";
  /** 선택되지 않은 일반 행의 텍스트 색조. */
  unselectedTextTone?: "default" | "gray80";
  onSelectedIdsChange?: (ids: string[]) => void;
  /** 선택 기능이 없는 조회/요약 표에서는 체크박스 열 전체를 제거한다. */
  selectable?: boolean;
  /** Figma에서 전체선택 체크박스 대신 `선택` 텍스트를 쓰는 표의 헤더 라벨. */
  selectionHeaderLabel?: string;
  totals?: Record<string, React.ReactNode>;
  /** 그룹 depth(0부터)별 배경색. 기본값은 판단값 — 위 2-(1) 주석 참고 */
  groupLevelColors?: string[];
  /** 그룹 depth 일괄 접기 버튼 슬롯 표시 여부. 원본에 없는 화면은 false. */
  showMasterGroupToggles?: boolean;
  className?: string;
}

const DEFAULT_GROUP_LEVEL_COLORS = ["#fde9ea", "#dbe9ff", "#eef5ff"];

/** 헤더 마스터 토글 버튼 1개가 차지하는 폭(22px 버튼 + 2px 간격) — 헤더/그룹행/데이터행/
 *  총계행이 전부 이 폭만큼 동일하게 예약해야 컬럼이 어긋나지 않는다(5차 정정). */
const MASTER_TOGGLE_SLOT_WIDTH = 24;

/**
 * 체크박스 칼럼의 총 폭. 체크박스 24px + "신규" 빨간 점을 위한 여백 16px(체크박스
 * 오른쪽으로 10px 띄우고 6px 점 자체 폭) = 40px. 7차: 담당자가 "빨간 점을 체크박스
 * 우측 10px 지점에" 요청하면서 필요한 폭이 늘어나 상수화함 — 헤더/그룹행/데이터행/
 * 총계행 네 곳 전부 이 값을 그대로 써야 정렬이 안 어긋난다. 이 작업 중
 * `TotalsRow`가 기존에 이 칼럼을 24px로만 계산하고 있던(pr-12과 명시적 width:24가
 * 충돌해 border-box 기준 실제로는 24px만 차지하던) 잠재 버그도 같이 발견해 수정함.
 */
const CHECKBOX_COLUMN_WIDTH = 40;
/** 체크박스(24px) 오른쪽으로 "신규" 점까지의 간격 — 담당자 지정값 10px */
const NEW_DOT_GAP_FROM_CHECKBOX = 10;

/** 그룹(재귀) 하위의 모든 리프 행 id를 모음 — 그룹 체크박스 전체/부분 선택 판정용 */
function collectGroupRowIds<T>(group: TableGroup<T>): string[] {
  if (group.groups) return group.groups.flatMap(collectGroupRowIds);
  return (group.rows ?? []).map((r) => r.id);
}

function collectAllRowIds<T>(groups?: TableGroup<T>[], rows?: TableRowData<T>[]): string[] {
  if (groups) return groups.flatMap(collectGroupRowIds);
  return (rows ?? []).map((r) => r.id);
}

/** 그룹 트리의 최대 깊이(1부터, 그룹이 없으면 0) — 헤더의 depth별 일괄 접기 버튼 개수 산정용 */
function getMaxGroupDepth<T>(groups?: TableGroup<T>[]): number {
  if (!groups || groups.length === 0) return 0;
  return 1 + Math.max(0, ...groups.map((g) => getMaxGroupDepth(g.groups)));
}

/** 특정 depth(0부터)에 있는 그룹 전체를 재귀로 모음 — 그 depth "한꺼번에 접기" 버튼용 */
function getGroupsAtDepth<T>(
  groups: TableGroup<T>[] | undefined,
  targetDepth: number,
  currentDepth = 0
): TableGroup<T>[] {
  if (!groups) return [];
  if (currentDepth === targetDepth) return groups;
  return groups.flatMap((g) => getGroupsAtDepth(g.groups, targetDepth, currentDepth + 1));
}

function Cell({
  column,
  children,
  className,
}: {
  column: {
    width: number | { min: number; grow?: number };
    align?: "left" | "center" | "right";
  };
  children?: React.ReactNode;
  className?: string;
}) {
  const isFixed = typeof column.width === "number";
  return (
    <div
      style={
        isFixed
          ? { width: column.width as number }
          : {
              minWidth: (column.width as { min: number; grow?: number }).min,
              flexGrow: (column.width as { min: number; grow?: number }).grow ?? 1,
              flexBasis: 0,
            }
      }
      className={cn(
        "flex h-full items-center px-[6px]",
        isFixed ? "shrink-0" : "shrink",
        column.align === "center" && "justify-center text-center",
        column.align === "right" && "justify-end text-right",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 아래 컴포넌트/함수들은 Table() 내부 클로저로 선언하면 eslint
 * react-hooks/static-components("Cannot create components during render")에 걸리기 때문에
 * 전부 모듈 스코프로 선언하고 필요한 값은 명시적 prop/인자로 전달한다.
 */
function DataRow<T>({
  row,
  columns,
  isSelected,
  isActive,
  selectionColor,
  unselectedCheckboxAppearance,
  onToggle,
  masterToggleAreaWidth,
  selectable,
  edgePadding,
  selectionColumnWidth,
  centerSelection,
  columnDividers,
  disabledTextTone,
  unselectedTextTone,
}: {
  row: TableRowData<T>;
  columns: TableColumn<T>[];
  isSelected: boolean;
  isActive: boolean;
  selectionColor: CheckboxColor;
  unselectedCheckboxAppearance: CheckboxUncheckedAppearance;
  onToggle: (id: string) => void;
  masterToggleAreaWidth: number;
  selectable: boolean;
  edgePadding: number;
  selectionColumnWidth: number;
  centerSelection: boolean;
  columnDividers: boolean;
  disabledTextTone: "gray60" | "gray80";
  unselectedTextTone: "default" | "gray80";
}) {
  const dividerColor = isActive || row.isNew ? "border-mes-border-default" : "border-mes-gray-40";
  return (
    <div
      className={cn(
        "flex h-[30px] shrink-0 items-center border-b border-solid border-mes-border-default",
        // 8차 후속: 담당자가 "비활성화는 텍스트 Gray-80, 배경 Gray-10"이라고 정확한 값을
        // 줘서 기존 opacity-50 판단값을 교체함. 배경은 선택 여부보다 disabled가 우선.
        row.disabled ? "bg-mes-gray-10" : isActive ? "bg-mes-primary-20" : "bg-white",
        row.disabled && "pointer-events-none"
      )}
      style={{ paddingInline: edgePadding }}
    >
      {/* 7차: "신규" 빨간 점을 체크박스 우측으로 정확히 10px 띄운 위치에 고정 배치.
          체크박스 칼럼 폭을 CHECKBOX_COLUMN_WIDTH(40px)로 통일해서 점이 다음 요소와
          안 겹치게 함 — 이 폭은 헤더/그룹행/총계행도 전부 동일하게 써야 정렬이 맞는다. */}
      {selectable && (
        <div
          className={cn("relative flex h-full shrink-0 items-center", centerSelection && "justify-center")}
          style={{ width: selectionColumnWidth }}
        >
          {!row.hideSelection && (
            <Checkbox
              checked={isSelected}
              onChange={() => onToggle(row.id)}
              color={isActive ? "black" : selectionColor}
              uncheckedAppearance={unselectedCheckboxAppearance}
              disabled={row.disabled}
            />
          )}
          {row.isNew && (
            <span
              aria-hidden
              className="absolute top-1/2 size-[6px] -translate-y-1/2 rounded-full bg-mes-danger-60"
              style={{ left: 24 + NEW_DOT_GAP_FROM_CHECKBOX }}
            />
          )}
        </div>
      )}
      {/* 헤더의 마스터 토글 버튼 영역과 폭을 맞추는 빈 스페이서(5차 정정) */}
      {masterToggleAreaWidth > 0 && (
        <div className="h-full shrink-0" style={{ width: masterToggleAreaWidth }} />
      )}
      {columns.map((col, i) => (
        <Cell
          key={col.key}
          column={col}
          className={cn(columnDividers && i < columns.length - 1 && `border-r border-dashed ${dividerColor}`)}
        >
          <span
            className={cn(
              "w-full truncate text-[14px] leading-[1.5]",
              row.disabled
                ? disabledTextTone === "gray60" ? "text-mes-gray-60" : "text-mes-gray-80"
                : !isActive && unselectedTextTone === "gray80"
                  ? "text-mes-gray-80"
                  : "text-mes-text-default"
            )}
          >
            {col.render ? col.render(row.data) : (row.data as Record<string, React.ReactNode>)[col.key]}
          </span>
        </Cell>
      ))}
    </div>
  );
}

function GroupHeaderRow<T>({
  group,
  columns,
  depth,
  background,
  isCollapsed,
  onToggleCollapse,
  checked,
  indeterminate,
  onToggleSelect,
  masterToggleAreaWidth,
  selectable,
  selectionColor,
  unselectedCheckboxAppearance,
  edgePadding,
  selectionColumnWidth,
}: {
  group: TableGroup<T>;
  columns: TableColumn<T>[];
  depth: number;
  background: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  checked: boolean;
  indeterminate: boolean;
  onToggleSelect: () => void;
  masterToggleAreaWidth: number;
  selectable: boolean;
  selectionColor: CheckboxColor;
  unselectedCheckboxAppearance: CheckboxUncheckedAppearance;
  edgePadding: number;
  selectionColumnWidth: number;
}) {
  return (
    <div
      className="flex h-[30px] shrink-0 items-center border-b border-solid"
      style={{ background, borderColor: background, paddingInline: edgePadding }}
    >
      {selectable && (
        <div
          className="flex h-full shrink-0 items-center"
          style={{ width: selectionColumnWidth }}
        >
          <Checkbox checked={checked} indeterminate={indeterminate} onChange={onToggleSelect} color={selectionColor} uncheckedAppearance={unselectedCheckboxAppearance} />
        </div>
      )}
      {/* 6차: 헤더의 depth별 마스터 토글 버튼과 "같은 x 위치"에 오도록, 이 영역을 헤더와
          똑같이 depth 슬롯(폭 MASTER_TOGGLE_SLOT_WIDTH씩)으로 나누고, 이 그룹의 depth에
          해당하는 슬롯에만 실제 펼침 버튼을 넣는다. 이전엔 라벨 앞에 paddingLeft로
          들여쓰기만 해서 버튼이 슬롯 폭 배열과 무관한 위치에 떠 있었음(정렬 어긋남의
          원인) — 이제 슬롯 폭이 헤더와 정확히 일치해서 항상 같은 열에 정렬됨. */}
      {masterToggleAreaWidth > 0 && (
        <div className="flex h-full shrink-0 items-center" style={{ width: masterToggleAreaWidth }}>
          {Array.from({ length: masterToggleAreaWidth / MASTER_TOGGLE_SLOT_WIDTH }).map(
            (_, slotIndex) => (
              <div
                key={slotIndex}
                className="flex h-full shrink-0 items-center justify-center"
                style={{ width: MASTER_TOGGLE_SLOT_WIDTH }}
              >
                {slotIndex === depth && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="flex size-[22px] shrink-0 items-center justify-center rounded-mes-control-sm border border-mes-gray-50 bg-mes-gray-0"
                  >
                    <IconArrow
                      size={12}
                      className={cn(
                        "text-mes-text-default transition-transform",
                        isCollapsed ? "-rotate-90" : "rotate-90"
                      )}
                    />
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
      {columns.map((col, i) =>
        i === 0 ? (
          // 6차: 라벨은 항상 좌측 고정 — 이 컬럼의 align이 center/right여도 그룹 라벨은
          // 트리 라벨이라 데이터 값과 성격이 달라서 강제로 좌측 고정한다(안 그러면 라벨
          // 길이에 따라 컬럼 중앙 기준으로 시작 위치가 매번 달라져 "정렬이 제멋대로"인
          // 것처럼 보임 — 실제 이 문제가 있었음).
          <Cell key={col.key} column={{ ...col, align: "left" }} className="overflow-visible">
            <span
              role="button"
              tabIndex={0}
              onClick={onToggleCollapse}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggleCollapse();
              }}
              className="cursor-pointer whitespace-nowrap text-[14px] font-medium leading-[1.5] text-mes-text-default"
              style={{ paddingLeft: depth * 12 }}
            >
              {group.label}
            </span>
          </Cell>
        ) : (
          <Cell key={col.key} column={col}>
            {group.summary?.[col.key] !== undefined && (
              <span className="w-full truncate text-right text-[14px] font-semibold leading-[1.5] text-mes-text-default">
                {group.summary[col.key]}
              </span>
            )}
          </Cell>
        )
      )}
    </div>
  );
}

function TotalsRow<T>({
  columns,
  totals,
  masterToggleAreaWidth,
  selectable,
  edgePadding,
  selectionColumnWidth,
}: {
  columns: TableColumn<T>[];
  totals?: Record<string, React.ReactNode>;
  masterToggleAreaWidth: number;
  selectable: boolean;
  edgePadding: number;
  selectionColumnWidth: number;
}) {
  if (!totals) return null;
  return (
    <div className="flex h-[30px] shrink-0 items-center border-b border-solid border-mes-border-default bg-white" style={{ paddingInline: edgePadding }}>
      {/* 7차: 여기서 `pr-[12px]` + 명시적 `width:24`를 같이 쓰고 있었는데, Tailwind
          기본 box-sizing:border-box 때문에 실제로는 24px(패딩 포함)만 차지해서 다른
          행 종류(체크박스 24+12=36px)와 이미 안 맞고 있던 잠재 버그였음 — 발견 즉시
          CHECKBOX_COLUMN_WIDTH로 통일해서 수정 */}
      {selectable && <div className="h-full shrink-0" style={{ width: selectionColumnWidth }} />}
      {/* 헤더의 마스터 토글 버튼 영역과 폭을 맞추는 빈 스페이서(5차 정정) */}
      {masterToggleAreaWidth > 0 && (
        <div className="h-full shrink-0" style={{ width: masterToggleAreaWidth }} />
      )}
      {columns.map((col, i) =>
        i === 0 ? (
          // 6차: 그룹 라벨과 같은 이유로 "총계" 라벨도 컬럼 align과 무관하게 좌측 고정
          <Cell key={col.key} column={{ ...col, align: "left" }} className="overflow-visible">
            <span className="whitespace-nowrap text-[14px] font-semibold leading-[1.5] text-mes-text-default">
              총계
            </span>
          </Cell>
        ) : (
          <Cell key={col.key} column={col}>
            {totals[col.key] !== undefined && (
              <span className="w-full truncate text-right text-[14px] font-semibold leading-[1.5] text-mes-text-default">
                {totals[col.key]}
              </span>
            )}
          </Cell>
        )
      )}
    </div>
  );
}

/** 그룹 트리를 재귀적으로 렌더링(2·3차 이상 그룹화 지원). JSX 태그가 아니라 일반 함수 호출로만
 *  쓰이므로 react-hooks/static-components 대상이 아님(모듈 스코프에 둔 것도 동일 이유는 아니고
 *  단순히 다른 헬퍼들과 위치를 맞추기 위함). */
function renderGroupNode<T>({
  group,
  depth,
  columns,
  collapsed,
  onToggleCollapse,
  selectedIds,
  onToggleGroupSelect,
  onToggleOne,
  levelColors,
  masterToggleAreaWidth,
  selectable,
  activeId,
  selectionColor,
  unselectedCheckboxAppearance,
  edgePadding,
  selectionColumnWidth,
  centerSelection,
  columnDividers,
  disabledTextTone,
  unselectedTextTone,
}: {
  group: TableGroup<T>;
  depth: number;
  columns: TableColumn<T>[];
  collapsed: Record<string, boolean>;
  onToggleCollapse: (groupId: string, currentlyCollapsed: boolean) => void;
  selectedIds: string[];
  onToggleGroupSelect: (rowIds: string[], nextChecked: boolean) => void;
  onToggleOne: (id: string) => void;
  levelColors: string[];
  masterToggleAreaWidth: number;
  selectable: boolean;
  activeId?: string | null;
  selectionColor: CheckboxColor;
  unselectedCheckboxAppearance: CheckboxUncheckedAppearance;
  edgePadding: number;
  selectionColumnWidth: number;
  centerSelection: boolean;
  columnDividers: boolean;
  disabledTextTone: "gray60" | "gray80";
  unselectedTextTone: "default" | "gray80";
}): React.ReactNode {
  const isCollapsed = collapsed[group.id] ?? group.defaultExpanded === false;
  const rowIds = collectGroupRowIds(group);
  const checkedCount = rowIds.filter((id) => selectedIds.includes(id)).length;
  const isAllChecked = rowIds.length > 0 && checkedCount === rowIds.length;
  const isIndeterminate = checkedCount > 0 && !isAllChecked;
  const background = levelColors[Math.min(depth, levelColors.length - 1)];

  return (
    <React.Fragment key={group.id}>
      <GroupHeaderRow
        group={group}
        columns={columns}
        depth={depth}
        background={background}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => onToggleCollapse(group.id, isCollapsed)}
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onToggleSelect={() => onToggleGroupSelect(rowIds, !isAllChecked)}
        masterToggleAreaWidth={masterToggleAreaWidth}
        selectable={selectable}
        selectionColor={selectionColor}
        unselectedCheckboxAppearance={unselectedCheckboxAppearance}
        edgePadding={edgePadding}
        selectionColumnWidth={selectionColumnWidth}
      />
      {!isCollapsed &&
        (group.groups
          ? group.groups.map((sub) =>
              renderGroupNode({
                group: sub,
                depth: depth + 1,
                columns,
                collapsed,
                onToggleCollapse,
                selectedIds,
                onToggleGroupSelect,
                onToggleOne,
                levelColors,
                masterToggleAreaWidth,
                selectable,
                activeId,
                selectionColor,
                unselectedCheckboxAppearance,
                edgePadding,
                selectionColumnWidth,
                centerSelection,
                columnDividers,
                disabledTextTone,
                unselectedTextTone,
              })
            )
          : (group.rows ?? []).map((row) => (
              <DataRow
                key={row.id}
                row={row}
                columns={columns}
                isSelected={selectedIds.includes(row.id)}
                isActive={activeId === undefined ? selectedIds.includes(row.id) : activeId === row.id}
                selectionColor={selectionColor}
                unselectedCheckboxAppearance={unselectedCheckboxAppearance}
                onToggle={onToggleOne}
                masterToggleAreaWidth={masterToggleAreaWidth}
                selectable={selectable}
                edgePadding={edgePadding}
                selectionColumnWidth={selectionColumnWidth}
                centerSelection={centerSelection}
                columnDividers={columnDividers}
                disabledTextTone={disabledTextTone}
                unselectedTextTone={unselectedTextTone}
              />
            )))}
    </React.Fragment>
  );
}

function Table<T>({
  columns,
  groups,
  rows,
  selectedIds = [],
  activeId,
  selectionColor = "black",
  unselectedCheckboxAppearance = "outline",
  selectionHeaderIndeterminate = true,
  edgePadding = 20,
  selectionColumnWidth = CHECKBOX_COLUMN_WIDTH,
  centerSelection = false,
  columnDividers = true,
  headerBackground = "gray10",
  horizontalScroll = true,
  disabledTextTone = "gray80",
  unselectedTextTone = "default",
  onSelectedIdsChange,
  selectable = true,
  selectionHeaderLabel,
  totals,
  groupLevelColors = DEFAULT_GROUP_LEVEL_COLORS,
  showMasterGroupToggles = true,
  className,
}: TableProps<T>) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const allIds = React.useMemo(() => collectAllRowIds(groups, rows), [groups, rows]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && allIds.some((id) => selectedIds.includes(id));

  const toggleAll = () => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(allSelected ? [] : allIds);
  };
  const toggleOne = (id: string) => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(
      selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]
    );
  };
  const toggleGroup = (rowIds: string[], nextChecked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (nextChecked) {
      onSelectedIdsChange(Array.from(new Set([...selectedIds, ...rowIds])));
    } else {
      onSelectedIdsChange(selectedIds.filter((id) => !rowIds.includes(id)));
    }
  };
  const toggleCollapse = (groupId: string, currentlyCollapsed: boolean) => {
    setCollapsed((prev) => ({ ...prev, [groupId]: !currentlyCollapsed }));
  };
  /** 2026-07-28 3차 피드백(4): depth 하나를 통째로 접거나 펼침 — 하나라도 펼쳐져 있으면
   *  전부 접고, 전부 접혀 있으면 전부 펼침 */
  const toggleAllAtDepth = (depth: number) => {
    const groupsAtDepth = getGroupsAtDepth(groups, depth);
    const anyExpanded = groupsAtDepth.some(
      (g) => !(collapsed[g.id] ?? g.defaultExpanded === false)
    );
    setCollapsed((prev) => {
      const next = { ...prev };
      groupsAtDepth.forEach((g) => {
        next[g.id] = anyExpanded;
      });
      return next;
    });
  };
  const groupLevelCount = React.useMemo(() => getMaxGroupDepth(groups), [groups]);
  const masterToggleAreaWidth = showMasterGroupToggles ? groupLevelCount * MASTER_TOGGLE_SLOT_WIDTH : 0;

  return (
    <div className={cn("w-full rounded-mes-control border border-mes-border-default", horizontalScroll ? "overflow-x-auto" : "overflow-hidden", className)}>
      <div className="min-w-max">
        {/* 헤더 */}
        <div className={cn("sticky top-0 z-10 flex h-[30px] shrink-0 items-center border-b border-solid border-mes-border-default", headerBackground === "white" ? "bg-white" : "bg-mes-gray-10")} style={{ paddingInline: edgePadding }}>
          {/* 5차 정정: 체크박스는 항상 최좌측 고정 — 마스터 토글 버튼은 체크박스보다
              오른쪽에 온다(예전엔 반대였음). 7차: 폭을 CHECKBOX_COLUMN_WIDTH로 통일
              (신규 점 배치 때문에 40px로 늘어남 — 다른 행 종류와 동일해야 함). */}
          {selectable && (
            <div className="flex h-full shrink-0 items-center justify-center" style={{ width: selectionColumnWidth }}>
              {selectionHeaderLabel ? (
                <span className="text-[13px] font-semibold leading-[1.5] text-mes-text-default">
                  {selectionHeaderLabel}
                </span>
              ) : (
                <Checkbox checked={allSelected} indeterminate={selectionHeaderIndeterminate && someSelected} onChange={toggleAll} color={selectionColor} uncheckedAppearance={unselectedCheckboxAppearance} />
              )}
            </div>
          )}
          {/* 2026-07-28 3차 피드백(4): 그룹 depth별 "한꺼번에 접기/펼치기" 버튼. 6차: 각
              버튼을 폭 MASTER_TOGGLE_SLOT_WIDTH의 슬롯 안에 넣어서, 그룹행(GroupHeaderRow)
              의 depth별 슬롯과 정확히 같은 x 위치에 오도록 통일(이전엔 gap 기반이라 슬롯
              경계가 그룹행과 미묘하게 안 맞을 수 있었음). 이 영역의 폭(`masterToggleAreaWidth`)
              은 그룹행/데이터행/총계행에도 동일하게 예약돼 있어야 컬럼이 안 어긋난다
              (재발 방지 규칙 6번). */}
          {showMasterGroupToggles && groupLevelCount > 0 && (
            <div className="flex h-full shrink-0 items-center" style={{ width: masterToggleAreaWidth }}>
              {Array.from({ length: groupLevelCount }).map((_, depth) => {
                const groupsAtDepth = getGroupsAtDepth(groups, depth);
                const anyExpanded = groupsAtDepth.some(
                  (g) => !(collapsed[g.id] ?? g.defaultExpanded === false)
                );
                return (
                  <div
                    key={depth}
                    className="flex h-full shrink-0 items-center justify-center"
                    style={{ width: MASTER_TOGGLE_SLOT_WIDTH }}
                  >
                  <button
                    type="button"
                    onClick={() => toggleAllAtDepth(depth)}
                    title={`${depth + 1}단 전체 ${anyExpanded ? "접기" : "펼치기"}`}
                    className="flex size-[22px] shrink-0 items-center justify-center rounded-mes-control-sm border border-mes-gray-50 bg-mes-gray-0"
                  >
                    <IconArrow
                      size={12}
                      className={cn(
                        "text-mes-text-default transition-transform",
                        anyExpanded ? "rotate-90" : "-rotate-90"
                      )}
                    />
                  </button>
                  </div>
                );
              })}
            </div>
          )}
          {columns.map((col, i) => (
            // 7차: "숫자 컬럼명이 숫자가 아닌데 왜 우측정렬이냐, 헤더는 가운데정렬 쌔려야지"
            // → 헤더 라벨은 그 컬럼의 데이터 align(숫자=우측/텍스트=좌측 등)과 무관하게
            // 항상 가운데 정렬로 고정. 데이터 셀 정렬은 이 규칙과 별개로 각 컬럼의
            // align을 그대로 따른다(숫자=우측 유지).
            <Cell
              key={col.key}
              column={{ ...col, align: "center" }}
              className={cn(columnDividers && i < columns.length - 1 && "border-r border-dashed border-mes-gray-40")}
            >
              <span className="w-full truncate text-[13px] font-semibold leading-[1.5] text-mes-text-default">
                {col.label}
              </span>
            </Cell>
          ))}
        </div>

        {/* 본문: 그룹(재귀 중첩 가능) 있으면 그룹별, 없으면 플랫 */}
        {groups
          ? groups.map((group) =>
              renderGroupNode({
                group,
                depth: 0,
                columns,
                collapsed,
                onToggleCollapse: toggleCollapse,
                selectedIds,
                onToggleGroupSelect: toggleGroup,
                onToggleOne: toggleOne,
                levelColors: groupLevelColors,
                masterToggleAreaWidth,
                selectable,
                activeId,
                selectionColor,
                unselectedCheckboxAppearance,
                edgePadding,
                selectionColumnWidth,
                centerSelection,
                columnDividers,
                disabledTextTone,
                unselectedTextTone,
              })
            )
          : (rows ?? []).map((row) => (
              <DataRow
                key={row.id}
                row={row}
                columns={columns}
                isSelected={selectedIds.includes(row.id)}
                isActive={activeId === undefined ? selectedIds.includes(row.id) : activeId === row.id}
                selectionColor={selectionColor}
                unselectedCheckboxAppearance={unselectedCheckboxAppearance}
                onToggle={toggleOne}
                masterToggleAreaWidth={masterToggleAreaWidth}
                selectable={selectable}
                edgePadding={edgePadding}
                selectionColumnWidth={selectionColumnWidth}
                centerSelection={centerSelection}
                columnDividers={columnDividers}
                disabledTextTone={disabledTextTone}
                unselectedTextTone={unselectedTextTone}
              />
            ))}

        <TotalsRow columns={columns} totals={totals} masterToggleAreaWidth={masterToggleAreaWidth} selectable={selectable} edgePadding={edgePadding} selectionColumnWidth={selectionColumnWidth} />
      </div>
    </div>
  );
}

export { Table };
