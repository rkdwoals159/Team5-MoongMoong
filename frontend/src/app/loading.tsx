//전역 로딩 컴포넌트
import Loading from "@/components/common/Loading/Loading";

export default function GlobalLoading() {
  return (
    <div
      className="absolute inset-0 bg-white-100 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="페이지를 불러오는 중입니다"
    >
      <Loading count={3} height={24} />
    </div>
  );
}
