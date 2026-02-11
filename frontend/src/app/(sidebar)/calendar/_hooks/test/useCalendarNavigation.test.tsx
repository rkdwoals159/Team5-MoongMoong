import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import useCalendarNavigation from "@/app/(sidebar)/calendar/_hooks/useCalendarNavigation";

// 테스트용 컴포넌트
function TestComponent({
  isCurrentMonth,
  prevMonthParam,
  nextMonthParam,
  todayMonthParam,
  todayDateParam,
}: {
  isCurrentMonth: boolean;
  prevMonthParam: string;
  nextMonthParam: string;
  todayMonthParam: string;
  todayDateParam: string;
}) {
  const { handlePrev, handleNext, handleToday } = useCalendarNavigation({
    isCurrentMonth,
    prevMonthParam,
    nextMonthParam,
    todayMonthParam,
    todayDateParam,
  });

  return (
    <div>
      <button data-testid="prev-button" onClick={handlePrev}>
        이전 월
      </button>
      <button data-testid="next-button" onClick={handleNext}>
        다음 월
      </button>
      <button data-testid="today-button" onClick={handleToday}>
        오늘
      </button>
    </div>
  );
}

describe("useCalendarNavigation", () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // setup.ts에서 모킹된 useRouter 사용
    const mockRouter = vi.mocked(useRouter)();
    mockPush = mockRouter.push as ReturnType<typeof vi.fn>;
    mockPush.mockClear(); // 이전 호출 기록 초기화
  });

  describe("handlePrev", () => {
    it("prevMonthParam으로 이동", () => {
      render(
        <TestComponent
          isCurrentMonth={false}
          prevMonthParam="2026-01"
          nextMonthParam="2026-03"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const prevButton = screen.getByTestId("prev-button");
      prevButton.click();

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("?month=2026-01");
    });
  });

  describe("handleNext", () => {
    it("nextMonthParam으로 이동", () => {
      render(
        <TestComponent
          isCurrentMonth={false}
          prevMonthParam="2026-01"
          nextMonthParam="2026-03"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const nextButton = screen.getByTestId("next-button");
      nextButton.click();

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("?month=2026-03");
    });
  });

  describe("handleToday", () => {
    it("isCurrentMonth가 false일 때 todayMonthParam과 todayDateParam으로 이동", () => {
      render(
        <TestComponent
          isCurrentMonth={false}
          prevMonthParam="2026-04"
          nextMonthParam="2026-06"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const todayButton = screen.getByTestId("today-button");
      todayButton.click();

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("?month=2026-02&selected=2026-02-10");
    });

    it("isCurrentMonth가 true일 때 router.push 호출하지 않음", () => {
      render(
        <TestComponent
          isCurrentMonth={true}
          prevMonthParam="2026-01"
          nextMonthParam="2026-03"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const todayButton = screen.getByTestId("today-button");
      todayButton.click();

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("통합 시나리오", () => {
    it("여러 핸들러를 순차적으로 호출", () => {
      render(
        <TestComponent
          isCurrentMonth={false}
          prevMonthParam="2026-01"
          nextMonthParam="2026-03"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const prevButton = screen.getByTestId("prev-button");
      const nextButton = screen.getByTestId("next-button");
      const todayButton = screen.getByTestId("today-button");

      // 이전 월
      prevButton.click();
      expect(mockPush).toHaveBeenCalledWith("?month=2026-01");

      // 다음 월
      nextButton.click();
      expect(mockPush).toHaveBeenCalledWith("?month=2026-03");

      // 오늘
      todayButton.click();
      expect(mockPush).toHaveBeenCalledWith("?month=2026-02&selected=2026-02-10");

      expect(mockPush).toHaveBeenCalledTimes(3);
    });

    it("현재 월에서 prev/next는 동작하지만 today는 동작하지 않음", () => {
      render(
        <TestComponent
          isCurrentMonth={true}
          prevMonthParam="2026-01"
          nextMonthParam="2026-03"
          todayMonthParam="2026-02"
          todayDateParam="2026-02-10"
        />,
      );

      const prevButton = screen.getByTestId("prev-button");
      const nextButton = screen.getByTestId("next-button");
      const todayButton = screen.getByTestId("today-button");

      prevButton.click();
      expect(mockPush).toHaveBeenCalledTimes(1);

      nextButton.click();
      expect(mockPush).toHaveBeenCalledTimes(2);

      todayButton.click();
      expect(mockPush).toHaveBeenCalledTimes(2); // 변화 없음
    });
  });
});
