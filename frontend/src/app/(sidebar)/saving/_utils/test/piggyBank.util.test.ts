import { describe, it, expect, vi, beforeEach } from "vitest";
import { PIGGY_BANK } from "@/app/(sidebar)/saving/_constants";

// matter-js 모킹
vi.mock("matter-js", () => {
  const mockBodies = {
    rectangle: vi.fn(
      (x: number, y: number, w: number, h: number, opts?: Record<string, unknown>) => ({
        type: "rectangle",
        position: { x, y },
        width: w,
        height: h,
        ...opts,
      }),
    ),
    circle: vi.fn((x: number, y: number, radius: number, opts?: Record<string, unknown>) => ({
      type: "circle",
      position: { x, y },
      circleRadius: radius,
      ...opts,
    })),
  };

  const mockQuery = {
    point: vi.fn(() => []),
  };

  return { Bodies: mockBodies, Query: mockQuery };
});

import { Bodies, Query } from "matter-js";
import { createWalls, createCoinBody, findTooltipTarget } from "../piggyBank.util";
import type { Engine } from "matter-js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("piggyBank utils", () => {
  describe("createWalls", () => {
    it("항상 3개의 벽(바닥, 좌, 우)을 반환", () => {
      const walls = createWalls(800, 420);
      expect(walls).toHaveLength(3);
    });

    it("모든 벽이 isStatic: true", () => {
      const walls = createWalls(800, 420);
      walls.forEach((wall) => {
        expect(wall).toHaveProperty("isStatic", true);
      });
    });
  });

  describe("createCoinBody", () => {
    const size = { width: 800, height: 420 };

    it("유효한 Body 객체를 반환", () => {
      const body = createCoinBody("홍길동", 5000, "2025-01-15T09:00:00Z", 100000, size);
      expect(body).toBeDefined();
      expect(Bodies.circle).toHaveBeenCalled();
    });

    it("plugin.toolTip에 금액과 날짜가 포함", () => {
      createCoinBody("홍길동", 5000, "2025-01-15T09:00:00Z", 100000, size);

      const callArgs = vi.mocked(Bodies.circle).mock.calls[0]!;
      const options = callArgs[3] as { plugin: { toolTip: string } };

      expect(options.plugin.toolTip).toContain("5,000");
      expect(options.plugin.toolTip).toContain("2025");
    });

    it("plugin.label에 입금자 이름이 설정", () => {
      createCoinBody("홍길동", 5000, "2025-01-15T09:00:00Z", 100000, size);

      const callArgs = vi.mocked(Bodies.circle).mock.calls[0]!;
      const options = callArgs[3] as { plugin: { label: string } };

      expect(options.plugin.label).toBe("홍길동");
    });

    it("targetAmount가 0일 때 에러 없이 생성 (safeTarget=1 방어)", () => {
      expect(() => {
        createCoinBody("홍길동", 5000, "2025-01-15T09:00:00Z", 0, size);
      }).not.toThrow();
    });

    it("반지름이 MIN_RADIUS ~ (height/2 - MIN_RADIUS) 범위 내", () => {
      createCoinBody("홍길동", 5000, "2025-01-15T09:00:00Z", 100000, size);

      const callArgs = vi.mocked(Bodies.circle).mock.calls[0]!;
      const radius = callArgs[2] as number;

      expect(radius).toBeGreaterThanOrEqual(PIGGY_BANK.MIN_RADIUS);
      expect(radius).toBeLessThanOrEqual(size.height / 2 - PIGGY_BANK.MIN_RADIUS);
    });
  });

  describe("findTooltipTarget", () => {
    const createMockCanvas = () =>
      ({
        getBoundingClientRect: () => ({ left: 0, top: 0 }),
      }) as unknown as HTMLCanvasElement;

    const createMockEngine = () =>
      ({
        world: { bodies: [] },
      }) as unknown as Engine;

    const createMockMouseEvent = (x: number, y: number) =>
      ({ clientX: x, clientY: y }) as MouseEvent;

    it("toolTip이 있는 Body 위에서 ToolTipState 반환", () => {
      const mockBody = { plugin: { toolTip: "저금 금액: 5,000원" } };
      vi.mocked(Query.point).mockReturnValueOnce([mockBody] as never);

      const result = findTooltipTarget(
        createMockEngine(),
        createMockCanvas(),
        createMockMouseEvent(100, 200),
      );

      expect(result).toEqual({
        visible: true,
        x: 100,
        y: 200,
        text: "저금 금액: 5,000원",
      });
    });

    it("동전이 없는 빈 영역에서 null 반환", () => {
      vi.mocked(Query.point).mockReturnValueOnce([] as never);

      const result = findTooltipTarget(
        createMockEngine(),
        createMockCanvas(),
        createMockMouseEvent(100, 200),
      );

      expect(result).toBeNull();
    });
  });
});
