import * as React from "react";
import { cn } from "@/lib/utils";

export type FormGridColumns = 1 | 2;
export type FormGridDensity = "compact" | "comfortable";
export type FormFieldLabelWidth = "standard" | "wide";

export interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: FormGridColumns;
  density?: FormGridDensity;
}

const columnClasses: Record<FormGridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2 gap-x-6",
};

const densityClasses: Record<FormGridDensity, string> = {
  compact: "gap-y-2.5",
  comfortable: "gap-y-4",
};

/** MES 폼의 열 수와 행·열 간격을 소유하는 Section Pattern. */
function FormGrid({ columns = 1, density = "comfortable", className, ...props }: FormGridProps) {
  return <div className={cn("grid min-w-0", columnClasses[columns], densityClasses[density], className)} {...props} />;
}

export interface FormFieldRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  required?: boolean;
  labelWidth?: FormFieldLabelWidth;
  children: React.ReactNode;
}

const labelWidthClasses: Record<FormFieldLabelWidth, string> = {
  standard: "grid-cols-[100px_minmax(0,1fr)]",
  wide: "grid-cols-[108px_minmax(0,1fr)]",
};

/** label, required marker와 control의 수평 정렬을 한 상태에서 파생한다. */
function FormFieldRow({ label, required = false, labelWidth = "standard", className, children, ...props }: FormFieldRowProps) {
  const labelId = React.useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn("grid min-w-0 items-center gap-2 text-[14px]", labelWidthClasses[labelWidth], className)}
      {...props}
    >
      <span id={labelId} className="font-normal leading-[1.5] text-mes-gray-130">
        {label}
        {required && <span aria-hidden="true" className="ml-[3px] font-semibold text-mes-danger-60">*</span>}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export { FormFieldRow, FormGrid };
