import { ButtonSize, ButtonVariant, ButtonProps } from "./Button.type";
import cn from "@/utils/style";

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
  "inline-flex items-center justify-center border transition-colors duration-200 ease-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue-500)] data-[full-width=true]:w-full cursor-pointer";

const sizeClasses: Record<ButtonSize, string> = {
  xsmall:
    "px-[var(--spacing-300)] py-[var(--spacing-200)] rounded-[var(--radius-250)] gap-[var(--spacing-300)] typo-body-m-medium",
  small:
    "px-[var(--spacing-400)] py-[var(--spacing-250)] rounded-[var(--radius-300)] gap-[var(--spacing-300)] min-h-10 typo-body-l-medium",
  medium:
    "px-[var(--spacing-600)] py-[var(--spacing-350)] rounded-[var(--radius-300)] gap-[var(--spacing-200)] min-h-[2.625rem] typo-body-m-bold",
  large:
    "px-[var(--spacing-600)] py-[var(--spacing-350)] rounded-[var(--radius-300)] gap-[var(--spacing-200)] min-h-12 typo-body-l-bold",
  xlarge:
    "px-[var(--spacing-600)] py-[var(--spacing-350)] rounded-[var(--radius-400)] gap-[var(--spacing-200)] min-h-[3.125rem] typo-body-l-bold",
  xxlarge:
    "px-[var(--spacing-600)] py-[var(--spacing-350)] rounded-[var(--radius-400)] gap-[var(--spacing-200)] min-h-[3.375rem] typo-body-l-bold",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-button-primary-bg)] text-[var(--color-text-base)] border-transparent enabled:hover:bg-[var(--color-button-primary-bg-hover)] enabled:active:bg-[var(--color-button-primary-bg-pressed)] disabled:bg-[var(--color-button-primary-bg-disabled)]",
  secondary:
    "bg-[var(--color-white-100)] text-[var(--color-text-base)] border-[var(--color-border-normal)] enabled:hover:bg-[var(--color-gray-50)] enabled:active:bg-[var(--color-gray-100)] disabled:bg-[var(--color-gray-50)] disabled:border-[var(--color-border-normal)]",
};

const disabledClasses = "disabled:cursor-not-allowed disabled:text-[var(--color-text-sub)]";
//--------------------------------
