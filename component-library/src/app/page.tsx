import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="flex items-center gap-4">
        <Button size="basic" variant="fillMain">
          fillMain
        </Button>
        <Button size="basic" variant="fillGray">
          fillGray
        </Button>
        <Button size="basic" variant="fillBlack">
          fillBlack
        </Button>
        <Button size="basic" variant="fillRed">
          fillRed
        </Button>
        <Button size="basic" variant="lineMain">
          lineMain
        </Button>
        <Button size="basic" variant="lineBlacktxt">
          lineBlacktxt
        </Button>
        <Button size="basic" variant="opacityMain">
          opacityMain
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input placeholder="내용 입력" className="w-[220px]" />
        <Input defaultValue="내용" className="w-[220px]" />
        <Input placeholder="내용 입력" readOnly defaultValue="내용" className="w-[220px]" />
        <Input placeholder="내용 입력" disabled className="w-[220px]" />
        <Input size="small" placeholder="내용 입력" className="w-[220px]" />
        <Input size="small" defaultValue="내용" className="w-[220px]" />
      </div>

      <div className="flex items-center gap-3">
        <Select>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="내용 입력" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">옵션 1</SelectItem>
            <SelectItem value="2">옵션 2</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="1">
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">내용</SelectItem>
            <SelectItem value="2">옵션 2</SelectItem>
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="내용 입력" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">옵션 1</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="small" className="w-[220px]">
            <SelectValue placeholder="내용 입력" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">옵션 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
