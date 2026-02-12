import { HeaderProps } from "./Header.type";
import HeaderUserActions from "./HeaderUserActions";
import cn from "@/utils/style";

const Header = ({ className, ...rest }: HeaderProps) => {
  return (
    <header
      {...rest}
      className={cn(
        "flex w-full items-center justify-end gap-600 pr-1000 pt-600 select-none",
        className ?? "",
      )}
    >
      <HeaderUserActions />
    </header>
  );
};

export default Header;
