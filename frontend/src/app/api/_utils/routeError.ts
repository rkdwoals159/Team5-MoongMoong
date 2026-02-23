import { NextResponse } from "next/server";
import { API_ERROR_MESSAGES } from "@/api/constants";
import { isApiHttpError } from "@/api/utils/isApiHttpError";

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

export { isApiHttpError };

const getMessageFromBody = (body: unknown): string | undefined => {
  if (!isObjectRecord(body)) return undefined;
  const message = body.message;
  return typeof message === "string" && message.length > 0 ? message : undefined;
};

export const toApiRouteErrorResponse = (error: unknown): NextResponse => {
  if (isApiHttpError(error)) {
    const message = getMessageFromBody(error.body) ?? error.message ?? API_ERROR_MESSAGES.DEFAULT;
    return NextResponse.json({ message }, { status: error.status });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ message: "요청 본문 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { message: error.message || API_ERROR_MESSAGES.DEFAULT },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: API_ERROR_MESSAGES.DEFAULT }, { status: 500 });
};
