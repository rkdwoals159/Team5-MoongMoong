"use client";
import Button from "@/components/common/Button/Button";
import ServerError from "@/assets/server_error.svg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ServerError width={517} height={376} />
      <h1 className="typo-title-m-bold text-gray-800 whitespace-pre-line text-center">
        {error.message}
      </h1>
      <Button variant="secondary" size="medium" className="mt-6 w-1/5" onClick={() => reset()}>
        다시 시도하기
      </Button>
    </div>
  );
}
