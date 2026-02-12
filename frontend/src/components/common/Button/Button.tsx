import type { ButtonSize, ButtonVariant, ButtonProps } from "./button.type";
import { cn } from "@/utils/style";

const Button = ({
  variant = "primary",
  size = "medium",
  className,
  children,
  isDisabled = false,
  fullWidth = false,
  ...rest
}: ButtonProps) => {
  const classes: string[] = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabledClasses,
    className ?? "",
  ];

  return (
    <button
      {...rest}
      className={cn(...classes)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? "true" : "false"}
      disabled={isDisabled}
    >
      <span className="inline-flex items-center gap-[inherit]">{children}</span>
    </button>
  );
};

export default Button;

//--------------------------------
// Tailwind CSS classes
const baseClasses =
  "inline-flex items-center justify-center border transition-colors duration-200 ease-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-[full-width=true]:w-full cursor-pointer";

const sizeClasses: Record<ButtonSize, string> = {
  xsmall: "px-300 py-200 rounded-250 gap-300 typo-body-m-medium",
  small: "px-400 py-250 rounded-300 gap-300 min-h-10 typo-body-l-medium",
  medium: "px-600 py-350 rounded-300 gap-200 min-h-[2.625rem] typo-body-m-bold",
  large: "px-600 py-350 rounded-300 gap-200 min-h-12 typo-body-l-bold",
  xlarge: "px-600 py-350 rounded-400 gap-200 min-h-[3.125rem] typo-body-l-bold",
  xxlarge: "px-600 py-350 rounded-400 gap-200 min-h-[3.375rem] typo-body-l-bold",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-yellow-300 text-text-base border-transparent enabled:hover:bg-yellow-400 enabled:active:bg-yellow-500 disabled:bg-gray-50",
  secondary:
    "bg-white-100 text-text-base border-border-normal enabled:hover:bg-gray-50 enabled:active:bg-gray-100 disabled:bg-gray-50 disabled:border-border-normal",
};

const disabledClasses = "disabled:cursor-not-allowed disabled:text-text-sub";
//--------------------------------
