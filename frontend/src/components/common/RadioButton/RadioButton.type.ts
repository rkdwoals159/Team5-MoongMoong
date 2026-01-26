import type { InputHTMLAttributes } from "react";

export type RadioButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  isChecked?: boolean;
};
