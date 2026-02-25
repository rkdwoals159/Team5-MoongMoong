"use client";
import ServerErrorImage from "@/assets/server_error.svg";

const GLOBAL_ERROR_MESSAGE = "페이지에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex flex-col items-center justify-center h-screen">
        <ServerErrorImage width={517} height={376} />
        <h1 className="typo-title-m-bold text-gray-800 whitespace-pre-line text-center">
          {GLOBAL_ERROR_MESSAGE}
        </h1>
        <button
          onClick={() => reset()}
          className="mt-6 w-1/5 inline-flex items-center justify-center border border-border-normal bg-white-100 text-text-base px-600 py-350 rounded-300 typo-body-m-bold transition-colors duration-200 ease-out hover:bg-gray-50 active:bg-gray-100"
        >
          다시 시도하기
        </button>
      </body>
    </html>
  );
}
