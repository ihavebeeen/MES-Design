# AI UI Section Frame 감사 1차

> 기준 정책: [AI UI 조합 문법 공통 정책](./AI_UI_조합_문법_공통정책.md)  
> 기계 판독 장부: `component-library/src/design-system/registry/composition-section-frame-ledger.json`  
> 상태: **관찰 완료, 표준 API 미확정**

## 조사 범위

1차 인벤토리에서 서로 다른 섹션 표현이 한 파일에 섞여 있던 다음 3개 파일을 함수와 화면 Recipe 단위로 직접 확인했다.

- `completed-popup-patterns.tsx`
- `original-mes-screen-assets.tsx`
- `easy-mode-receiving-pattern.tsx`

화면 제목이나 업무 메뉴명으로 섹션을 추정하지 않았다. 실제 DOM 경계, 제목 표현, padding, divider, 배경, 높이와 scroll 소유자를 각각 기록했다.

## 조사 결과

| 항목 | 결과 |
|---|---:|
| 조사 파일 | 3개 |
| 논리 Section Frame | 25개 |
| `SectionBand` 제목 | 9개 |
| `SectionHeader` 제목 | 7개 |
| 단순 텍스트 제목 | 7개 |
| 접기/펼치기 제목 | 1개 |
| 제목 없는 Frame | 1개 |
| 내부 Section Frame이 없는 단일 작업 Body | 4개 |
| 생성 후보에만 속한 Frame | 3개 |

`SectionBand`와 `SectionHeader`는 둘 다 회색 제목 밴드를 그리지만 같은 계약이 아니다.

- `SectionBand`는 `mes-screen-fixtures.tsx` 안의 fixture-local helper다. 높이 28px, `font-bold`이며 action slot이 없다.
- `SectionHeader`는 `src/components/ui`에 등록된 공용 컴포넌트다. 전체 폭을 기본으로 사용하고 우측 action slot을 제공하며 `font-semibold`이다.
- 둘 다 Frame의 padding, divider, background, scroll을 소유하지 않는다. 현재는 호출부가 이 값들을 매번 다시 작성한다.

따라서 **회색 제목 밴드가 같아 보인다는 이유로 Section Frame이 이미 표준화됐다고 볼 수 없다.**

## 반복 구조 판정

### 1. Standard Frame — 반복 근거 있음

`20px padding + 섹션 제목 + 선택적 bottom/column divider` 조합은 여러 원본 Recipe에서 반복된다. 기본정보, 대상정보, 검사항목처럼 제목은 달라도 Frame 역할은 유사하다.

이 결과는 `기본정보`를 패턴 ID로 등록하라는 뜻이 아니다. 제목은 인스턴스 데이터이고, Frame은 경계와 여백을 소유하는 별도 계약이어야 한다.

### 2. Gray Entry Card — 후보 유지

`gray-20 + rounded + 내부 입력 폼 + 하단 추가 버튼` 구조는 다음에서 반복된다.

- 생산실적 등록의 실적정보
- 입고등록의 LOT단위 품목 추가
- 이지모드 입고등록의 품목/수량 직접 입력

다만 높이, bottom padding, 제목 우측 설명, 버튼 위치가 서로 다르다. 앞의 두 원본 화면을 기준으로 공통점과 variant를 더 비교하기 전에는 표준으로 승격하지 않는다. 이지모드 화면은 검증 근거가 아니라 격리된 생성 후보로만 사용한다.

### 3. List Region — 후보 유지

`제목/검색 + 남은 높이를 쓰는 표` 구조가 생산실적·입고등록 등에서 반복된다. 현재는 제목 크기, 상단 간격, table border와 scroll 소유자가 서로 달라 공통 계약이 없다.

### 4. Collapsible Frame — 승격 보류

접기/펼치기 선택항목은 이지모드 생성 후보 1건에서만 확인됐다. 원본 반복 근거가 없으므로 `migration-hold`로 둔다.

### 5. None — 정상적인 선택일 수 있음

생산수량 입력, 품목 상세정보, 불량수량 입력, 발주 일괄등록처럼 Body 전체가 하나의 작업인 경우 내부 Frame을 추가하지 않았다. `none`은 누락을 뜻하지 않으며 단일 작업 Body를 위한 명시적 선택이 될 수 있다.

## 발견된 구조 문제

1. 제목 컴포넌트가 Frame처럼 보이지만 실제로는 제목만 담당한다.
2. 같은 역할의 padding과 divider가 호출부마다 raw class로 반복된다.
3. 회색 Entry Card와 List Region은 반복되지만 제목·높이·scroll 차이가 아직 설명되지 않는다.
4. 고정 높이 Frame이 Shell의 resize/scroll 책임과 충돌할 가능성이 있다.
5. `original-mes-screen-assets.tsx`의 `CavityContent`는 현재 화면 렌더 경로에 연결되지 않은 코드다.
6. 이지모드의 3개 Frame은 생성 후보이므로 표준 추출 시 원본 근거와 동일 가중치로 집계하면 안 된다.

## 제안 상태의 최소 API

아래는 바로 구현할 API가 아니라 다음 비교 단계에서 검증할 책임 경계다.

```tsx
<SectionFrame
  variant="standard | split | entry-card | list | none"
  padding="standard | compact | none"
  divider="bottom | inline-end | none"
  background="surface | subtle"
  scroll="inherit | content"
>
  <SectionHeading action={...}>화면별 제목</SectionHeading>
  {content}
</SectionFrame>
```

잠정 소유 책임:

- `SectionFrame`: 외부 경계, padding, divider, background, 내부 scroll 영역
- `SectionHeading`: 제목의 높이·타이포그래피·우측 action 정렬
- `Section Pattern`: form grid, table list, inspection items 같은 실제 콘텐츠 구성
- `Recipe`: Frame 순서, 열 분할, 어떤 Section Pattern을 어느 slot에 넣는지 결정
- `Shell`: overlay, 화면 배치, 모달 Header/Footer, Body 전체 scroll 기본값

`height`는 기본 Frame API에서 제외한다. 원본 근거로 고정 높이가 반드시 필요한 경우에만 Recipe constraint로 기록한다.

## 다음 조사 범위

Section Frame 자체를 구현하기 전에 P1 Section Pattern 후보를 비교한다.

1. `section.search-table` 6건의 toolbar/table 구조
2. `section.form-grid` 5건의 열 수·라벨 폭·required 표현
3. `section.editable-row-list` 3건의 추가·삭제·초기값 규칙
4. `section.inspection-items` 3건의 판정 방식·대상정보 배치
5. `section.summary`를 합계행·결과카드·전후 비교로 분해

이 비교가 끝나기 전에는 `SectionBand`를 일괄 교체하거나 raw wrapper를 삭제하지 않는다.
