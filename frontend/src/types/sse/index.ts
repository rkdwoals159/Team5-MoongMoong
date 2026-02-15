export type SSEProps = {
  url: string;
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
};

export type SSEEventType = "SAVING";

export type SavingEvent = {
  event: "SAVING";
  data: {
    coinId: number;
    createdAt: string;
    amount: number;
    name: string;
  };
};

export type SSEEvent = SavingEvent;
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
