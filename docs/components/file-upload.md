# FileUpload

> `file-upload` · form · Tier 3 · provisional · 공개

## 역할

업무 레코드에 첨부할 파일을 선택하고 업로드 상태를 관리한다.

## 생성 선택 기준

- 업무 레코드에 첨부할 파일을 선택하고 업로드 상태를 관리한다.

선택하지 않는 경우:
- 기존 이미지나 파일을 보기만 하거나 외부 링크를 여는 경우

## API와 상태

- 공개 심볼: `FileUploadProps`, `FileUpload`
- 주요 Props: `label`, `helpText`, `onFilesChange`, `showSelection`
- State: `default`
- Value: `no-files`, `files-selected`
- Disabled: `false`, `true`
- Size: `not-applicable`
- Interaction: `rest`, `hover`, `focus`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/file-upload.tsx`
- 웹 문서: `/components/file-upload`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
