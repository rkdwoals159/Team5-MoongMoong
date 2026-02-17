import Link from "next/link";
import NotFoundImage from "@/assets/not_found.svg";

const NOT_FOUND_MESSAGE =
  "요청하신 페이지를 찾을 수 없습니다.\n입력하신 주소가 정확한지 다시 한번 확인해주세요.";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NotFoundImage width={517} height={376} />
      <h1 className="typo-title-m-bold text-gray-800 whitespace-pre-line text-center">
        {NOT_FOUND_MESSAGE}
      </h1>
      <Link
        href="/dashboard"
        className="mt-6 w-1/5 inline-flex items-center justify-center border border-border-normal bg-white-100 text-text-base px-600 py-350 rounded-300 typo-body-m-bold transition-colors duration-200 ease-out hover:bg-gray-50 active:bg-gray-100"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
