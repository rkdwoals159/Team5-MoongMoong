export type SSEProps = {
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  connectionToken?: string | null;
};

export type SSEEventType = "SAVING" | "NUDGE";

export type SavingEvent = {
  event: "SAVING";
  data: {
    coinId: number;
    amount: number;
    name: string;
  };
};

export type NudgeEvent = {
  event: "NUDGE";
  data: {
    memberName: string;
  };
};

export type SSEEvent = SavingEvent | NudgeEvent;
export type SSEConnectionStatus = "connecting" | "open" | "closed";

export type ParsedSSEEvent = {
  id?: string;
  event?: string;
  retry?: number;
  data: unknown;
};

export type ParseResult = {
  events: ParsedSSEEvent[];
  lastPart: string;
};

export type ServerEventContextType = {
  lastEvent: SSEEvent | null;
  setLastEvent: (event: SSEEvent) => void;
};
