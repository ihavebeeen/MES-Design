import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MES 컴포넌트 라이브러리",
  description: "MES 디자인 시스템 기반 UI 컴포넌트 라이브러리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
