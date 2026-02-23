import type { DropdownListBoxProps } from "@/components/ui/Dropdown/dropdown.type";
import DropdownListItem from "@/components/ui/Dropdown/DropdownListItem";
import { cn } from "@/utils/style";

const DropdownListBox = ({
  options,
  selectedValue,
  focusedIndex,
  onSelect,
  onMouseEnter,
  className,
}: DropdownListBoxProps) => {
  const listBoxClasses = cn(dropDownListBoxBaseClasses, className ?? "");

  return (
    <ul
      role="listbox"
      aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}
      className={listBoxClasses}
    >
      {options.map((option, index) => (
        <DropdownListItem
          key={`${option}-${index}`}
          option={option}
          index={index}
          isSelected={option === selectedValue}
          isFocused={index === focusedIndex}
          onSelect={onSelect}
          onMouseEnter={onMouseEnter}
        />
      ))}
    </ul>
  );
};

export default DropdownListBox;

//--------------------------------
// Tailwind CSS classes

// Dropdown list box styles
const dropDownListBoxBaseClasses =
  "absolute z-50 mt-200 bg-white-100 border border-border-normal rounded-300 shadow-lg w-full max-h-75 overflow-auto focus:outline-none";
//--------------------------------
