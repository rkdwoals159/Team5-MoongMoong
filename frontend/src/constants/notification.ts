export const NOTIFICATION_PAGE_SIZE = 10;

export const EVENT_TYPE_TITLE: Record<string, string> = {
  SAVING: "저금통 알림",
  NUDGE: "저금통 재촉 알림",
  AI_ADVICE_CREATED: "AI 의사 권장사항 생성 알림",
};

export const NOTIFICATION_TEXT = {
  TITLE: "알림",
  CLEAR_ALL: "모두 지우기",
  EMPTY: "새로운 알림이 없습니다.",
  LAST_SEEN_DIVIDER: "여기까지 읽었어요",
  DELETE_ARIA_LABEL: "알림 삭제",
  DEFAULT_CONTENT: "새로운 소식이 도착했어요!",
} as const;
