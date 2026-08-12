"use client";

import * as React from "react";
import { PasswordResetLoginForm } from "@/components/patterns/user-password-settings-pattern";

export default function UserPasswordResetLoginVisualPage() {
  const [complete, setComplete] = React.useState(false);
  return (
    <main className="flex min-h-screen justify-end bg-mes-gray-20">
      <PasswordResetLoginForm onComplete={() => setComplete(true)} />
      {complete && <p role="status" className="sr-only">비밀번호 변경 완료</p>}
    </main>
  );
}
