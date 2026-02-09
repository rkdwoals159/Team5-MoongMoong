/**
 * null, undefined, 빈 문자열, 공백만 있는 문자열을 제외하고 구분자로 연결
 */
export const joinNonEmpty = (values: (string | null | undefined)[], separator = ", "): string => {
  return values.filter((v) => v != null && String(v).trim() !== "").join(separator) || "";
};
