import { cn } from "@/utils/style";
import type { RadioButtonProps } from "./radioButton.type";

const RadioButton = ({ isChecked = false, className, ...rest }: RadioButtonProps) => {
  const checked = rest.checked ?? isChecked;

  return (
    <label className={cn("inline-flex items-center", className ?? "")}>
      <input {...rest} type="radio" className="sr-only" checked={checked} aria-checked={checked} />
      <span className={outerClasses}>
        <span
          className={cn(
            ringClasses,
            checked ? ringCheckedClasses : ringUncheckedClasses,
            "border-[1.5px]",
          )}
        >
          {checked ? <span className={dotClasses} /> : null}
        </span>
      </span>
    </label>
  );
};

export default RadioButton;

//--------------------------------
// Tailwind CSS classes
const outerClasses = "inline-flex items-center justify-center w-6 h-6";

const ringClasses = "inline-flex items-center justify-center w-4 h-4 rounded-full border";

const ringUncheckedClasses = "border-gray-500";

const ringCheckedClasses = "border-yellow-500";

const dotClasses = "w-1.5 h-1.5 rounded-full bg-yellow-500";
