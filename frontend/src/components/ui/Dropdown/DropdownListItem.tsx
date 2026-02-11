import type { DropdownListItemProps } from "@/components/ui/Dropdown/dropdown.type";
import CheckIcon from "@/assets/components/ic_check_medium.svg";
import { cn } from "@/utils/style";

const DropdownListItem = ({
  option,
  index,
  isSelected,
  isFocused,
  onSelect,
  onMouseEnter,
}: DropdownListItemProps) => {
  return (
    <li
      id={`option-${index}`}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(option)}
      onMouseEnter={() => onMouseEnter(index)}
      className={cn(
        dropDownItemBaseClasses,
        isSelected ? selectedDropDownItemClasses : "",
        isFocused ? focusedDropDownItemClasses : "",
      )}
    >
      {isSelected && <CheckIcon width={16} height={16} className="text-gray-800" />}
      {option}
    </li>
  );
};

export default DropdownListItem;

//--------------------------------
// Tailwind CSS classes

// Dropdown item styles
const dropDownItemBaseClasses =
  "px-500 py-350 cursor-pointer transition-colors duration-150 flex items-center gap-400 text-gray-800 typo-body-l-medium select-none";

const selectedDropDownItemClasses = "bg-yellow-100";

const focusedDropDownItemClasses = "bg-gray-50";
//--------------------------------
