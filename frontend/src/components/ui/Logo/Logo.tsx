import Link from "next/link";

import LogoImage from "@/assets/icons/sidebar/logo_home.svg";
import { cn } from "@/utils/style";

interface LogoProps {
  href?: string;
  ariaLabel?: string;
  className?: string;
  imageClassName?: string;
}

/**
 * Logo 컴포넌트
 *
 * 홈페이지 로고를 표시하고 클릭 시 메인 페이지('/')로 이동하는 링크 컴포넌트
 *
 * @component
 * @param {string} className - 추가할 CSS 클래스명
 */
const Logo = ({
  href = "/",
  ariaLabel = "메인 페이지로 이동",
  className = "",
  imageClassName = "",
}: LogoProps) => {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        className,
      )}
    >
      <LogoImage className={imageClassName} aria-hidden="true" />
    </Link>
  );
};

export default Logo;
