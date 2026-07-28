"use client";

import { useState } from "react";
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
import { Combobox } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { Radio } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Filter } from "@/components/ui/filter";
import { Tag } from "@/components/ui/tag";
import { SlidersHorizontal, X } from "lucide-react";

/**
 * 컴포넌트별 예시를 "행/열이 맞는 그리드 + 컴포넌트명·상태값 라벨 병기" 형태로 정리한
 * 미리보기 페이지 (2026-07-28 담당자 지적 반영: 단순히 나눠 배치하는 게 아니라
 * 오와 열을 맞추고, 각 예시마다 컴포넌트명과 상태값을 같이 표기할 것).
 */

function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="font-mono text-[11px] leading-none text-mes-gray-70">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
      <h2 className="text-[14px] font-semibold text-mes-gray-130">{title}</h2>
      <div className="grid grid-cols-4 items-end gap-x-6 gap-y-6">{children}</div>
    </section>
  );
}

const shiftOptions = [
  { value: "day", label: "주간 근무조" },
  { value: "night", label: "야간 근무조" },
  { value: "swing", label: "교대 근무조" },
  { value: "bom1", label: "BOM-2026-001" },
  { value: "bom2", label: "BOM-2026-002" },
];

const filterCategories = [
  {
    id: "group",
    label: "그룹명",
    options: [
      { id: "normal", label: "NORMAL_USER" },
      { id: "admin", label: "SUPER_ADMIN" },
      { id: "acc", label: "경리팀" },
    ],
  },
  {
    id: "desc",
    label: "그룹설명",
    options: [{ id: "d1", label: "설명 A" }],
  },
  {
    id: "member",
    label: "구성원",
    options: [{ id: "m1", label: "홍길동" }],
  },
  {
    id: "perm",
    label: "권한 설정",
    options: [
      { id: "normal", label: "NORMAL_USER" },
      { id: "admin", label: "SUPER_ADMIN" },
      { id: "acc", label: "경리팀" },
      { id: "gong", label: "공무팀" },
      { id: "manager", label: "관리자" },
    ],
  },
  { id: "modified", label: "최종변경일", options: [{ id: "today", label: "오늘" }] },
];

export default function Home() {
  const [comboValue, setComboValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<Record<string, string[]>>({
    perm: ["normal"],
    group: ["normal", "admin"],
  });

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-mes-gray-10 p-16">
      <h1 className="text-xl font-semibold text-mes-gray-130">
        MES 컴포넌트 라이브러리 — 스캐폴딩 확인용
      </h1>

      <Section title="Button — 사이즈">
        <Sample label="Button · Basic · Default">
          <Button size="basic">Basic 버튼</Button>
        </Sample>
        <Sample label="Button · Small · Default">
          <Button size="small">Small 버튼</Button>
        </Sample>
        <Sample label="Button · Xsmall · Default">
          <Button size="xsmall">Xsmall 버튼</Button>
        </Sample>
        <Sample label="Button · Basic · Disabled">
          <Button size="basic" disabled>
            비활성
          </Button>
        </Sample>
      </Section>

      <Section title="Button — 아이콘">
        <Sample label="Button · StartIcon">
          <Button size="basic" startIcon={<Plus size={16} />}>
            아이콘 왼쪽
          </Button>
        </Sample>
        <Sample label="Button · EndIcon">
          <Button size="basic" endIcon={<Plus size={16} />}>
            아이콘 오른쪽
          </Button>
        </Sample>
        <Sample label="Button · Start+EndIcon">
          <Button
            size="basic"
            startIcon={<Plus size={16} />}
            endIcon={<Plus size={16} />}
          >
            아이콘 양쪽
          </Button>
        </Sample>
      </Section>

      <Section title="Button — 컬러 variant (7종)">
        <Sample label="Button · fillMain">
          <Button size="basic" variant="fillMain">
            fillMain
          </Button>
        </Sample>
        <Sample label="Button · fillGray">
          <Button size="basic" variant="fillGray">
            fillGray
          </Button>
        </Sample>
        <Sample label="Button · fillBlack">
          <Button size="basic" variant="fillBlack">
            fillBlack
          </Button>
        </Sample>
        <Sample label="Button · fillRed">
          <Button size="basic" variant="fillRed">
            fillRed
          </Button>
        </Sample>
        <Sample label="Button · lineMain">
          <Button size="basic" variant="lineMain">
            lineMain
          </Button>
        </Sample>
        <Sample label="Button · lineBlacktxt">
          <Button size="basic" variant="lineBlacktxt">
            lineBlacktxt
          </Button>
        </Sample>
        <Sample label="Button · opacityMain">
          <Button size="basic" variant="opacityMain">
            opacityMain
          </Button>
        </Sample>
      </Section>

      <Section title="Input">
        <Sample label="Input · Default(placeholder)">
          <Input placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Default(filled)">
          <Input defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Readonly">
          <Input placeholder="내용 입력" readOnly defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Disabled">
          <Input placeholder="내용 입력" disabled className="w-[200px]" />
        </Sample>
        <Sample label="Input · Small(placeholder)">
          <Input size="small" placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Small(filled)">
          <Input size="small" defaultValue="내용" className="w-[200px]" />
        </Sample>
      </Section>

      <Section title="Select (Selectbox)">
        <Sample label="Select · Default(placeholder)">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
              <SelectItem value="2">옵션 2</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Default(selected)">
          <Select defaultValue="1">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">내용</SelectItem>
              <SelectItem value="2">옵션 2</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Small">
          <Select>
            <SelectTrigger size="small" className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Disabled">
          <Select disabled>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · 커스텀 아이콘(꺾쇠 대신)">
          <Select>
            <SelectTrigger className="w-[200px]" icon={<SlidersHorizontal className="size-3.5 shrink-0 opacity-80" />}>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">최신순</SelectItem>
              <SelectItem value="2">이름순</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
      </Section>

      <Section title="Badge (7종 — orange/yellow는 Figma 이름과 실제 색이 다름, 아래 라벨에 실제색 병기)">
        <Sample label="Badge · blue">
          <Badge variant="blue">출하중</Badge>
        </Sample>
        <Sample label="Badge · red">
          <Badge variant="red">취소요청</Badge>
        </Sample>
        <Sample label="Badge · orange(실제=gray)">
          <Badge variant="orange">대기</Badge>
        </Sample>
        <Sample label="Badge · yellow(실제=blue, Figma 오류 추정)">
          <Badge variant="yellow">승인중</Badge>
        </Sample>
        <Sample label="Badge · gray(배경 없음)">
          <Badge variant="gray">완료</Badge>
        </Sample>
        <Sample label="Badge · variant6(용도 미확인)">
          <Badge variant="variant6">완료</Badge>
        </Sample>
        <Sample label="Badge · variant7(용도 미확인)">
          <Badge variant="variant7">완료</Badge>
        </Sample>
      </Section>

      <Section title="Radio">
        <Sample label="Radio · Unselected">
          <Radio name="demo-radio-unsel" />
        </Sample>
        <Sample label="Radio · Selected">
          <Radio name="demo-radio-sel" defaultChecked />
        </Sample>
        <Sample label="Radio · Disabled(선택 안 됨)">
          <Radio name="demo-radio-disabled-off" disabled />
        </Sample>
        <Sample label="Radio · Disabled(선택됨, Figma에 없어 판단값)">
          <Radio name="demo-radio-disabled-on" disabled defaultChecked />
        </Sample>
      </Section>

      <Section title="Checkbox (Figma에 disabled 상태 자체가 없음 — 판단값으로 구현)">
        <Sample label="Checkbox · Unchecked">
          <Checkbox />
        </Sample>
        <Sample label="Checkbox · Checked · main">
          <Checkbox defaultChecked color="main" />
        </Sample>
        <Sample label="Checkbox · Checked · gray">
          <Checkbox defaultChecked color="gray" />
        </Sample>
        <Sample label="Checkbox · Checked · black">
          <Checkbox defaultChecked color="black" />
        </Sample>
        <Sample label="Checkbox · Disabled(판단값)">
          <Checkbox disabled />
        </Sample>
        <Sample label="Checkbox · Disabled+Checked(판단값)">
          <Checkbox disabled defaultChecked />
        </Sample>
      </Section>

      <Section title="Progress Bar">
        <Sample label="Progress · 78%">
          <Progress value={78} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 0%">
          <Progress value={0} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 50%">
          <Progress value={50} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 100%">
          <Progress value={100} className="w-[160px]" />
        </Sample>
      </Section>

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          Filter (트리거 + 플라이아웃 + 활성 태그, 통합 컴포넌트)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          &ldquo;필터 추가&rdquo; 클릭 → 카테고리 선택 → 체크박스 선택 → 트리거 옆에 태그
          자동 표시(1개 선택 시 개수 뱃지, 2개 이상이면 &ldquo;전체보기&rdquo;) → 태그의
          X로 선택 해제. 좁은 그리드에서 팝업이 옆 카드와 겹쳐 보이는 문제 때문에 이
          컴포넌트만 별도 넓은 영역에 배치함.
        </p>
        <Filter
          categories={filterCategories}
          value={filterValue}
          onChange={(categoryId, optionIds) =>
            setFilterValue((prev) => ({ ...prev, [categoryId]: optionIds }))
          }
        />
      </section>

      <Section title="Tag (범용 3색 — 실사용 빈도 낮음, Badge를 우선 사용)">
        <Sample label="Tag · main · start+endIcon(실측 그대로)">
          <Tag color="main" startIcon={<X className="size-3" />} endIcon={<X className="size-3" />}>
            태그 텍스트
          </Tag>
        </Sample>
        <Sample label="Tag · gray · endIcon만(실사용 예시)">
          <Tag color="gray" endIcon={<X className="size-3" />}>태그 텍스트</Tag>
        </Sample>
        <Sample label="Tag · red · 아이콘 없음">
          <Tag color="red">태그 텍스트</Tag>
        </Sample>
      </Section>

      <Section title="Combobox (검색 내장 셀렉트)">
        <Sample label="Combobox · Default(제어형, 검색 가능)">
          <Combobox
            options={shiftOptions}
            value={comboValue}
            onValueChange={setComboValue}
            placeholder="근무조 선택"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Default(비제어, 초기값 있음)">
          <Combobox
            options={shiftOptions}
            defaultValue="night"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Small(비제어, 초기값 있음)">
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            searchPlaceholder="BOM 검색"
            size="small"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Small · Disabled">
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            size="small"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Default · Disabled">
          <Combobox
            options={shiftOptions}
            placeholder="내용 입력"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · 커스텀 아이콘(꺾쇠 대신)">
          <Combobox
            options={shiftOptions}
            placeholder="정렬 기준"
            searchPlaceholder="검색"
            icon={<SlidersHorizontal className="size-3.5 shrink-0 opacity-80" />}
            className="w-[200px]"
          />
        </Sample>
      </Section>
    </div>
  );
}
