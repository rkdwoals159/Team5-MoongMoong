import { DEFAULT_ERROR_MESSAGE } from "@/constants";

type ServerComponentErrorFallbackProps = {
  message?: string;
};

export default function ServerComponentErrorFallback({
  message,
}: ServerComponentErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-600">
      <p className="typo-body-l-medium text-text-sub">{message ?? DEFAULT_ERROR_MESSAGE}</p>
    </div>
  );
}
