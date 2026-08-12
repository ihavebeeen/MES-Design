export type DialogBodyPadding = "standard" | "none" | "horizontal";
export type DialogBodyScrollMode = "shell" | "content" | "none";
export type DialogBodyAlign = "center" | "stretch";

export const dialogBodyPaddingClasses: Record<DialogBodyPadding, string> = {
  standard: "px-5 pt-5",
  none: "p-0",
  horizontal: "px-5",
};

export const dialogBodyScrollClasses: Record<DialogBodyScrollMode, string> = {
  shell: "overflow-x-hidden overflow-y-auto",
  content: "overflow-hidden",
  none: "overflow-visible",
};

export const dialogBodyAlignClasses: Record<DialogBodyAlign, string> = {
  center: "items-center",
  stretch: "items-stretch",
};
