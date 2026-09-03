# 승격 심사

`promotion`을 명시적으로 요청했을 때만 읽는다. 생성 결과·시안·기존 운영 화면이라는 이유로 이 모드를 선택하지 않는다.

## 필요한 근거

- [생성 화면 평가 및 승격 규칙](../../../../docs/AI_생성화면_평가_및_승격_규칙.md).
- 현재 계약/구현과 [구현 감사](mes-audit-rubric.md) 결과.
- `component-library/src/design-system/registry/`의 대상 lifecycle·평가·검증 기록.
- 전달 증적을 확인할 때만 [GENERATE 전달 게이트](../../generate-mes-ui/references/delivery-gate.md).

증적이 현재 대상의 계약·소스·의존성·wrapper·fingerprint·viewport·scope와 일치하는지 확인한다. 다른 상태의 캡처/receipt로 현재 대상을 통과시키지 않는다. 자동 검사 통과, 등록 컴포넌트 사용, 시각 회귀 통과 중 어느 하나도 승격을 단독으로 증명하지 않는다.

미실행 검사는 미확인으로 보고한다. 검증 플래그를 실제 검사 대신 기록하거나 평가 중 lifecycle·사용자 승인·승격 상태를 변경하지 않는다.

## 판단

Git 보존(`persistence`), 사용자 검토(`reviewStatus`), 이후 생성 영향(`generationInfluence`)은 독립 축이다.

- `not-ready`: 범위 내 blocker, 필수 검증 미확인/실패, 미승인 확장/신규 패턴 등 필수 요건이 남아 있다.
- `review-ready`: 해당 범위 검사를 마쳐 사용자 검토를 받을 수 있으나 승인 전이다.
- `promotion-candidate`: 사용자 검토와 적용되는 검증을 갖춰 별도 승격 결정의 후보가 됐다. 승인/편입을 실행했다는 뜻은 아니다.

부족한 증적은 승격 결론에만 반영한다. POC 디자인을 별도로 평가했다면 그 결론과 섞지 않는다. 실제 상태 변경은 별도 사용자 권한과 저장소 절차가 필요하다.
