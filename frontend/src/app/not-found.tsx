import Link from "next/link";
import NotFoundImage from "@/assets/not_found.svg";
import Button from "@/components/common/Button/Button";

const NOT_FOUND_MESSAGE =
  "요청하신 페이지를 찾을 수 없습니다.\n입력하신 주소가 정확한지 다시 한번 확인해주세요.";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <NotFoundImage width={517} height={376} />
      <h1 className="typo-title-m-bold text-gray-800 whitespace-pre-line text-center">
        {NOT_FOUND_MESSAGE}
      </h1>
      <Button variant="secondary" size="medium" className="mt-6 w-1/5">
        <Link href="/dashboard">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
