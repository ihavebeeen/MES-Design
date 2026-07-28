import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-mes-gray-10 p-16">
      <h1 className="text-xl font-semibold text-mes-gray-130">
        MES 컴포넌트 라이브러리 — 스캐폴딩 확인용
      </h1>
      <div className="flex items-center gap-4">
        <Button size="basic">Basic 버튼</Button>
        <Button size="small">Small 버튼</Button>
        <Button size="xsmall">Xsmall 버튼</Button>
        <Button size="basic" disabled>
          비활성
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button size="basic" startIcon={<Plus size={16} />}>
          아이콘 왼쪽
        </Button>
        <Button size="basic" endIcon={<Plus size={16} />}>
          아이콘 오른쪽
        </Button>
        <Button
          size="basic"
          startIcon={<Plus size={16} />}
          endIcon={<Plus size={16} />}
        >
          아이콘 양쪽
        </Button>
      </div>
    </div>
  );
}
