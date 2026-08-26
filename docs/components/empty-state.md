# EmptyState

> `empty-state` · feedback · Tier 2 · provisional · 공개

## 역할

조회 결과나 편집 목록이 비었고 다음 행동을 안내해야 함

## 사용 기준

- 조회 결과나 편집 목록이 비었고 다음 행동을 안내해야 함

사용하지 않는 경우:
- 로딩 중
- 오류가 발생함
- 실제 데이터가 존재함
- Figma 근거 없이 빈 공간을 꾸밈

## API와 상태

- 공개 심볼: `EmptyStateProps`, `EmptyState`
- 주요 Props: `icon`, `title`, `description`, `action`, `className`
- 상태: `static`
- 변형: `message-only`, `icon-message`, `message-action`

## 접근성과 제약

- 빈 상태 제목을 간결하게 읽을 수 있어야 한다.
- 제공되는 액션은 Button 계약을 따른다.
- 전용 Figma 원형이 없는 provisional 자산이므로 원본 empty 상태 또는 반복 업무 근거가 필요하다.
- 원본에 없는 설명 문구를 임의 추가하지 않는다.

## 근거

- 구현: `src/components/ui/empty-state.tsx`
- 웹 문서: `/components/empty-state`
- 상세 사용 계약: 등록됨
- 화면 근거: `form-management`, `team-settings`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
