import ChevronDownIcon from "@/assets/components/ic_arrow_down.svg";
import cn from "@/utils/style";

type ChevronIconProps = {
  isOpen: boolean;
  className?: string;
};

const ChevronIcon = ({ isOpen, className = "" }: ChevronIconProps) => {
  const chevronIconClasses = cn(
    "transition-transform duration-200",
    isOpen ? "rotate-180" : "",
    className,
  );
  return <ChevronDownIcon className={chevronIconClasses} />;
};

export default ChevronIcon;
