import LoadingIcon from "@/assets/components/loading_icon.svg";
import { useMemo } from "react";
import { LoadingProps } from "./Loading.type";
import "./loading.css";

/**
 * Loading 컴포넌트의 props 타입
 * @type {LoadingProps}
 * @property {number} count - 표시할 로딩 아이콘의 개수
 * @property {number} [height=24] - 로딩 아이콘의 높이 (px 단위, 기본값: 24)
 */
const Loading = ({ count, height = 24 }: LoadingProps) => {
  const loadingIcons = useMemo(() => {
    const width = (height * 66) / 56;
    return Array.from({ length: count }, (_, index) => (
      <LoadingIcon
        key={index}
        className={`loading-icon block [--animation-delay:${index * 0.2}s]`}
        width={width}
        height={height}
      />
    ));
  }, [count, height]);

  return <div className="flex items-center justify-center gap-600">{loadingIcons}</div>;
};

export default Loading;
