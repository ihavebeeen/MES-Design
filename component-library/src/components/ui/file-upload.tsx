"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  label?: string;
  helpText?: string;
  onFilesChange?: (files: File[]) => void;
  showSelection?: boolean;
}

/** 파일 선택과 드롭을 같은 계약으로 제공하며 업로드 전송 자체는 호출부가 담당한다. */
export function FileUpload({ className, label = "파일을 선택하거나 이 영역에 놓으세요", helpText, onFilesChange, showSelection = true, multiple = false, disabled, ...props }: FileUploadProps) {
  const [fileNames, setFileNames] = React.useState<string[]>([]);

  const commitFiles = (files: File[]) => {
    const acceptedFiles = multiple ? files : files.slice(0, 1);
    setFileNames(acceptedFiles.map((file) => file.name));
    onFilesChange?.(acceptedFiles);
  };

  return (
    <div className={cn("min-w-0", className)}>
      <label
        className={cn(
          "flex min-h-28 flex-col items-center justify-center gap-2 rounded-mes-control border border-dashed border-mes-gray-50 bg-mes-gray-10 px-4 text-center",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (!disabled) commitFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <span className="text-[14px] font-semibold text-mes-gray-110">{label}</span>
        {helpText && <span className="text-[12px] text-mes-gray-60">{helpText}</span>}
        <Input
          {...props}
          type="file"
          multiple={multiple}
          disabled={disabled}
          className="!absolute !h-px !w-px !overflow-hidden !border-0 !p-0 opacity-0"
          onChange={(event) => commitFiles(Array.from(event.target.files ?? []))}
        />
      </label>
      {showSelection && fileNames.length > 0 && <p className="mt-2 text-[12px] text-mes-gray-80">선택됨: {fileNames.join(", ")}</p>}
    </div>
  );
}
