import Link from "next/link";
import LogoImage from "@/assets/components/logo_home.svg";
import cn from "@/utils/style";

interface LogoProps {
  className?: string;
}

/**
 * Logo 컴포넌트
 *
 * 홈페이지 로고를 표시하고 클릭 시 메인 페이지('/')로 이동하는 링크 컴포넌트
 *
 * @component
 * @param {string} className - 추가할 CSS 클래스명
 */
const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={cn("inline-block p-850", className)}>
      <LogoImage />
    </Link>
  );
};

export default Logo;
