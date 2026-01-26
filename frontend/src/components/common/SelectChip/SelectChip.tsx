import { SelectChipProps } from "./SelectChip.type";
import cn from "@/utils/style";

const SelectChip = ({ label, code, onSelect, className, ...rest }: SelectChipProps) => {
  const classes = [baseClasses, className ?? ""];

  const handleClick = () => {
    if (code) onSelect?.(code);
  };

  return (
    <button type="button" {...rest} className={cn(...classes)} onClick={handleClick}>
      <span className={labelClasses}>{label}</span>
    </button>
  );
};

export default SelectChip;

//--------------------------------
// Tailwind CSS classes
const baseClasses =
  "inline-flex items-center justify-center h-[50px] w-[156px] px-[20px] py-[14px] rounded-[6px] border border-[var(--color-gray-100)] bg-[var(--color-white-100)] text-[var(--color-gray-600)] cursor-pointer select-none transition-colors duration-150 ease-out hover:bg-[var(--color-yellow-50)] active:bg-[var(--color-yellow-150)] data-[selected=true]:bg-[var(--color-yellow-100)] data-[selected=true]:border-2 data-[selected=true]:border-[var(--color-yellow-300)] data-[selected=true]:text-[var(--color-gray-800)]";

const labelClasses = "typo-body-l-medium";
//--------------------------------
