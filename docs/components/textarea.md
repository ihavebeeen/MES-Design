# Textarea

> `textarea` · form · Tier 2 · provisional · 공개

## 역할

비고·사유·설명처럼 여러 줄이 될 수 있는 자유 텍스트를 입력한다.

## 생성 선택 기준

- 비고·사유·설명처럼 여러 줄이 될 수 있는 자유 텍스트를 입력한다.

선택하지 않는 경우:
- 짧은 코드·수량이나 정해진 선택지를 입력하는 경우

## API와 상태

- 공개 심볼: `TextareaProps`, `Textarea`
- 주요 Props: 별도 Props 선언 없음
- 상태: `disabled`, `focus`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/textarea.tsx`
- 웹 문서: `/components/textarea`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
