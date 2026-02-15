import type { ParseResult, ParsedSSEEvent } from "@/types/sse";

export function parseSSE(buffer: string): ParseResult {
  const events: ParsedSSEEvent[] = [];
  const normalized = buffer.replace(/\r\n/g, "\n");
  const parts = normalized.split("\n\n");
  const lastPart = parts.pop() ?? "";

  for (const part of parts) {
    if (!part.trim()) continue;

    let id: string | undefined;
    let event: string | undefined;
    let retry: number | undefined;
    const dataLines: string[] = [];

    for (const line of part.split("\n")) {
      if (line.startsWith("id:")) id = line.slice(3).trim();
      else if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
      else if (line.startsWith("retry:")) {
        const parsed = parseInt(line.slice(6).trim(), 10);
        if (Number.isFinite(parsed)) retry = parsed;
      }
    }

    if (dataLines.length === 0) continue;

    const raw = dataLines.join("\n");
    let data: unknown = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      // JSON이 아니면 원본 문자열 유지
    }
    events.push({
      id,
      event,
      retry,
      data,
    });
  }

  return { events, lastPart };
}
