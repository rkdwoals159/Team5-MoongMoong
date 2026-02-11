import { cn } from "@/utils/style";
import type { CheckboxProps } from "./checkBox.type";

const Checkbox = ({ isChecked = false, className, disabled, ...rest }: CheckboxProps) => {
  return (
    <label
      className={cn(
        "h-full w-full inline-flex gap-200 items-center justify-center",
        disabled ? "cursor-not-allowed text-text-sub" : "cursor-pointer",
        className ?? "",
      )}
    >
      <span className="relative inline-flex items-center justify-center w-5 h-5">
        <input
          {...rest}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          aria-checked={isChecked}
          disabled={disabled}
        />
        <span
          className={cn(
            "inline-flex items-center justify-center w-4 h-4 rounded-100 border transition-colors duration-150 border-gray-100",
            disabled ? "bg-gray-50" : "bg-white",
          )}
        >
          {isChecked && (
            <svg className="w-5 h-5" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 8.5 6.5 11 12 5.5"
                fill="none"
                stroke="var(--color-yellow-500)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
    </label>
  );
};

export default Checkbox;
