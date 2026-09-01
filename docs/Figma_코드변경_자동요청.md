# 코드 변경 → Figma 수정 요청

코드를 Git에 커밋하면 변경된 자산과 관련 Figma 링크를 묶어 수정 요청을 만든다. 실제 컴포넌트 수정은 요청 검토·승인 후 진행한다.

## 사용자 수정 우선

- 사용자 확정(2026-08-31): 에이전트가 직접 수정하지 않은 Figma 변경은 사용자 수정으로 취급한다.
- 최신 사용자 수정본이 이전 코드·제작 기록보다 우선한다. 같은 변경의 작성자나 색상 기준을 다시 묻지 않고, 관련 마스터·인스턴스·검증 기준을 수정본에 맞춘다.
- 단일 사용처의 수정은 해당 맥락에 적용한다. 관계없는 버튼이나 화면에 전역 확대하지 않는다. 크기·색상·문구 등 실제 바뀐 항목과 유지할 항목을 구분한다.
- DialogFooter는 모달 전용 기본 2버튼이다. 닫기는 회색(fillGray), 저장은 gray130(fillBlack), 크기는 160×40px이다.
- MainListFooterActions는 메인 리스트 우하단 전용 1~3개 조합이다. 버튼 크기는 160×32px이며 DialogFooter와 분리해 동기화한다.
- 코드와 다르면 승인된 디자인 차이로 기록한다. 이 지침만으로 MES 코드 전체를 자동 수정하거나 코드 변경 요청을 자동 완료 처리하지 않는다.

## 어디에서 보나

- Figma: [11 코드 변경 요청](https://www.figma.com/design/DAHeMHiVwqZCzONVAWbMXb?node-id=448-5). 이 안내판만 자동 갱신한다. 메모는 안내판 밖에 작성한다.
- 현재 Codex 작업: 주기 검사에서 새로운 요청을 알린다. Figma 연결이 필요하다.
- GitHub: 설정을 main에 푸시한 뒤부터 `Figma update request`가 Issue를 생성·갱신한다. 전체 근거는 실행의 `figma-sync-request` 아티팩트에 보관한다.
- 로컬: `component-library/.figma-sync/request.md`, `request.json`.

GitHub Actions는 Figma MCP를 직접 실행하지 않는다. Figma 안내판 전달은 이 Codex 작업의 정기 실행이 담당한다. 로컬 정기 실행에는 컴퓨터와 앱이 켜져 있어야 한다. ([OpenAI Docs](https://learn.chatgpt.com/docs/automations?surface=app))

## 감지·보호 범위

- 최초 Figma 기준은 `65fa60c0011058c57bae6914616aec6fcd2999e0`. 기존 자산 88항목과 추가 아이콘40종의 연결을 재사용했다. 승인 상태는 기존 components 원장을 따른다.
- 커밋된 소스·정적 import 의존 관계·공통 CSS/패키지 의존성·자산 등록 정보·공통 규칙을 비교한다. 미커밋/미추적 작업 파일은 제외한다.
- 공통 CSS나 barrel export 변경은 보수적으로 소비 자산까지 검토 요청한다. 영향 대상 숫자는 오류 숫자가 아니다. 계산형 import/동적 스타일의 완전한 의미 분석이나 브라우저 픽셀 검증은 수행하지 않는다.
- 새 자산·삭제/이동·연결 없는 소스는 별도 검토 목록으로 남긴다. 완성 화면은 자동 제작하지 않는다.
- 헤더 외곽28px/Hug, 버튼 위계·색상·하단 액션 크기와 수동 수정은 보호 규칙에 포함한다. 실제 편집 전에 현재 Figma를 읽어 충돌을 확인한다.
- 요청 생성·알림·Issue 닫기는 반영 완료가 아니다. 같은 코드 차이는 중복 알림하지 않는다. 되돌린 코드도 Figma 편집 완료로 기록하지 않는다.

## 자동 실행

GitHub 설정은 [.github/workflows/figma-sync-request.yml](../.github/workflows/figma-sync-request.yml)에 있다. main push와 수동 실행을 지원한다. `contents: read`, `issues: write`만 요청하며 별도 Figma 토큰이나 AI API 키는 넣지 않는다. 저장소의 Issues와 Actions가 허용되어야 한다. 전송 실패는 실패로 표시하고 생성 아티팩트를 남긴다. ([GitHub 권한 안내](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token))

현재 Codex 작업에는 **1시간 간격** 정기 실행(`mes-figma`)을 등록했다. 로컬 정기 실행은 `node tools/figma-sync/watch.mjs`를 사용한다. `git fetch`로 원격 main을 조회하되 checkout·merge·pull은 하지 않는다. 로컬/원격 중 더 앞선 main을 검사하고, 둘이 갈라지면 기준 확인을 요청한다. 네트워크·권한 실패 시 로컬 기준 검사임을 표시한다.

## 수동 실행 / 다른 PC

저장소 루트에서 Node.js 22 이상과 Git으로 실행한다. 요청 생성만 할 때 npm 설치는 필요 없다.

```powershell
node tools/figma-sync/request.mjs
node tools/figma-sync/verify.mjs
```

Figma에 전달하려면 Figma 연결이 있는 Codex/Claude에 요청 파일을 주고 이렇게 요청한다.

검사 결과와 검사한 파일의 해시는 `.figma-sync/verification.json`, 원본 테스트 출력은 `verification.tap`에 자동 기록된다. GitHub 실제 Issue 전송과 실제 Figma 컴포넌트 수정은 이 테스트에 포함되지 않는다.

> request.json의 코드 변경을 검토해줘. Figma 현재 값과 보호 규칙을 먼저 확인하고, 승인 전에는 안내판만 업데이트해줘.

생성된 `inbox-code.js`는 Node에서 실행하는 파일이 아니다. Figma `use_figma` 실행 코드다. 해당 스킬을 먼저 읽고 설정의 fileKey로 실행한다. 지정된 안내판·텍스트 ID 이외에는 접근하지 않는다. 노드가 이동/삭제되면 임의 재생성하지 않고 확인을 요청한다. 이 단계는 컴포넌트 편집을 하지 않는다.

다른 PC에 저장소만 복사하면 요청 생성기는 사용할 수 있지만, 이 작업의 정기 실행 설정과 Figma 연결까지 복사되지는 않는다.

## 승인 후 반영 기록

연결표: [config.json](../tools/figma-sync/config.json). 자산별 마지막 반영 근거: [applied.json](../tools/figma-sync/applied.json).

Figma 실제 수정·검증 후 검토자가 `.figma-sync/evidence.json`에 아래 형식으로 근거를 작성한다. 새 자산은 Figma 생성 후 config 연결을 먼저 추가한다. 자동으로 전체 기준 커밋을 HEAD로 바꾸지 않는다.

```json
{
  "fileKey": "DAHeMHiVwqZCzONVAWbMXb",
  "requestId": "request.json의 요청 ID",
  "sourceCommit": "request.json의 전체 커밋 SHA",
  "reviewer": "검토자",
  "verifiedAt": "2026-08-31T12:00:00Z",
  "assets": [{
    "id": "Button",
    "figmaNodeIds": ["12:2"],
    "note": "실제 대조 결과와 캡처 근거",
    "checks": {"geometry": true, "paint": true, "instances": true, "visual": true, "manualEditsReviewed": true}
  }],
  "reviewedFiles": []
}
```

```powershell
node tools/figma-sync/request.mjs --record-applied component-library/.figma-sync/evidence.json
node tools/figma-sync/request.mjs
```

검토만 필요한 파일은 `reviewedFiles`에 `{ "path": "요청의 파일 경로", "note": "반영 불필요/검토 결과 근거" }`를 기록할 수 있다. 선택한 자산·파일만 기준을 이동한다. 기록은 검토자의 확인서이며 Figma 서버의 검증 서명은 아니다. 실제 검증 없이 체크를 true로 채우면 안 된다. 공유 시 config/applied 변경도 Git에 포함한다.

## 알림·실패 처리

정기 실행은 `needsInboxDelivery`가 true이면 안내판 전달 후 `--mark-inbox-delivered 요청ID`, `needsNotification`이 true이면 사용자 알림 후 `--mark-notified 요청ID`를 기록한다. 두 전달 상태는 별개다. 생성기만 실행하면 어느 것도 완료 처리되지 않는다. Figma 실패 시 사용자 알림만 기록해도 안내판 재시도는 유지된다. 연결 복구 후 같은 안내판 갱신 스크립트로 재시도한다. 실제 컴포넌트 반영 기록은 이 두 상태와도 별개다.

이번 구성은 수정 요청 자동화다. 실제 MES 화면 전체의 동작·시각 일치 검증과 기존 미해결 항목은 별도 작업으로 유지한다.
