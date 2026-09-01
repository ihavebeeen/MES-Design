# NoticeBanner

> `notice-banner` · feedback · Tier 1 · stable · 공개

## 역할

현재 화면·영역에 영향을 주는 안내나 주의사항을 내용과 함께 지속 표시한다.

## 생성 선택 기준

- 현재 화면·영역에 영향을 주는 안내나 주의사항을 내용과 함께 지속 표시한다.

선택하지 않는 경우:
- 단순 장식 설명, 잠깐 나타나는 성공 알림, 처리 불가능한 오류 대체 화면인 경우

## API와 상태

- 공개 심볼: `NoticeBannerProps`, `NoticeBanner`
- 주요 Props: `message`, `linkLabel`, `onLinkClick`, `href`
- 상태: `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/notice-banner.tsx`
- 웹 문서: `/components/notice-banner`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
