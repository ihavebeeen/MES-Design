# Radio

> `radio` · form · Tier 1 · stable · 공개

## 역할

서로 배타적인 소수 옵션을 동시에 보여주고 하나를 선택

## 사용 기준

- 서로 배타적인 소수 옵션을 동시에 보여주고 하나를 선택

사용하지 않는 경우:
- 복수 선택
- 옵션이 많아 공간을 차지하는 경우
- 단순 아이콘 표시

## API와 상태

- 공개 심볼: `RadioProps`, `Radio`
- 주요 Props: `size`
- 상태: `unselected`, `selected`, `disabled`
- 변형: `default`, `small`

## 접근성과 제약

- 동일 그룹은 fieldset과 legend 또는 동등한 이름을 가진다.
- 화살표키 또는 브라우저 기본 라디오 키보드 동작을 유지한다.
- 같은 name 그룹 안에서 단일 선택 상태를 실제로 변경한다.
- 시각 상태만 그리고 입력 동작을 생략하지 않는다.

## 근거

- 구현: `src/components/ui/radio.tsx`
- 웹 문서: `/components/radio`
- 상세 사용 계약: 등록됨
- 화면 근거: `custom-information`, `self-inspection`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
