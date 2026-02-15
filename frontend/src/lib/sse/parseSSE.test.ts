import { describe, it, expect } from "vitest";
import { parseSSE } from "./parseSSE";

describe("parseSSE", () => {
  it("기본 이벤트를 파싱한다", () => {
    const buffer = "event: SAVING\ndata: hello\n\n";
    const { events, lastPart } = parseSSE(buffer);

    expect(events).toHaveLength(1);
    expect(events[0]?.event).toBe("SAVING");
    expect(events[0]?.data).toBe("hello");
    expect(lastPart).toBe("");
  });

  it("JSON data를 객체로 파싱한다", () => {
    const buffer = 'event: SAVING\ndata: {"name":"홍길동","amount":1000}\n\n';
    const { events } = parseSSE(buffer);

    expect(events[0]?.data).toEqual({ name: "홍길동", amount: 1000 });
  });

  it("다중 라인 JSON data 를 객체로 파싱한다", () => {
    const buffer = 'event: SAVING\ndata: {"name":"홍길동",\ndata:"amount":1000}\n\n';
    const { events } = parseSSE(buffer);

    expect(events[0]?.data).toEqual({ name: "홍길동", amount: 1000 });
  });

  it("JSON이 아닌 data는 원본 문자열을 유지한다", () => {
    const buffer = "event: SAVING\ndata: plain text\n\n";
    const { events } = parseSSE(buffer);

    expect(events[0]?.data).toBe("plain text");
  });

  it("여러 이벤트를 한 번에 파싱한다", () => {
    const buffer = "event: SAVING\ndata: first\n\nevent: SAVING\ndata: second\n\n";
    const { events } = parseSSE(buffer);

    expect(events).toHaveLength(2);
    expect(events[0]?.data).toBe("first");
    expect(events[1]?.data).toBe("second");
  });

  it("불완전한 마지막 청크를 lastPart로 반환한다", () => {
    const buffer = "event: SAVING\ndata: complete\n\nevent: SAVING\ndata: incomp";
    const { events, lastPart } = parseSSE(buffer);

    expect(events).toHaveLength(1);
    expect(events[0]?.data).toBe("complete");
    expect(lastPart).toBe("event: SAVING\ndata: incomp");
  });

  it("CRLF 구분자를 정상 처리한다", () => {
    const buffer = "event: SAVING\r\ndata: hello\r\n\r\n";
    const { events } = parseSSE(buffer);

    expect(events).toHaveLength(1);
    expect(events[0]?.data).toBe("hello");
  });

  it("id와 retry 필드를 파싱한다", () => {
    const buffer = "id: 42\nevent: SAVING\ndata: test\nretry: 3000\n\n";
    const { events } = parseSSE(buffer);

    expect(events[0]?.id).toBe("42");
    expect(events[0]?.retry).toBe(3000);
  });

  it("retry 값이 숫자가 아니면 undefined를 유지한다", () => {
    const buffer = "event: SAVING\ndata: test\nretry: abc\n\n";
    const { events } = parseSSE(buffer);

    expect(events[0]?.retry).toBeUndefined();
  });

  it("data 라인이 없는 이벤트는 무시한다", () => {
    const buffer = "event: SAVING\nid: 1\n\n";
    const { events } = parseSSE(buffer);

    expect(events).toHaveLength(0);
  });

  it("다중 data 라인을 개행으로 합친다", () => {
    const buffer = "event: SAVING\ndata: line1\ndata: line2\n\n";
    const { events } = parseSSE(buffer);

    expect(events[0]?.data).toBe("line1\nline2");
  });
});
