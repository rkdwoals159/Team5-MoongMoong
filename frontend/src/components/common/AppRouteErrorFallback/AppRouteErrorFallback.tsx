"use client";

import Button from "@/components/common/Button/Button";

type AppRouteErrorFallbackProps = {
  error: Error & { digest?: string };
  action: () => void;
};

export default function AppRouteErrorFallback({ error, action }: AppRouteErrorFallbackProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="whitespace-pre-line text-center typo-title-m-bold text-gray-800">
        {error.message}
      </h1>
      <Button variant="secondary" size="medium" className="mt-6 w-1/5" onClick={action}>
        다시 시도하기
      </Button>
    </div>
  );
}
